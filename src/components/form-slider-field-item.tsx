import { Slider } from '@/components/ui/slider';
import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
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
      <div className='flex gap-x-3'>
        <Input className='w-3/12' type='number' {...controllerRenderProps} />
        <Slider
          {...sliderConfig}
          {...controllerRenderProps}
          value={[controllerRenderProps.value]}
          onValueChange={controllerRenderProps.onChange}
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
