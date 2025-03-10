import { MetricResult } from "../../api/types";
import { Series } from "uplot";
import { getNameForMetric, promValueToNumber } from "../metric";
import { BarSeriesItem, Disp, Fill, LegendItemType, Stroke } from "./types";
import { HideSeriesArgs } from "./types";
import { baseContrastColors, getColorFromString } from "../color";
import { getAvgFromArray, getMaxFromArray, getMinFromArray, getLastFromArray } from "../math";
import { formatPrettyNumber } from "./helpers";

export interface SeriesItem extends Series {
  freeFormFields: {[key: string]: string};
  calculations: {
    min: string,
    max: string,
    avg: string,
    last: string
  }
}

export const getSeriesItemContext = () => {
  const colorState: {[key: string]: string} = {};

  return (d: MetricResult, hideSeries: string[], alias: string[]): SeriesItem => {
    const label = getNameForMetric(d, alias[d.group - 1]);
    const countSavedColors = Object.keys(colorState).length;
    const hasBasicColors = countSavedColors < baseContrastColors.length;
    if (hasBasicColors) colorState[label] = colorState[label] || baseContrastColors[countSavedColors];

    const values = d.values.map(v => promValueToNumber(v[1]));
    const min = getMinFromArray(values);
    const max = getMaxFromArray(values);
    const avg = getAvgFromArray(values);
    const last = getLastFromArray(values);

    return {
      label,
      freeFormFields: d.metric,
      width: 1.4,
      stroke: colorState[label] || getColorFromString(label),
      show: !includesHideSeries(label, hideSeries),
      scale: "1",
      points: {
        size: 4.2,
        width: 1.4
      },
      calculations: {
        min: formatPrettyNumber(min, min, max),
        max: formatPrettyNumber(max, min, max),
        avg: formatPrettyNumber(avg, min, max),
        last: formatPrettyNumber(last, min, max),
      }
    };
  };
};

export const getLegendItem = (s: SeriesItem, group: number): LegendItemType => ({
  group,
  label: s.label || "",
  color: s.stroke as string,
  checked: s.show || false,
  freeFormFields: s.freeFormFields,
  calculations: s.calculations,
});

export const getHideSeries = ({ hideSeries, legend, metaKey, series }: HideSeriesArgs): string[] => {
  const { label } = legend;
  const include = includesHideSeries(label, hideSeries);
  const labels = series.map(s => s.label || "");
  if (metaKey) {
    return include ? hideSeries.filter(l => l !== label) : [...hideSeries, label];
  } else if (hideSeries.length) {
    return include ? [...labels.filter(l => l !== label)] : [];
  } else {
    return [...labels.filter(l => l !== label)];
  }
};

export const includesHideSeries = (label: string, hideSeries: string[]): boolean => {
  return hideSeries.includes(`${label}`);
};

export const getBarSeries = (
  which: number[],
  ori: number,
  dir: number,
  radius: number,
  disp: Disp): BarSeriesItem => {
  return {
    which: which,
    ori: ori,
    dir: dir,
    radius: radius,
    disp: disp,
  };
};

export const barDisp = (stroke: Stroke, fill: Fill): Disp => {
  return {
    stroke: stroke,
    fill: fill
  };
};
