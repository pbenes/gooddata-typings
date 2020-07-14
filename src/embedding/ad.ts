// (C) 2020 GoodData Corporation
import {
    CommandFailed,
    IObjectMeta,
    IGdcMessageEvent,
    IGdcMessageEnvelope,
    CommandFailedData,
    isCommandFailedData,
    GdcProductName,
    getEventType,
    IDrillableItemsCommandBody,
    EmbeddedGdc
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
     * Note: AFM is omitted on purpose; it should be added by AD itself; create new type using Omit<>
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
    export type IGdcAdMessageEvent<T, TBody> = IGdcMessageEvent<GdcProductName.ANALYTICAL_DESIGNER, T, TBody>;

    /**
     * Base type for AD event data
     */
    export type IGdcAdMessageEnvelope<T, TBody> = IGdcMessageEnvelope<
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
        Redo = 'redo',

        /**
         * The command to add or update filter context
         */
        SetFilterContext = 'setFilterContext',

        /**
         * The command to remove filter item from current filter context
         */
        RemoveFilterContext = 'removeFilterContext'
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
         * Type represent that the insight editor is cleared
         */
        ClearFinished = 'clearFinished',

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
        Drill = 'drill',

        /**
         * Type represent that the filter context is changed
         */
        FilterContextChanged = 'filterContextChanged',

        /**
         * Type represent that the set filter context action is finished
         */
        SetFilterContextFinished = 'setFilterContextFinished',

        /**
         * Type represent that the remove filter context action is finished
         */
        RemoveFilterContextFinished = 'removeFilterContextFinished'
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

    /**
     * Set drillable items.
     *
     * Contract:
     *
     * - Drillable items can be set by uris or identifiers of insight's measures/attributes
     */
    export type DrillableItemsCommand = IGdcAdMessageEvent<GdcAdCommandType.DrillableItems, IDrillableItemsCommandBody>;

    /**
     * Data type of drillable items command
     *
     * Note: The main event data was wrapped to application and product data structure
     * @see IDrillableItemsCommandBody
     */
    export type DrillableItemsCommandData = IGdcAdMessageEnvelope<
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
    export type OpenInsightCommand = IGdcAdMessageEvent<GdcAdCommandType.OpenInsight, IOpenInsightCommandBody>;

    /**
     * Data type of open insight command
     *
     * Note: The main event data was wrapped to application and product data structure
     * @see IOpenInsightCommandBody
     */
    export type OpenInsightCommandData = IGdcAdMessageEnvelope<
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
    export type ClearCommand = IGdcAdMessageEvent<GdcAdCommandType.Clear, undefined>;

    /**
     * Data type of clear command
     *
     * Note: it has empty content and just wrapped to application and product data structure
     */
    export type ClearCommandData = IGdcAdMessageEnvelope<GdcAdCommandType.Clear, undefined>;

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
    export type SaveInsightCommand = IGdcAdMessageEvent<GdcAdCommandType.Save, ISaveCommandBody>;

    /**
     * Data type of save insight command
     *
     * Note: The main event data was wrapped to application and product data structure
     * @see ISaveCommandBody
     */
    export type SaveInsightCommandData = IGdcAdMessageEnvelope<
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
    export type SaveAsInsightCommand = IGdcAdMessageEvent<GdcAdCommandType.SaveAs, ISaveAsInsightCommandBody>;

    /**
     * Data type of save as insight command
     *
     * Note: The main event data was wrapped to application and product data structure
     * @see ISaveAsInsightCommandBody
     */
    export type SaveAsInsightCommandData = IGdcAdMessageEnvelope<
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
    export type ExportInsightCommand = IGdcAdMessageEvent<GdcAdCommandType.Export, IExportInsightCommandBody>;

    /**
     * Data type of export insight command
     *
     * Note: The main event data was wrapped to application and product data structure
     * @see IExportInsightCommandBody
     */
    export type ExportInsightCommandData = IGdcAdMessageEnvelope<
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
    export type UndoCommand = IGdcAdMessageEvent<GdcAdCommandType.Undo, undefined>;

    /**
     * Data type of undo command
     *
     * Note: it has empty content and just wrapped to application and product data structure
     */
    export type UndoCommandData = IGdcAdMessageEnvelope<GdcAdCommandType.Undo, undefined>;

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
    export type RedoCommand = IGdcAdMessageEvent<GdcAdCommandType.Redo, undefined>;

    /**
     * Data type of redo command
     *
     * Note: it has empty content and just wrapped to application and product data structure
     */
    export type RedoCommandData = IGdcAdMessageEnvelope<GdcAdCommandType.Redo, undefined>;

    /**
     * Type-guard checking whether an object is an instance of {@link RedoCommandData}
     *
     * @param obj - object to test
     */
    export function isRedoCommandData(obj: any): obj is RedoCommandData {
        return getEventType(obj) === GdcAdCommandType.Redo;
    }

    /**
     * Data type of SetFilterContext command
     */
    export type SetFilterContextCommandData = IGdcAdMessageEnvelope<
        GdcAdCommandType.SetFilterContext,
        EmbeddedGdc.IFilterContextContent
    >;

    /**
     * Add or update the filter context
     *
     * Contract:
     * - if filters are same with filters on the AD filter bar, then update the filters on the filter bar
     *   and apply the filters to insight
     * - if filters are new, then add them to the AD filter bar and apply to insight
     * - in-case the AD can not apply the filters, a CommandFailed will be posted. The reason could be
     *   - Filter is not existed in the dataset
     *   - Filter is existed but wrong elements input data
     *   - Exceed the limit number of filter items
     */
    export type SetFilterContextCommand = IGdcAdMessageEvent<
        GdcAdCommandType.SetFilterContext,
        EmbeddedGdc.IFilterContextContent
    >;

    /**
     * Type-guard checking whether an object is an instance of {@link SetFilterContextCommand}
     *
     * @param obj - object to test
     */
    export function isSetFilterContextCommandData(obj: any): obj is SetFilterContextCommandData {
        return getEventType(obj) === GdcAdCommandType.SetFilterContext;
    }

    /**
     * Data type of removeFilterContext command
     */
    export type RemoveFilterContextCommandData = IGdcAdMessageEnvelope<
        GdcAdCommandType.RemoveFilterContext,
        EmbeddedGdc.IRemoveFilterContextContent
    >;

    /**
     * Remove the filter context
     * Contract:
     * - if filters are in the filter bar, then remove the filters on the filter bar and update insight
     * - if filters are not in the filter bar, then a CommandFailed will be posted.
     */
    export type RemoveFilterContextCommand = IGdcAdMessageEvent<
        GdcAdCommandType.RemoveFilterContext,
        EmbeddedGdc.IRemoveFilterContextContent
    >;

    /**
     * Type-guard checking whether an object is an instance of {@link RemoveFilterContextCommand}
     *
     * @param obj - object to test
     */
    export function isRemoveFilterContextCommandData(obj: any): obj is RemoveFilterContextCommandData {
        return getEventType(obj) === GdcAdCommandType.RemoveFilterContext;
    }

    //
    // Events
    //

    /**
     * List of available commands; this is included in each event sent by AD.
     */
    export interface IAvailableCommands {
        /**
         * Array of available commands types
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
    export type NewInsightInitialized = IGdcAdMessageEvent<
        GdcAdEventType.NewInsightInitialized,
        NewInsightInitializedBody
    >;

    /**
     * Data type of event that was emitted when the new insight initialized
     *
     * Note: it has empty content and just wrapped to application and product data structure
     */
    export type NewInsightInitializedData = IGdcAdMessageEnvelope<
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
    export type InsightOpened = IGdcAdMessageEvent<GdcAdEventType.InsightOpened, InsightOpenedBody>;

    /**
     * Data type of event that was emitted when an insight is opened
     *
     * Note: The main event data was wrapped to application and product data structure
     * @see InsightOpenedBody
     */
    export type InsightOpenedData = IGdcAdMessageEnvelope<
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
    // clear finished
    //

    /**
     * This event is emitted when AD successfully performs clear operation.
     */
    export type ClearFinished = IGdcAdMessageEvent<GdcAdEventType.ClearFinished, IAvailableCommands>;

    /**
     * Data type of event that was emitted after finish clear action
     *
     * Note: The main event data was wrapped to application and product data structure
     * @see UndoFinishedBody
     */
    export type ClearFinishedData = IGdcAdMessageEnvelope<
        GdcAdEventType.ClearFinished,
        IAvailableCommands
    >;

    /**
     * Type-guard checking whether an object is an instance of {@link ClearFinishedData}
     *
     * @param obj - object to test
     */
    export function isClearFinishedData(obj: any): obj is ClearFinishedData {
        return getEventType(obj) === GdcAdEventType.ClearFinished;
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
    export type InsightSaved = IGdcAdMessageEvent<GdcAdEventType.InsightSaved, InsightSavedBody>;

    /**
     * Data type of event that was emitted when an insight is saved
     *
     * Note: The main event data was wrapped to application and product data structure
     * @see InsightSavedBody
     */
    export type InsightSavedData = IGdcAdMessageEnvelope<
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
    export type ExportFinished = IGdcAdMessageEvent<
        GdcAdEventType.ExportFinished,
        ExportFinishedBody
    >;

    /**
     * Data type of event that was emitted after an insight was exported
     *
     * Note: The main event data was wrapped to application and product data structure
     * @see ExportFinishedBody
     */
    export type ExportFinishedData = IGdcAdMessageEnvelope<
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
    export type UndoFinished = IGdcAdMessageEvent<GdcAdEventType.UndoFinished, UndoFinishedBody>;

    /**
     * Data type of event that was emitted after finish undo action
     *
     * Note: The main event data was wrapped to application and product data structure
     * @see UndoFinishedBody
     */
    export type UndoFinishedData = IGdcAdMessageEnvelope<
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
    export type RedoFinished = IGdcAdMessageEvent<GdcAdEventType.RedoFinished, RedoFinishedBody>;

    /**
     * Data type of event that was emitted after finish redo action
     *
     * Note: The main event data was wrapped to application and product data structure
     * @see RedoFinishedBody
     */
    export type RedoFinishedData = IGdcAdMessageEnvelope<
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

    //
    // setFilterContext finished
    //

    /**
     * Data type of event that was emitted after finishing set filter context
     *
     * Note: The main event data was wrapped to application and product data structure
     */
    export type SetFilterContextFinishedData = IGdcAdMessageEnvelope<
        GdcAdEventType.SetFilterContextFinished,
        IAvailableCommands
    >;

    //
    // removeFilterContext finished
    //

    /**
     * Data type of event that was emitted after finishing remove filter context
     *
     * Note: The main event data was wrapped to application and product data structure
     */
    export type RemoveFilterContextFinishedData = IGdcAdMessageEnvelope<
        GdcAdEventType.RemoveFilterContextFinished,
        IAvailableCommands
    >;

    //
    // FilterContext changed
    //

    /**
     * Main data of Filter context changed event
     */
    export type FilterContextChangedBody = IAvailableCommands & EmbeddedGdc.IFilterContextContent;

    /**
     * Data type of event that was emitted after finishing change filter context
     *
     * Note: The main event data was wrapped to application and product data structure
     */
    export type FilterContextChangedData = IGdcAdMessageEnvelope<
        GdcAdEventType.FilterContextChanged,
        FilterContextChangedBody
    >;
}
