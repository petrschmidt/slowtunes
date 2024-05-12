import { Slider } from '@/components/ui/shadcn/slider';
import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/shadcn/form';
import { Input } from '@/components/ui/shadcn/input';
import { ReactNode } from 'react';
import { SliderConfig } from '@/types/form';
import { ControllerRenderProps, FieldValues } from 'react-hook-form';

export type FormSliderFieldItemProps<T extends FieldValues> = {
  sliderConfig: SliderConfig;
  label: ReactNode;
  labelAppendix?: ReactNode;
  description?: ReactNode;
  controllerRenderProps: ControllerRenderProps<T>;
};

export const FormSliderFieldItem = <T extends FieldValues>({
  sliderConfig,
  label,
  labelAppendix,
  description,
  controllerRenderProps,
}: FormSliderFieldItemProps<T>) => (
  <FormItem>
    <FormLabel>
      {label}{' '}
      {labelAppendix && (
        <span className='text-muted-foreground'>{labelAppendix}</span>
      )}
    </FormLabel>
    <FormControl>
      <div className='flex flex-col gap-y-3 sm:flex-row sm:gap-x-3 sm:gap-y-0'>
        <Input
          className='sm:w-3/12'
          type='number'
          {...controllerRenderProps}
          onChange={(e) => {
            controllerRenderProps.onChange(parseInt(e.target.value));
          }}
        />
        <Slider
          className='py-4 sm:py-0'
          {...sliderConfig}
          {...controllerRenderProps}
          value={[controllerRenderProps.value]}
          onValueChange={(values) => controllerRenderProps.onChange(values[0])}
        />
      </div>
    </FormControl>
    {description && (
      <FormDescription className='[&_b]:font-semibold'>
        {description}
      </FormDescription>
    )}
    <FormMessage />
  </FormItem>
);
