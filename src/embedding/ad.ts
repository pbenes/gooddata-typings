// (C) 2020 GoodData Corporation
import {
    CommandFailed,
    IObjectMeta,
    IGdcMessageEvent,
    IGdcMessageEnvelope,
    CommandFailedData,
    isCommandFailedData,
    GdcProductName,
    getEventType
} from './common';
import { IBaseExportConfig } from '../Export';
import { VisualizationObject } from '../VisualizationObject';

/**
 * All interface, types, type-guard related to embedded analyticalDesigner
 */
export namespace EmbeddedAnalyticalDesigner {
    /**
     * Insight Export configuration
     *
     * Note: AFM is ommitted on purpose; it should be added by AD itself; create new type using Omit<>
     */
    export interface IInsightExportConfig extends IBaseExportConfig {
        /**
         * Include applied filters
         */
        includeFilterContext?: boolean;
    }

    /**
     * Base type for AD events
     */
    export type IADMessageEvent<T, TBody> = IGdcMessageEvent<GdcProductName.ANALYTICAL_DESIGNER, T, TBody>;

    /**
     * Base type for AD event data
     */
    export type IAdGdcMessageEnvelope<T, TBody> = IGdcMessageEnvelope<
        GdcProductName.ANALYTICAL_DESIGNER,
        T,
        TBody
    >;

    /**
     * All AD command Types
     */
    export enum GdcAdCommandType {
        /**
         * The command set drillable items
         */
        DrillableItems = 'drillableItems',

        /**
         * The command open an insight
         */
        OpenInsight = 'openInsight',

        /**
         * The command save an insight
         */
        Save = 'saveInsight',

        /**
         * The command save the insight as a new one
         */
        SaveAs = 'saveAsInsight',

        /**
         * The command export an insight
         */
        Export = 'exportInsight',

        /**
         * The command reset the insight editor to empty state
         */
        Clear = 'clear',

        /**
         * The command undo to previous state
         */
        Undo = 'undo',

        /**
         * The command redo to next state
         */
        Redo = 'redo'
    }

    /**
     * All event types on AD
     */
    export enum GdcAdEventType {
        /**
         * Type represent that Insight is saved
         */
        ListeningForDrillableItems = 'listeningForDrillableItems',

        /**
         * Type represent that a new insight is initialized
         */
        NewInsightInitialized = 'newInsightInitialized',

        /**
         * Type represent that the insight is opened
         */
        InsightOpened = 'insightOpened',

        /**
         * Type represent that the insight is saved
         *
         * Note: use `visualizationSaved` because of backward compatibility
         * @see visualizationSaved event on https://help.gooddata.com
         */
        InsightSaved = 'visualizationSaved',

        /**
         * Type represent that the undo action is finished
         */
        UndoFinished = 'undoFinished',

        /**
         * Type represent that the redo action is finished
         */
        RedoFinished = 'redoFinished',

        /**
         * Type represent that the export action is finished
         */
        ExportFinished = 'exportInsightFinished',

        /**
         * Type that drill performed
         */
        Drill = 'drill'
    }

    /**
     * This event will be emitted if AD runs into errors while processing the posted command.
     *
     * @remarks see {@link GdcErrorType} for types of errors that may fly
     */
    export type AdCommandFailed = CommandFailed<GdcProductName.ANALYTICAL_DESIGNER>;

    /**
     * Base type for the data of error events sent by AD
     * in case command processing comes to an expected or unexpected halt.
     */
    export type AdCommandFailedData = CommandFailedData<GdcProductName.ANALYTICAL_DESIGNER>;

    /**
     * Type-guard checking whether an object is an instance of {@link AdCommandFailedData}
     *
     * @param obj - object to test
     */
    export function isAdCommandFailedData(obj: any): obj is AdCommandFailedData {
        return isCommandFailedData<GdcProductName.ANALYTICAL_DESIGNER>(obj);
    }

    //
    // Drillable Items command
    //

    /**
     * Base type of drillable items command body
     */
    export interface ISimpleDrillableItemsCommandBody {
        /**
         * The array of uris of attributes or measures
         */
        uris?: string[];
        /**
         * The array of identifiers of attributes or measures
         */
        identifiers?: string[];
    }

    /**
     * The main data type for furture processing of drillable items command
     */
    export interface IDrillableItemsCommandBody extends ISimpleDrillableItemsCommandBody {
        /**
         * Master measures items - In-case, a derived measure is composed from a master measure.
         */
        composedFrom?: ISimpleDrillableItemsCommandBody;
    }

    /**
     * Set drillable items.
     *
     * Contract:
     *
     * - Drillable items can be set by uris or identifiers of insight's measures/attributes
     */
    export type DrillableItemsCommand = IADMessageEvent<GdcAdCommandType.DrillableItems, IDrillableItemsCommandBody>;

    /**
     * Data type of drillable items command
     *
     * Note: The main event data was wrapped to application and product data structure
     * @see IDrillableItemsCommandBody
     */
    export type DrillableItemsCommandData = IAdGdcMessageEnvelope<
        GdcAdCommandType.DrillableItems,
        IDrillableItemsCommandBody
    >;

    /**
     * Type-guard checking whether an object is an instance of {@link DrillableItemsCommandData}
     *
     * @param obj - object to test
     */
    export function isDrillableItemsCommandData(obj: any): obj is DrillableItemsCommandData {
        return getEventType(obj) === GdcAdCommandType.DrillableItems;
    }

    //
    // Open insight command
    //

    /**
     * Contain the information to contruct the AD url to open an insight editor
     */
    export interface IOpenInsightCommandBody {
        /**
         * Dataset identifier - A dataset consists of attributes and facts,
         * which correspond to data you want to measure and the data
         * that you want to use to segment or filter those measurements.
         */
        dataset?: string;

        /**
         * Project id
         */
        projectId?: string;

        /**
         * Client id - Each client has an identifier unique within the domain
         *
         * Note: use the combination of the data product ID and client ID instead of the project ID
         */
        clientId?: string;

        /**
         * Product id - A data product contains multiple segments. And a segment has clients assigned to it
         *
         * Note: use the combination of the data product ID and client ID instead of the project ID
         */
        productId?: string;

        /**
         * Insight id - leave it empty to reset the insight editor to empty state
         */
        insightId?: string;

        /**
         * Insight id - leave it empty to reset the insight editor to empty state
         *
         * Note: if both insightId and reportId are provided. the insightId will be use higher
         * with higher priority.
         */
        reportId?: string;

        /**
         * Show only the attributes, measures, facts, and dates with the specified tag
         */
        includeObjectsWithTags?: string;

        /**
         * Hide the attributes, measures, facts, and dates with the specified tag
         */
        excludeObjectsWithTags?: string;
    }

    /**
     * Open an insight.
     *
     * Contract:
     *
     * - if the insight could not found, then CommandFailed event will be posted
     * - after the insight is opened, then InsightOpened event will be posted
     *
     * Note: if insightId isn't provided, the empty insight editor will be opened
     */
    export type OpenInsightCommand = IADMessageEvent<GdcAdCommandType.OpenInsight, IOpenInsightCommandBody>;

    /**
     * Data type of open insight command
     *
     * Note: The main event data was wrapped to application and product data structure
     * @see IOpenInsightCommandBody
     */
    export type OpenInsightCommandData = IAdGdcMessageEnvelope<
        GdcAdCommandType.OpenInsight,
        IOpenInsightCommandBody
    >;

    /**
     * Type-guard checking whether an object is an instance of {@link OpenInsightCommandData}
     *
     * @param obj - object to test
     */
    export function isOpenInsightCommandData(obj: any): obj is OpenInsightCommandData {
        return getEventType(obj) === GdcAdCommandType.OpenInsight;
    }

    //
    // Clear command
    //

    /**
     * Triggers the clear action to reset the insight editor to empty state
     */
    export type ClearCommand = IADMessageEvent<GdcAdCommandType.Clear, undefined>;

    /**
     * Data type of clear command
     *
     * Note: it has empty content and just wrapped to application and product data structure
     */
    export type ClearCommandData = IAdGdcMessageEnvelope<GdcAdCommandType.Clear, undefined>;

    /**
     * Type-guard checking whether an object is an instance of {@link ClearCommandData}
     *
     * @param obj - object to test
     */
    export function isClearCommandData(obj: any): obj is ClearCommandData {
        return getEventType(obj) === GdcAdCommandType.Clear;
    }

    //
    // Save command
    //

    /**
     * Save command body sent by outer application
     */
    export interface ISaveCommandBody {
        /**
         * Insight title - use as title of new insight or rename of saved insight
         */
        title: string;
    }

    /**
     * Saves current insight.
     *
     * Contract:
     *
     * -  if currently edited insight IS NOT eligible for save (empty, in-error), then CommandFailed event
     *    will be posted
     * -  if the specified title is invalid / does not match title validation rules, then CommandFailed event
     *    will be posted
     * -  otherwise insight WILL be saved with the title as specified in the body and the InsightSaved event
     *    will be posted
     * -  the InsightSaved event will be posted even when saving insights that have not changed but are eligible
     *    for saving (not empty, not in-error)
     *
     * Note: sending SaveInsightCommand with different title means insight will be saved with that new title.
     */
    export type SaveInsightCommand = IADMessageEvent<GdcAdCommandType.Save, ISaveCommandBody>;

    /**
     * Data type of save insight command
     *
     * Note: The main event data was wrapped to application and product data structure
     * @see ISaveCommandBody
     */
    export type SaveInsightCommandData = IAdGdcMessageEnvelope<
        GdcAdCommandType.Save,
        ISaveCommandBody
    >;

    /**
     * Type-guard checking whether an object is an instance of {@link SaveInsightCommandData}
     *
     * @param obj - object to test
     */
    export function isSaveInsightCommandData(obj: any): obj is SaveInsightCommandData {
        return getEventType(obj) === GdcAdCommandType.Save;
    }

    //
    // Save As command
    //

    /**
     * Save As command body sent by outer application
     */
    export interface ISaveAsInsightCommandBody {
        /**
         * Insight title - use as title of new insight
         */
        readonly title: string;
    }

    /**
     * Saves current insight as a new object, with a different title. The title is specified
     *
     * Contract is same as {@link SaveInsightCommand}.
     */
    export type SaveAsInsightCommand = IADMessageEvent<GdcAdCommandType.SaveAs, ISaveAsInsightCommandBody>;

    /**
     * Data type of save as insight command
     *
     * Note: The main event data was wrapped to application and product data structure
     * @see ISaveAsInsightCommandBody
     */
    export type SaveAsInsightCommandData = IAdGdcMessageEnvelope<
        GdcAdCommandType.SaveAs,
        ISaveAsInsightCommandBody
    >;

    /**
     * Type-guard checking whether an object is an instance of {@link SaveAsInsightCommandData}
     *
     * @param obj - object to test
     */
    export function isSaveAsInsightCommandData(obj: any): obj is SaveAsInsightCommandData {
        return getEventType(obj) === GdcAdCommandType.SaveAs;
    }

    //
    // Export command
    //

    /**
     * Export command body sent by outer application
     */
    export interface IExportInsightCommandBody {
        /**
         * Configuration for exported file.
         *
         * @see IInsightExportConfig for more details about possible configuration options
         */
        readonly config: IInsightExportConfig;
    }

    /**
     * Exports current insight into CSV or XLSX. The export configuration matches that of the exportResult
     * function already available in gooddata-js. Please consult {@link IExportConfig} for more detail about
     * possible configuration options.
     *
     * Contract:
     *
     * -  if the currently edited insight IS eligible for export then it is done and the ExportFinished event will be
     *    posted with `link` to the result.
     * -  if the currently edited insight IS NOT eligible for export (empty, in-error), then CommandFailed event
     *    will be posted.
     * -  if the specified export config is invalid / does not match validation rules, then CommandFailed event
     *    will be posted
     */
    export type ExportInsightCommand = IADMessageEvent<GdcAdCommandType.Export, IExportInsightCommandBody>;

    /**
     * Data type of export insight command
     *
     * Note: The main event data was wrapped to application and product data structure
     * @see IExportInsightCommandBody
     */
    export type ExportInsightCommandData = IAdGdcMessageEnvelope<
        GdcAdCommandType.Export,
        IExportInsightCommandBody
    >;

    /**
     * Type-guard checking whether an object is an instance of {@link ExportInsightCommandData}
     *
     * @param obj - object to test
     */
    export function isExportInsightCommandData(obj: any): obj is ExportInsightCommandData {
        return getEventType(obj) === GdcAdCommandType.Export;
    }

    //
    // Undo
    //

    /**
     * Triggers the undo action.
     *
     * Contract:
     *
     * -  if it is valid to perform Undo operation, AD will do it and the UndoFinished will be posted once the
     *    undo completes
     *
     * -  if the Undo operation is not available in current state of AD, then CommandFailed will be posted
     */
    export type UndoCommand = IADMessageEvent<GdcAdCommandType.Undo, undefined>;

    /**
     * Data type of undo command
     *
     * Note: it has empty content and just wrapped to application and product data structure
     */
    export type UndoCommandData = IAdGdcMessageEnvelope<GdcAdCommandType.Undo, undefined>;

    /**
     * Type-guard checking whether an object is an instance of {@link UndoCommandData}
     *
     * @param obj - object to test
     */
    export function isUndoCommandData(obj: any): obj is UndoCommandData {
        return getEventType(obj) === GdcAdCommandType.Undo;
    }

    //
    // Redo
    //

    /**
     * Triggers the redo action.
     *
     * Contract:
     *
     * -  if it is valid to perform Redo operation, AD will do it and the RedoFinished will be posted once the
     *    redo completes
     *
     * -  if the Redo operation is not available in current state of AD, then CommandFailed will be posted
     */
    export type RedoCommand = IADMessageEvent<GdcAdCommandType.Redo, undefined>;

    /**
     * Data type of redo command
     *
     * Note: it has empty content and just wrapped to application and product data structure
     */
    export type RedoCommandData = IAdGdcMessageEnvelope<GdcAdCommandType.Redo, undefined>;

    /**
     * Type-guard checking whether an object is an instance of {@link RedoCommandData}
     *
     * @param obj - object to test
     */
    export function isRedoCommandData(obj: any): obj is RedoCommandData {
        return getEventType(obj) === GdcAdCommandType.Redo;
    }

    //
    // Events
    //

    /**
     * List of available commands; this is included in each event sent by AD.
     */
    export interface IAvailableCommands {
        /**
         * Array of avaiable commands types
         */
        availableCommands: GdcAdCommandType[];
    }

    //
    // New Insight Initialized
    //

    /**
     * It's main content is empty.
     */
    export type NewInsightInitializedBody = IAvailableCommands;

    /**
     * This event is emitted when AD initializes edit session for a new insight.
     */
    export type NewInsightInitialized = IADMessageEvent<
        GdcAdEventType.NewInsightInitialized,
        NewInsightInitializedBody
    >;

    /**
     * Data type of event that was emit when the new insight initialized
     *
     * Note: it has empty content and just wrapped to application and product data structure
     */
    export type NewInsightInitializedData = IAdGdcMessageEnvelope<
        GdcAdEventType.NewInsightInitialized,
        undefined
    >;

    /**
     * Type-guard checking whether an object is an instance of {@link NewInsightInitializedData}
     *
     * @param obj - object to test
     */
    export function isNewInsightInitializedData(obj: any): obj is NewInsightInitializedData {
        return getEventType(obj) === GdcAdEventType.NewInsightInitialized;
    }

    //
    // Insight Opened
    //

    /**
     * Main data of InsightOpened event
     */
    export type InsightOpenedBody = IAvailableCommands & {
        /**
         * The minimal opened insight information
         */
        insight: IObjectMeta;
    };

    /**
     * This event is emitted when AD initializes edit session for an existing insight. Essential detail about
     * the insight is included in the body.
     */
    export type InsightOpened = IADMessageEvent<GdcAdEventType.InsightOpened, InsightOpenedBody>;

    /**
     * Data type of event that was emit when an insight is opened
     *
     * Note: The main event data was wrapped to application and product data structure
     * @see InsightOpenedBody
     */
    export type InsightOpenedData = IAdGdcMessageEnvelope<
        GdcAdEventType.InsightOpened,
        InsightOpenedBody
    >;

    /**
     * Type-guard checking whether an object is an instance of {@link InsightOpenedData}
     *
     * @param obj - object to test
     */
    export function isInsightOpenedData(obj: any): obj is InsightOpenedData {
        return getEventType(obj) === GdcAdEventType.InsightOpened;
    }

    //
    // Insight Saved
    //

    /**
     * Main data of InsightSaved event
     *
     * Note: `visualizationObject` is keeped because of backward compatibility
     */
    export type InsightSavedBody = IAvailableCommands & VisualizationObject.IVisualization & {
        /**
         * The minimal saved insight information
         */
        insight: IObjectMeta;
    };

    /**
     * This event is emitted when AD saves the currently edited insight.
     */
    export type InsightSaved = IADMessageEvent<GdcAdEventType.InsightSaved, InsightSavedBody>;

    /**
     * Data type of event that was emit when an insight is saved
     *
     * Note: The main event data was wrapped to application and product data structure
     * @see InsightSavedBody
     */
    export type InsightSavedData = IAdGdcMessageEnvelope<
        GdcAdEventType.InsightSaved,
        InsightSavedBody
    >;

    /**
     * Type-guard checking whether an object is an instance of {@link InsightSavedData}
     *
     * @param obj - object to test
     */
    export function isInsightSavedData(obj: any): obj is InsightSavedData {
        return getEventType(obj) === GdcAdEventType.InsightSaved;
    }

    //
    // Export
    //

    /**
     * Main data of ExportFinished event
     */
    export type ExportFinishedBody = IAvailableCommands & {
        /**
         * Link to the file containing exported data.
         */
        link: string;
    };

    /**
     * This event is emitted when AD successfully exports data visualized by the currently edited insight.
     */
    export type ExportFinished = IADMessageEvent<
        GdcAdEventType.ExportFinished,
        ExportFinishedBody
    >;

    /**
     * Data type of event that was emit after an insight was exported
     *
     * Note: The main event data was wrapped to application and product data structure
     * @see ExportFinishedBody
     */
    export type ExportFinishedData = IAdGdcMessageEnvelope<
        GdcAdEventType.ExportFinished,
        ExportFinishedBody
    >;

    /**
     * Type-guard checking whether an object is an instance of {@link ExportFinishedData}
     *
     * @param obj - object to test
     */
    export function isExportFinishedData(obj: any): obj is ExportFinishedData {
        return getEventType(obj) === GdcAdEventType.ExportFinished;
    }

    //
    // Undo finished
    //

    /**
     * It's main content is empty.
     */
    export type UndoFinishedBody = IAvailableCommands;

    /**
     * This event is emitted when AD successfully performs Undo operation.
     */
    export type UndoFinished = IADMessageEvent<GdcAdEventType.UndoFinished, UndoFinishedBody>;

    /**
     * Data type of event that was emit after finish undo action
     *
     * Note: The main event data was wrapped to application and product data structure
     * @see UndoFinishedBody
     */
    export type UndoFinishedData = IAdGdcMessageEnvelope<
        GdcAdEventType.UndoFinished,
        UndoFinishedBody
    >;

    /**
     * Type-guard checking whether an object is an instance of {@link UndoFinishedData}
     *
     * @param obj - object to test
     */
    export function isUndoFinishedData(obj: any): obj is UndoFinishedData {
        return getEventType(obj) === GdcAdEventType.UndoFinished;
    }

    //
    // Redo finished
    //

    /**
     * It's main content is empty.
     */
    export type RedoFinishedBody = IAvailableCommands;

    /**
     * This event is emitted when AD successfully performs Undo operation.
     */
    export type RedoFinished = IADMessageEvent<GdcAdEventType.RedoFinished, RedoFinishedBody>;

    /**
     * Data type of event that was emit after finish redo action
     *
     * Note: The main event data was wrapped to application and product data structure
     * @see RedoFinishedBody
     */
    export type RedoFinishedData = IAdGdcMessageEnvelope<
        GdcAdEventType.RedoFinished,
        RedoFinishedBody
    >;

    /**
     * Type-guard checking whether an object is an instance of {@link RedoFinishedData}
     *
     * @param obj - object to test
     */
    export function isRedoFinishedData(obj: any): obj is RedoFinishedData {
        return getEventType(obj) === GdcAdEventType.RedoFinished;
    }
}
