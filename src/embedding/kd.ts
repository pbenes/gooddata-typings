// (C) 2020 GoodData Corporation
import {
    IGdcMessageEvent,
    getEventType,
    GdcProductName,
    IGdcMessageEnvelope,
    IDrillableItemsCommandBody
} from './common';

export namespace EmbeddedKpiDashboard {
    /**
     * Base type for KD events.
     */
    export type IKdGdcMessageEvent<T, TBody> = IGdcMessageEvent<GdcProductName.KPI_DASHBOARD, T, TBody>;

    /**
     * Base type for KD event data.
     */
    export type IKdGdcMessageEnvelope<T, TBody> = IGdcMessageEnvelope<GdcProductName.KPI_DASHBOARD, T, TBody>;

    /**
     * All KD command Types.
     */
    export enum GdcKdCommandType {
        /**
         * The command save a dashboard.
         */
        Save = 'saveDashboard',

        /**
         * The command cancel editing dashboard.
         */
        CancelEdit = 'cancelEdit',

        /**
         * The command delete existed dashboard.
         */
        Delete = 'deleteDashboard',

        /**
         * The command edit a dashboard.
         */
        SwitchToEdit = 'switchToEdit',

        /**
         * The command set drillable items.
         */
        DrillableItems = 'drillableItems',

        /**
         * The command set size of dashboard.
         */
        SetSize = 'setSize',

        /**
         * The command drill performed
         */
        Drill = 'drill'
    }

    /**
     * All KD event types.
     */
    export enum GdcKdEventType {
        /**
         * Type represent that the dashboard listening for drilling event.
         */
        ListeningForDrillableItems = 'listeningForDrillableItems',

        /**
         * Type represent that the embedded content starts loading.
         */
        LoadingStarted = 'loadingStarted',

        /**
         * Type represent that The user does not have permissions to view or edit the content.
         */
        NoPermissions = 'noPermissions',

        /**
         * Type represent that an operation increasing the height of the hosting iframe is performed.
         */
        Resized = 'resized',

        /**
         * Type represent that the dashboard has been created and saved.
         */
        DashboardCreated = 'dashboardCreated',

        /**
         * Type represent that the content is fully loaded,
         * and the user has permissions to access the dashboard.
         */
        DashboardLoaded = 'loaded',

        /**
         * Type represent that the existing dashboard has been updated.
         */
        DashboardUpdated = 'dashboardUpdated',

        /**
         * Type represent that the dashboard is saved.
         *
         */
        DashboardSaved = 'dashboardSaved',

        /**
         * Type represent that the dashboard is deleted.
         *
         */
        DashboardDeleted = 'dashboardDeleted',

        /**
         * Type represent that the user cancels the creation of the dashboard.
         */
        DashboardCreationCanceled = 'dashboardCreationCanceled',

        /**
         * Type represent that the dashboard is switched to edit mode.
         */
        SwitchedToEdit = 'switchedToEdit',

        /**
         * Type represent that the dashboard is switched to view mode.
         */
        SwitchedToView = 'switchedToView',

        /**
         * Type represent that the platform is down.
         */
        Platform = 'platform'
    }

    /**
     * List of available commands. This is included in each event sent by KD.
     */
    export interface IKdAvailableCommands {
        /**
         * Array of available commands types.
         */
        availableCommands: GdcKdCommandType[];
    }

    /**
     * Save command body sent by outer application
     */
    export interface IKdSaveCommandBody {
        /**
         * Dashboard title - use as title of new dashboard or rename of saved dashboard
         */
        title: string;
    }

    /**
     * Saves current dashboard.
     *
     * Contract:
     *
     * -  if currently edited dashboard IS NOT eligible for save (empty, in-error), then CommandFailed event
     *    will be posted
     * -  if the specified title is invalid / does not match title validation rules, then CommandFailed event
     *    will be posted
     * -  otherwise dashboard WILL be saved with the title as specified in the body and the DashboardSaved event
     *    will be posted
     * -  the DashboardSaved event will be posted even when saving dashboard that has not changed but would
     *    otherwise be eligible for saving (not empty, not in-error)
     *
     * Note: sending Save command with different title means dashboard will be saved with that new title.
     *
     * @remarks use {@link SaveDashboardCommand} factory function to instantiate
     */
    export type SaveDashboardCommand = IKdGdcMessageEvent<GdcKdCommandType.Save, IKdSaveCommandBody>;

    export type SaveDashboardCommandData = IKdGdcMessageEnvelope<GdcKdCommandType.Save, IKdSaveCommandBody>;

    /**
     * Type-guard checking whether object is an instance of {@link SaveDashboardCommandData}.
     *
     * @param obj - object to test
     */
    export function isSaveDashboardCommandData(obj: any): obj is SaveDashboardCommandData {
        return getEventType(obj) === GdcKdCommandType.Save;
    }

    /**
     * Cancels editing and switches dashboard to view mode.
     *
     * Contract:
     *
     * -  if KD is currently editing dashboard, this will trigger switch to view mode, without popping up the
     *    dialog asking to discard unsaved changes. On success SwitchedToView will be posted
     * -  if KD is currently viewing dashboard, SwitchedToView will be posted back immediately
     * -  if KD is not currently showing any dashboard, CommandFailed is posted
     *
     * @remarks use {@link CancelEditCommand} factory function to instantiate
     */
    export type CancelEditCommand = IKdGdcMessageEvent<GdcKdCommandType.CancelEdit, null>;

    export type CancelEditCommandData = IKdGdcMessageEnvelope<GdcKdCommandType.CancelEdit, null>;

    /**
     * Type-guard checking whether object is an instance of {@link CancelEditData}.
     *
     * @param obj - object to test
     */
    export function isCancelEditCommandData(obj: any): obj is CancelEditCommandData {
        return getEventType(obj) === GdcKdCommandType.CancelEdit;
    }

    /**
     * Deleted currently edited dashboard.
     *
     * Contract:
     *
     * -  if KD is currently editing dashboard, this will trigger delete without popping up the dialog
     *    asking for permission. On success DashboardDeleted will be posted
     *
     * -  if KD is currently viewing dashboard or not not showing any dashboard, CommandFailed will
     *    be posted
     *
     * @remarks use {@link DeleteDashboardCommand} factory function to instantiate
     */
    export type DeleteDashboardCommand = IKdGdcMessageEvent<GdcKdCommandType.Delete, null>;

    export type DeleteDashboardCommandData = IKdGdcMessageEnvelope<
        GdcKdCommandType.Delete,
        null
    >;

    /**
     * Switches current dashboard to edit mode.
     *
     * Contract:
     *
     * -  if KD shows dashboard in view mode, will switch to edit mode and post SwitchedToEdit once ready for
     *    editing
     * -  if KD shows dashboard in edit mode, will keep edit mode and post SwitchedToEdit as if just switched
     *    from view mode
     * -  if no dashboard currently displayed, posts CommandFailed
     *
     * @remarks use {@link SwitchToEditCommand} factory function to instantiate
     */
    export type SwitchToEditCommand = IKdGdcMessageEvent<GdcKdCommandType.SwitchToEdit, null>;

    export type SwitchToEditCommandData = IKdGdcMessageEnvelope<
        GdcKdCommandType.SwitchToEdit,
        null
    >;

    /**
     * Type-guard checking whether object is an instance of {@link SwitchToEditCommandData}.
     *
     * @param obj - object to test
     */
    export function isSwitchToEditCommandData(obj: any): obj is SwitchToEditCommandData {
        return getEventType(obj) === GdcKdCommandType.SwitchToEdit;
    }

    /**
     * Set drillable items.
     *
     * Contract:
     *
     * - Drillable items can be set by uris or identifiers of dashboard's measures/attributes
     */
    export type DrillableItemsCommand = IKdGdcMessageEvent<
        GdcKdCommandType.DrillableItems,
        IDrillableItemsCommandBody
    >;

    /**
     * Data type of drillable items command
     *
     * Note: The main event data was wrapped to application and product data structure
     * @see IDrillableItemsCommandBody
     */
    export type DrillableItemsCommandData = IKdGdcMessageEnvelope<
        GdcKdCommandType.DrillableItems,
        IDrillableItemsCommandBody
    >;

    /**
     * Type-guard checking whether object is an instance of {@link DrillableItemsCommandData}.
     *
     * @param obj - object to test
     */
    export function isDrillableItemsCommandData(obj: any): obj is DrillableItemsCommandData {
        return getEventType(obj) === GdcKdCommandType.DrillableItems;
    }

    export interface ISetSizeCommandBody {
        /**
         * the height of the hosting iframe
         */
        heigth: number;
    }

    export type SetSizeCommand = IKdGdcMessageEvent<GdcKdCommandType.SetSize, ISetSizeCommandBody>;

    export type SetSizeCommandData = IKdGdcMessageEnvelope<GdcKdCommandType.SetSize, ISetSizeCommandBody>;

    /**
     * Type-guard checking whether object is an instance of {@link SetSizeCommandData}.
     *
     * @param obj - object to test
     */
    export function isSetSizeCommandData(obj: any): obj is SetSizeCommandData {
        return getEventType(obj) === GdcKdCommandType.SetSize;
    }

    export interface INoPermissionsBody {
        /**
         * the 'data' section contains information about whether view or edit permissions are missing
         */
        reason: string;
    }

    /**
     * This event is emitted When User does not have permissions to view or edit the content
     */
    export type NoPermissionsEventData = IKdGdcMessageEnvelope<
        GdcKdEventType.NoPermissions,
        INoPermissionsBody
    >;

    export interface IResizedBody {
        height: number;
    }

    /**
     * This event is emitted when the content is fully loaded
     */
    export type ResizedEventData = IKdGdcMessageEnvelope<
        GdcKdEventType.Resized,
        IResizedBody
    >;

    export interface IDashboardObjectMeta {
        /**
         * Client id - Each client has an identifier unique within the domain
         *
         * Note: use the combination of the data product ID and client ID instead of the project ID
         */
        client?: string;

        /**
         * object id
         */
        dashboardId: string;
        /**
         * Project id
         */
        project: string;
        /**
         * dashboard identifier
         */
        dashboard: string;

        /**
         * dashboard title - this is what users see in KD top bar (if visible)
         */
        title: string;
    }

    export type IDashboardBody = IKdAvailableCommands & IDashboardObjectMeta;

    /**
     * Data type of event that was emited when a dashboard has been created and saved.
     */
    export type IDashboardCreatedData = IKdGdcMessageEnvelope<
        GdcKdEventType.DashboardCreated,
        IDashboardBody
    >;

    /**
     * Data type of event that was emited when the content is fully loaded,
     * and the user has permissions to access the dashboard.
     */
    export type IDashboardLoadedData = IKdGdcMessageEnvelope<
        GdcKdEventType.DashboardLoaded,
        IDashboardBody
    >;

    /**
     * Data type of event that was emited when the existing dashboard has been updated.
     */
    export type IDashboardUpdatedData = IKdGdcMessageEnvelope<
        GdcKdEventType.DashboardUpdated,
        IDashboardBody
    >;

    /**
     * Data type of event that was emited when the dashboard has been saved.
     */
    export type IDashboardSavedData = IKdGdcMessageEnvelope<
        GdcKdEventType.DashboardSaved,
        IDashboardBody
    >;

    /**
     * Data type of event that was emited when the dashboard has been deleted.
     */
    export type IDashboardDeletedData = IKdGdcMessageEnvelope<
        GdcKdEventType.DashboardDeleted,
        IDashboardBody
    >;

    /**
     * This event is emitted after KD switched a dashboard from view mode to edit mode.
     */
    export type SwitchedToEditData = IKdGdcMessageEnvelope<
        GdcKdEventType.SwitchedToEdit,
        IDashboardBody
    >;

    /**
     * This event is emitted after KD switched a dashboard from edit mode to view mode.
     */
    export type SwitchedToViewData = IKdGdcMessageEnvelope<
        GdcKdEventType.SwitchedToView,
        IDashboardBody
    >;

    export interface IPlaformBody {
        status?: string;
        errorCode?: number;
        description?: string;
    }

    export type PlaformData = IKdGdcMessageEnvelope<GdcKdEventType.Platform, IPlaformBody>;
}
