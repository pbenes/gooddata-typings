// (C) 2020 GoodData Corporation

import { IObjectMeta } from './Meta';
import { ExtendedDateFilters } from './ExtendedDateFilters';
import { VisualizationObject } from './VisualizationObject';
export interface IVisualizationWidget {
    meta: IObjectMeta;
    content: {
        visualization: string;
        dateDataSe?: string;
        ignoreDashboardFilters: Array<
            | ExtendedDateFilters.IDateFilterReference
            | ExtendedDateFilters.IAttributeFilterReference
        >;
        drills?: IDrillDefinition;
        properties?: string;
        references?: VisualizationObject.IReferenceItems;
    };
}

export type IDrillDefinition = IDrillToVisualization;

export interface IDrillToVisualization {
    target: 'pop-up';
    from: VisualizationObject.ILocalIdentifierQualifier;
    toVisualization: VisualizationObject.IObjUriQualifier;
}
