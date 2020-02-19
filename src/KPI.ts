// (C) 2020 GoodData Corporation

import { IObjectMeta } from './Meta';
import { ExtendedDateFilters } from './ExtendedDateFilters';

export interface IKPI {
    meta: IObjectMeta;
    content: IKpiContentWithoutComparison | IKpiContentWithComparison;
}

export interface IKpiContentBase {
    metric: string;
    ignoreDashboardFilters: Array<
        | ExtendedDateFilters.IDateFilterReference
        | ExtendedDateFilters.IAttributeFilterReference
    >;
    drillTo?: IKpiProjectDashboardLink;
    dateDimension?: string;
    dateDataSet?: string;
}

export interface IKpiContentWithComparison extends IKpiContentBase {
    comparisonType: IKpiComparisonTypeComparison;
    comparisonDirection: IKpiComparisonDirection;
}

export interface IKpiContentWithoutComparison extends IKpiContentBase {
    comparisonType: IKpiComparisonTypeNoComparison;
}

export interface IKpiProjectDashboardLink {
    projectDashboard: string;
    projectDashboardTab: string;
}

export type IKpiComparisonTypeNoComparison = 'none';
export type IKpiComparisonTypeComparison = 'previousPeriod' | 'lastYear';
export type IKpiComparisonDirection = 'growIsGood' | 'growIsBad';
