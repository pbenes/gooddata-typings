// Copyright (C) 2007-2017, GoodData(R) Corporation. All rights reserved.

export namespace AFM {
    export interface IExecution {
        execution: {
            afm: IAfm;
            resultSpec?: IResultSpec;
        };
    }

    export interface IAfm {
        attributes?: IAttribute[];
        measures?: IMeasure[];
        filters?: CompatibilityFilter[];
        nativeTotals?: INativeTotalItem[];
    }

    export interface IResultSpec {
        dimensions?: IDimension[];
        sorts?: SortItem[];
    }

    export interface IAttribute {
        localIdentifier: Identifier;
        displayForm: ObjQualifier;
        alias?: string;
    }

    export interface IMeasure {
        localIdentifier: Identifier;
        definition: MeasureDefinition;
        alias?: string;
        format?: string;
    }
    
    export type MeasureDefinition = ISimpleMeasureDefinition | IPopMeasureDefinition;

    export interface ISimpleMeasureDefinition {
        measure: ISimpleMeasure;
    }

    export interface IPopMeasureDefinition {
        popMeasure: IPopMeasure;
    }

    export interface ISimpleMeasure {
        item: ObjQualifier;
        aggregation?: 'sum' | 'count' | 'avg' | 'min' | 'max' | 'median' | 'runsum';
        filters?: FilterItem[];
        computeRatio?: boolean;
    }

    export interface IPopMeasure {
        measureIdentifier: Identifier;
        popAttribute: ObjQualifier;
    }

    // ObjQualifier type
    export type Identifier = string;
    export type ObjQualifier = IObjUriQualifier | IObjIdentifierQualifier;

    export interface IObjIdentifierQualifier {
        identifier: string;
    }

    export interface IObjUriQualifier {
        uri: string;
    }

    // Filter types and interfaces
    export type CompatibilityFilter = IExpressionFilter | FilterItem;
    export type FilterItem = DateFilterItem | AttributeFilterItem;
    export type AttributeFilterItem = IPositiveAttributeFilter | INegativeAttributeFilter;
    export type DateFilterItem = IAbsoluteDateFilter | IRelativeDateFilter;

    export interface IPositiveAttributeFilter {
        positiveAttributeFilter: {
            displayForm: ObjQualifier;
            in: string[];
        };
    }

    export interface INegativeAttributeFilter {
        negativeAttributeFilter: {
            displayForm: ObjQualifier;
            notIn: string[];
        };
    }

    export interface IAbsoluteDateFilter {
        absoluteDateFilter: {
            dataSet: ObjQualifier;
            from: string;
            to: string;
        };
    }

    export interface IRelativeDateFilter {
        relativeDateFilter: {
            dataSet: ObjQualifier;
            granularity: string;
            from: number;
            to: number;
        };
    }

    // Might be removed, as we don't know if expression filter is needed
    export interface IExpressionFilter {
        value: string;
    }

    export interface ITotalItem {
        measureIdentifier: Identifier;
        type: TotalType;
        attributeIdentifier: Identifier;
    }

    export type TotalType = 'sum' | 'avg' | 'max' | 'min' | 'nat' | 'med';

    export interface INativeTotalItem {
        measureIdentifier: Identifier;
        attributeIdentifiers: Identifier[];
    }

    export interface IDimension {
        itemIdentifiers: Identifier[];
        totals?: ITotalItem[];
    }

    export type SortItem = IAttributeSortItem | IMeasureSortItem;
    export type SortDirection = 'asc' | 'desc';

    export interface IAttributeSortItem {
        attributeSortItem: {
            direction: SortDirection;
            attributeIdentifier: Identifier;
            aggregation?: 'sum';
        };
    }

    export interface IMeasureSortItem {
        measureSortItem: {
            direction: SortDirection;
            locators: LocatorItem[];
        };
    }

    export type LocatorItem = IAttributeLocatorItem | IMeasureLocatorItem;

    export interface IAttributeLocatorItem {
        attributeLocatorItem: {
            attributeIdentifier: Identifier,
            element: string;
        };
    }

    export interface IMeasureLocatorItem {
        measureLocatorItem: {
            measureIdentifier: Identifier;
        };
    }

    export function isObjectUriQualifier(qualifier: AFM.ObjQualifier): qualifier is AFM.IObjUriQualifier {
        return !!(qualifier as AFM.IObjUriQualifier).uri;
    }

    export function isSimpleMeasureDefinition(
        definition: AFM.ISimpleMeasureDefinition | AFM.IPopMeasureDefinition
    ): definition is AFM.ISimpleMeasureDefinition {
        return !!(definition as AFM.ISimpleMeasureDefinition).measure;
    }
    
    export function isPopMeasureDefinition(
        definition: AFM.ISimpleMeasureDefinition | AFM.IPopMeasureDefinition
    ): definition is AFM.IPopMeasureDefinition {
        return !!(definition as AFM.IPopMeasureDefinition).popMeasure;
    }

    export function isAttributeSortItem(sortItem: AFM.SortItem): sortItem is AFM.IAttributeSortItem {
        return !!(sortItem as AFM.IAttributeSortItem).attributeSortItem;
    }

    export function isMeasureSortItem(sortItem: AFM.SortItem): sortItem is AFM.IMeasureSortItem {
        return !!(sortItem as AFM.IMeasureSortItem).measureSortItem;
    }

    export function isMeasureLocatorItem(locator: AFM.LocatorItem): locator is AFM.IMeasureLocatorItem {
        return !!(locator as AFM.IMeasureLocatorItem).measureLocatorItem;
    }

    export function isPositiveAttributeFilter(filter: AFM.CompatibilityFilter): filter is AFM.IPositiveAttributeFilter {
        return !!(filter as AFM.IPositiveAttributeFilter).positiveAttributeFilter;
    }

    export function isNegativeAttributeFilter(filter: AFM.CompatibilityFilter): filter is AFM.INegativeAttributeFilter {
        return !!(filter as AFM.INegativeAttributeFilter).negativeAttributeFilter;
    }
}

export namespace Execution {
    export interface IMeasureHeaderItem {
        measureHeaderItem: {
            uri?: string;
            identifier?: string;
            localIdentifier: string;
            name: string;
            format: string;
        }
    }

    export interface ITotalHeaderItem {
        totalHeaderItem: {
            name: string;
        }
    }

    export interface IMeasureGroupHeader {
        measureGroupHeader: {
            items: IMeasureHeaderItem[];
            totalItems?: ITotalHeaderItem[];
        }
    }

    export interface IAttributeHeader {
        attributeHeader: {
            uri: string;
            identifier: string;
            localIdentifier: string;
            name: string;
            totalItems?: ITotalHeaderItem[];
            formOf: {
                uri: string;
                identifier: string;
                name: string;
            };
        }
    }

    export type IHeader = IMeasureGroupHeader | IAttributeHeader;

    export interface IResultAttributeHeaderItem {
        attributeHeaderItem: {
            uri: string;
            name: string;
        }
    }

    export interface IResultMeasureHeaderItem {
        measureHeaderItem: {
            name: string,
            order: number
        }
    }

    export interface IResultTotalHeaderItem {
        totalHeaderItem: {
            name: string,
            type: string
        }
    }

    export type IResultHeaderItem = IResultAttributeHeaderItem | IResultMeasureHeaderItem | IResultTotalHeaderItem;

    export interface IResultDimension {
        headers: IHeader[];
    }

    export interface IExecutionResponse {
        executionResponse: {
            links: {
                executionResult: string;
            };
            dimensions: IResultDimension[];
        }
    }

    export type DataValue = null | string | number;

    export interface Warning {
        warningCode: string;
        message: string;
        parameters?: any[];
    }

    export interface IExecutionResult {
        executionResult: {
            headerItems?: IResultHeaderItem[][][];
            data: DataValue[][] | DataValue[];
            totals?: DataValue[][][];
            paging: {
                count: number[];
                offset: number[];
                total: number[];
            };
            warnings?: Warning[];
        }
    }

    export interface IError extends Error {
        response: Response;
    }

    /**
     * Combination of both AFM executions responses
     *
     * `null` value as executionResult means empty response (HTTP 204)
     */
    export interface IExecutionResponses {
        executionResponse: IExecutionResponse;
        executionResult: IExecutionResult | null;
    }
}
