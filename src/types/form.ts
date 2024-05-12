export enum SliderValueType {
  Time,
  Percent,
  Multiplier,
}

export type SliderValueTypeDesc = {
  name: string;
  namePlural?: string;
  unit: string;
};

export const SLIDER_VALUE_DESC: Record<SliderValueType, SliderValueTypeDesc> = {
  [SliderValueType.Time]: {
    name: 'millisecond',
    namePlural: 'milliseconds',
    unit: 'ms',
  },
  [SliderValueType.Percent]: {
    name: 'percent',
    unit: '%',
  },
  [SliderValueType.Multiplier]: {
    name: 'multiplier',
    unit: 'x',
  },
};

export type SliderConfig = {
  type: SliderValueType;
  min: number;
  max: number;
  step: number;
};
