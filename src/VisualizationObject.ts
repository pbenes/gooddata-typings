// (C) 2007-2020 GoodData Corporation
import { IObjectMeta } from './Meta';
import isEmpty = require('lodash/isEmpty');

export namespace VisualizationObject {
    export type SortDirection = 'asc' | 'desc';
    export type Identifier = string;
    export type MeasureAggregation = 'sum' | 'count' | 'avg' | 'min' | 'max' | 'median' | 'runsum';
    export type TotalType = 'sum' | 'avg' | 'max' | 'min' | 'nat' | 'med';
    export type VisualizationType = 'table' | 'line' | 'column' | 'bar' | 'pie' | 'doughnut' | 'combo' | 'area';
    export type ArithmeticMeasureOperator = 'sum' | 'difference' | 'multiplication' | 'ratio' | 'change';

    export type BucketItem = IMeasure | IVisualizationAttribute;

    export type VisualizationObjectExtendedFilter = VisualizationObjectFilter | IMeasureValueFilter;
    export type VisualizationObjectFilter = VisualizationObjectDateFilter | VisualizationObjectAttributeFilter;

    export type VisualizationObjectDateFilter =
        IVisualizationObjectRelativeDateFilter | IVisualizationObjectAbsoluteDateFilter;

    export type VisualizationObjectAttributeFilter =
        IVisualizationObjectPositiveAttributeFilter | IVisualizationObjectNegativeAttributeFilter;

    export interface IObjUriQualifier {
        uri: string;
    }

    export interface IObjIdentifierQualifier {
        identifier: string;
    }

    export type ObjQualifier = IObjUriQualifier | IObjIdentifierQualifier;

    export interface IVisualizationObjectPositiveAttributeFilter {
        positiveAttributeFilter: {
            displayForm: ObjQualifier;
            in: string[];
        };
    }

    export interface IVisualizationObjectNegativeAttributeFilter {
        negativeAttributeFilter: {
            displayForm: ObjQualifier;
            notIn: string[];
        };
    }

    export interface IVisualizationObjectAbsoluteDateFilter {
        absoluteDateFilter: {
            dataSet: ObjQualifier;
            from?: string;
            to?: string;
        };
    }

    export interface IVisualizationObjectRelativeDateFilter {
        relativeDateFilter: {
            dataSet: ObjQualifier
            granularity: string;
            from?: number;
            to?: number;
        };
    }

    export type ComparisonConditionOperator = 'GREATER_THAN'
        | 'GREATER_THAN_OR_EQUAL_TO'
        | 'LESS_THAN'
        | 'LESS_THAN_OR_EQUAL_TO'
        | 'EQUAL_TO'
        | 'NOT_EQUAL_TO';

    export interface IComparisonCondition {
        comparison: {
            operator: ComparisonConditionOperator
            value: number;
            treatNullValuesAs?: number;
        };
    }

    export type RangeConditionOperator = 'BETWEEN' | 'NOT_BETWEEN';

    export interface IRangeCondition {
        range: {
            operator: RangeConditionOperator;
            from: number;
            to: number;
            treatNullValuesAs?: number;
        };
    }

    export type MeasureValueFilterCondition = IComparisonCondition | IRangeCondition;

    export interface ILocalIdentifierQualifier {
        localIdentifier: string;
    }

    export interface IMeasureValueFilter {
        measureValueFilter: {
            measure: IObjUriQualifier | ILocalIdentifierQualifier;
            condition?: MeasureValueFilterCondition;
        };
    }

    export interface IVisualizationObjectContent {
        visualizationClass: IObjUriQualifier;
        buckets: IBucket[];
        filters?: VisualizationObjectExtendedFilter[];
        properties?: string;
        references?: IReferenceItems;
    }

    export interface IReferenceItems {
        [identifier: string]: string;
    }

    export interface IBucket {
        localIdentifier?: Identifier;
        items: BucketItem[];
        totals?: IVisualizationTotal[];
    }

    export interface IVisualizationTotal {
        type: TotalType;
        measureIdentifier: string;
        attributeIdentifier: string;
        alias?: string;
    }

    export type IMeasureDefinitionType = IMeasureDefinition
        | IArithmeticMeasureDefinition
        | IPoPMeasureDefinition
        | IPreviousPeriodMeasureDefinition;

    export interface IMeasure {
        measure: {
            localIdentifier: Identifier;
            definition: IMeasureDefinitionType;
            alias?: string;
            title?: string;
            format?: string;
        };
    }

    export interface IVisualizationAttribute {
        visualizationAttribute: {
            localIdentifier: Identifier;
            displayForm: ObjQualifier;
            alias?: string
        };
    }

    export interface IMeasureDefinition {
        measureDefinition: {
            item: ObjQualifier;
            aggregation?: MeasureAggregation;
            filters?: VisualizationObjectFilter[];
            computeRatio?: boolean;
        };
    }

    export interface IArithmeticMeasureDefinition {
        arithmeticMeasure: {
            measureIdentifiers: Identifier[];
            operator: ArithmeticMeasureOperator;
        };
    }

    export interface IPoPMeasureDefinition {
        popMeasureDefinition: {
            measureIdentifier: Identifier;
            popAttribute: ObjQualifier;
        };
    }

    export interface IPreviousPeriodMeasureDefinition {
        previousPeriodMeasure: {
            measureIdentifier: Identifier;
            dateDataSets: IPreviousPeriodDateDataSet[];
        };
    }

    export interface IPreviousPeriodDateDataSet {
        dataSet: ObjQualifier;
        periodsAgo: number;
    }

    export interface IVisualizationObject {
        meta: IObjectMeta;
        content: IVisualizationObjectContent;
    }

    export interface IVisualization {
        visualizationObject: IVisualizationObject;
    }

    export interface IVisualizationObjectResponse {
        visualizationObject: IVisualizationObject;
    }

    export function isMeasure(bucketItem: IMeasure | IVisualizationAttribute): bucketItem is IMeasure {
        return !isEmpty(bucketItem) && (bucketItem as IMeasure).measure !== undefined;
    }

    export function isVisualizationAttribute(
        bucketItem: IMeasure | IVisualizationAttribute
    ): bucketItem is IVisualizationAttribute {
        return !isEmpty(bucketItem) && (bucketItem as IVisualizationAttribute).visualizationAttribute !== undefined;
    }

    export function isMeasureDefinition(
        definition: IMeasureDefinitionType
    ): definition is IMeasureDefinition {
        return !isEmpty(definition) && (definition as IMeasureDefinition).measureDefinition !== undefined;
    }

    export function isArithmeticMeasureDefinition(
        definition: IMeasureDefinitionType
    ): definition is IArithmeticMeasureDefinition {
        return !isEmpty(definition) && (definition as IArithmeticMeasureDefinition).arithmeticMeasure !== undefined;
    }

    export function isPopMeasureDefinition(
        definition: IMeasureDefinitionType
    ): definition is IPoPMeasureDefinition {
        return !isEmpty(definition) && (definition as IPoPMeasureDefinition).popMeasureDefinition !== undefined;
    }

    export function isPreviousPeriodMeasureDefinition(
        definition: IMeasureDefinitionType
    ): definition is IPreviousPeriodMeasureDefinition {
        return !isEmpty(definition)
            && (definition as IPreviousPeriodMeasureDefinition).previousPeriodMeasure !== undefined;
    }

    export function isAttributeFilter(filter: VisualizationObjectFilter): filter is VisualizationObjectAttributeFilter {
        return !isEmpty(filter) && (
            (filter as IVisualizationObjectPositiveAttributeFilter).positiveAttributeFilter !== undefined
            || (filter as IVisualizationObjectNegativeAttributeFilter).negativeAttributeFilter !== undefined
        );
    }

    export function isDateFilter(filter: VisualizationObjectFilter): filter is VisualizationObjectDateFilter {
        return !isEmpty(filter) && (
            (filter as IVisualizationObjectAbsoluteDateFilter).absoluteDateFilter !== undefined
            || (filter as IVisualizationObjectRelativeDateFilter).relativeDateFilter !== undefined
        );
    }

    export function isPositiveAttributeFilter(
        filter: VisualizationObjectAttributeFilter
    ): filter is IVisualizationObjectPositiveAttributeFilter {
        return !isEmpty(filter)
            && (filter as IVisualizationObjectPositiveAttributeFilter).positiveAttributeFilter !== undefined;
    }

    export function isMeasureValueFilter(
        filter: VisualizationObjectExtendedFilter
    ): filter is IMeasureValueFilter {
        return !isEmpty(filter)
            && (filter as IMeasureValueFilter).measureValueFilter !== undefined;
    }

    export function isAbsoluteDateFilter(
        filter: VisualizationObjectDateFilter
    ): filter is IVisualizationObjectAbsoluteDateFilter {
        return !isEmpty(filter) && (filter as IVisualizationObjectAbsoluteDateFilter).absoluteDateFilter !== undefined;
    }

    export function isRelativeDateFilter(
        filter: VisualizationObjectDateFilter
    ): filter is IVisualizationObjectRelativeDateFilter {
        return !isEmpty(filter) && (filter as IVisualizationObjectRelativeDateFilter).relativeDateFilter !== undefined;
    }

    export function isAttribute(bucketItem: BucketItem): bucketItem is IVisualizationAttribute {
        return !isEmpty(bucketItem) && (bucketItem as IVisualizationAttribute).visualizationAttribute !== undefined;
    }

    export function isLocalIdentifierQualifier(
        objectQualifier: IObjUriQualifier | ILocalIdentifierQualifier
    ): objectQualifier is ILocalIdentifierQualifier {
        return (
            !isEmpty(objectQualifier) &&
            (objectQualifier as ILocalIdentifierQualifier).localIdentifier !== undefined
        );
    }

    export function isComparisonCondition(
        condition: MeasureValueFilterCondition
    ): condition is IComparisonCondition {
        return !isEmpty(condition) && (condition as IComparisonCondition).comparison !== undefined;
    }

    export function isRangeCondition(condition: MeasureValueFilterCondition): condition is IRangeCondition {
        return !isEmpty(condition) && (condition as IRangeCondition).range !== undefined;
    }
}
