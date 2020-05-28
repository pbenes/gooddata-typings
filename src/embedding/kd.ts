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
    export type IGdcKdMessageEvent<T, TBody> = IGdcMessageEvent<GdcProductName.KPI_DASHBOARD, T, TBody>;

    /**
     * Base type for KD event data.
     */
    export type IGdcKdMessageEnvelope<T, TBody> = IGdcMessageEnvelope<GdcProductName.KPI_DASHBOARD, T, TBody>;

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
         * The command add widget to dashboard.
         */
        AddWidget = 'addWidget',

        /**
         * The command add filter to dashboard.
         */
        AddFilter = 'addFilter',

        /**
         * The command export a dashboard.
         */
        ExportToPdf = 'exportToPdf'
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
        Platform = 'platform',

        /**
         * Type represent that the widget is added to dashboard.
         *
         */
        WidgetAdded = 'widgetAdded',

        /**
         * Type represent that the filter is added to dashboard.
         *
         */
        FilterAdded = 'filterAdded',

        /**
         * Type represent that the export action is finished.
         */
        ExportedToPdf = 'exportedToPdf',

        /**
         * Type represent that the drill performed
         */
        Drill = 'drill'
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
     */
    export type SaveDashboardCommand = IGdcKdMessageEvent<GdcKdCommandType.Save, IKdSaveCommandBody>;

    export type SaveDashboardCommandData = IGdcKdMessageEnvelope<GdcKdCommandType.Save, IKdSaveCommandBody>;

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
     */
    export type CancelEditCommand = IGdcKdMessageEvent<GdcKdCommandType.CancelEdit, null>;

    export type CancelEditCommandData = IGdcKdMessageEnvelope<GdcKdCommandType.CancelEdit, null>;

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
     */
    export type DeleteDashboardCommand = IGdcKdMessageEvent<GdcKdCommandType.Delete, null>;

    export type DeleteDashboardCommandData = IGdcKdMessageEnvelope<
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
     */
    export type SwitchToEditCommand = IGdcKdMessageEvent<GdcKdCommandType.SwitchToEdit, null>;

    export type SwitchToEditCommandData = IGdcKdMessageEnvelope<
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
    export type DrillableItemsCommand = IGdcKdMessageEvent<
        GdcKdCommandType.DrillableItems,
        IDrillableItemsCommandBody
    >;

    /**
     * Data type of drillable items command
     *
     * Note: The main event data was wrapped to application and product data structure
     * @see IDrillableItemsCommandBody
     */
    export type DrillableItemsCommandData = IGdcKdMessageEnvelope<
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

    export type SetSizeCommand = IGdcKdMessageEvent<GdcKdCommandType.SetSize, ISetSizeCommandBody>;

    export type SetSizeCommandData = IGdcKdMessageEnvelope<GdcKdCommandType.SetSize, ISetSizeCommandBody>;

    /**
     * Type-guard checking whether object is an instance of {@link SetSizeCommandData}.
     *
     * @param obj - object to test
     */
    export function isSetSizeCommandData(obj: any): obj is SetSizeCommandData {
        return getEventType(obj) === GdcKdCommandType.SetSize;
    }

    //
    // Add widget command
    //

    export interface IKpiWidget {
        type: 'kpi';
    }

    export interface IIdentifierInsightRef {
        identifier: string;
    }

    export interface IUriInsightRef {
        uri: string;
    }

    export interface IInsightWidget {
        type: 'insight';
        ref: IIdentifierInsightRef | IUriInsightRef;
    }

    export interface IAddWidgetBody {
        widget: IKpiWidget | IInsightWidget;
    }

    /**
     * Type-guard checking whether object is an instance of {@link IdentifierInsightRef}.
     *
     * @param obj - object to test
     */
    export function isIdentifierInsight(obj: any): obj is IIdentifierInsightRef {
        return obj.identifier;
    }

    /**
     * Type-guard checking whether object is an instance of {@link UriInsightRef}.
     *
     * @param obj - object to test
     */
    export function isUriInsight(obj: any): obj is IUriInsightRef {
        return obj.uri;
    }

    /**
     * Adds new widget onto dashboard. New row will be created on top of the dashboard, the widget
     * will be placed into its first column.
     *
     * It is currently possible to add either a KPI or an Insight. When adding either of these, KD will
     * scroll to top so that the newly added widget is visible.
     *
     * For KPI, the KD will start the KPI customization flow right after the KPI is placed.
     * Insights are placed without need for further customization
     *
     * Contract:
     *
     * -  if KD is currently editing a dashboard, then depending on widget type:
     *    -  KPI is added to dashboard, customization flow is started, WidgetAdded will be posted
     *    -  Insight is added to dashboard, WidgetAdded will be posted
     *
     * -  if insight reference included in command payload does not refer to a valid insight, CommandFailed
     *    will be posted
     *
     * -  if KD is in view mode or not showing any dashboard, then CommandFailed will be posted
     */
    export type AddWidgetCommand = IGdcKdMessageEvent<GdcKdCommandType.AddWidget, IAddWidgetBody>;

    export type AddWidgetCommandData = IGdcKdMessageEnvelope<GdcKdCommandType.AddWidget, IAddWidgetBody>;

    /**
     * Type-guard checking whether object is an instance of {@link AddWidgetCommandData}.
     *
     * @param obj - object to test
     */
    export function isAddWidgetCommandData(obj: any): obj is AddWidgetCommandData {
        return getEventType(obj) === GdcKdCommandType.AddWidget;
    }

    /**
     * Adds new attribute filter to filter bar and starts the filter customization flow.
     *
     * Contract:
     *
     * -  if KD is currently editing a dashboard, adds new attribute filter, starts customization flow; FilterAdded
     *    will be posted right after customization starts
     *
     * -  if KD is currently in view mode or does not show any dashboard, will post CommandFailed
     */
    export type AddFilterCommand = IGdcKdMessageEvent<GdcKdCommandType.AddFilter, null>;

    export type AddFilterCommandData = IGdcKdMessageEnvelope<GdcKdCommandType.AddFilter, null>;

    /**
     * Type-guard checking whether object is an instance of {@link AddFilterCommandData}.
     *
     * @param obj - object to test
     */
    export function isAddFilterCommandData(obj: any): obj is AddFilterCommandData {
        return getEventType(obj) === GdcKdCommandType.AddFilter;
    }

    /**
     * Exports dashboard to PDF.
     *
     * Contract:
     *
     * -  if KD shows dashboard in view mode, will export dashboard to PDF and post ExportFinished once ready for
     *    exporting
     * -  if KD shwows dashboard in edit mode or not not showing any dashboard, CommandFailed will
     *    be posted
     */
    export type ExportToPdfCommand = IGdcKdMessageEvent<GdcKdCommandType.ExportToPdf, null>;

    export type ExportToPdfCommandData = IGdcKdMessageEnvelope<GdcKdCommandType.ExportToPdf, null>;

    /**
     * Type-guard checking whether object is an instance of {@link ExportToPdfCommandData}.
     *
     * @param obj - object to test
     */
    export function isExportToPdfCommandData(obj: any): obj is ExportToPdfCommandData {
        return getEventType(obj) === GdcKdCommandType.ExportToPdf;
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
    export type NoPermissionsEventData = IGdcKdMessageEnvelope<
        GdcKdEventType.NoPermissions,
        INoPermissionsBody
    >;

    export interface IResizedBody {
        height: number;
    }

    /**
     * This event is emitted when the content is fully loaded
     */
    export type ResizedEventData = IGdcKdMessageEnvelope<
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
    export type IDashboardCreatedData = IGdcKdMessageEnvelope<
        GdcKdEventType.DashboardCreated,
        IDashboardBody
    >;

    /**
     * Data type of event that was emited when the content is fully loaded,
     * and the user has permissions to access the dashboard.
     */
    export type IDashboardLoadedData = IGdcKdMessageEnvelope<
        GdcKdEventType.DashboardLoaded,
        IDashboardBody
    >;

    /**
     * Data type of event that was emited when the existing dashboard has been updated.
     */
    export type IDashboardUpdatedData = IGdcKdMessageEnvelope<
        GdcKdEventType.DashboardUpdated,
        IDashboardBody
    >;

    /**
     * Data type of event that was emited when the dashboard has been saved.
     */
    export type IDashboardSavedData = IGdcKdMessageEnvelope<
        GdcKdEventType.DashboardSaved,
        IDashboardBody
    >;

    /**
     * Data type of event that was emited when the dashboard has been deleted.
     */
    export type IDashboardDeletedData = IGdcKdMessageEnvelope<
        GdcKdEventType.DashboardDeleted,
        IDashboardBody
    >;

    /**
     * This event is emitted after KD switched a dashboard from view mode to edit mode.
     */
    export type SwitchedToEditData = IGdcKdMessageEnvelope<
        GdcKdEventType.SwitchedToEdit,
        IDashboardBody
    >;

    /**
     * This event is emitted after KD switched a dashboard from edit mode to view mode.
     */
    export type SwitchedToViewData = IGdcKdMessageEnvelope<
        GdcKdEventType.SwitchedToView,
        IDashboardBody
    >;

    export interface IPlaformBody {
        status?: string;
        errorCode?: number;
        description?: string;
    }

    export type PlaformData = IGdcKdMessageEnvelope<GdcKdEventType.Platform, IPlaformBody>;

    export interface IInsightWidgetBody {
        widgetCategory: 'kpi' | 'visualization';
        identifier?: string;
        uri?: string;
        title?: string;
    }
    export interface IAddedWidgetBody {
        insight?: IInsightWidgetBody;
    }

    /**
     * This event is emitted after KD added a new widget to a dashboard. If the widget is
     * an insight, then meta information about the insight will be returned.
     *
     * Note: when this event is added for a KPI widget, it means the customization flow for the KPI has
     * started. The user may still 'just' click somewhere outside of the KPI configuration and the KPI will
     * be discarded.
     */
    export type WidgetAddedData = IGdcKdMessageEnvelope<GdcKdEventType.WidgetAdded, IAddedWidgetBody>;

    export type FilterAddedBody = IKdAvailableCommands;

    /**
     * This event is emitted after KD added a new filter to dashboard's filter bar and started its
     * customization flow.
     *
     * Note: users can still cancel the filter customization flow meaning no new attribute filter
     * will end on the filter bar.
     */
    export type FilterAddedData = IGdcKdMessageEnvelope<GdcKdEventType.FilterAdded, FilterAddedBody>;

    export type ExportToPdfFinishedBody = IKdAvailableCommands & {
        /**
         * Link to the file containing exported data.
         */
        link: string;
    };

    /**
     * This event is emitted after dashboard has been exported to PDF
     */
    export type ExportToPdfFinishedData = IGdcKdMessageEnvelope<GdcKdEventType.ExportedToPdf, ExportToPdfFinishedBody>;
}
