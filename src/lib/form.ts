import { z } from 'zod';
import { SliderConfig } from '@/types/form';

export const sliderBoundaryErrorMessage = (
  { min, max }: SliderConfig,
  fieldName: string = 'Value',
) => `${fieldName} must be a number between ${min} and ${max}`;

export const zodSliderValidator = (
  sliderConfig: SliderConfig,
  fieldName?: string,
) => {
  const errorMessage = sliderBoundaryErrorMessage(sliderConfig, fieldName);
  return z
    .number()
    .min(sliderConfig.min, errorMessage)
    .max(sliderConfig.max, errorMessage);
};
