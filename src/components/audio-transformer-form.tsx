'use client';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  AUDIO_TRANSFORMER_FIELD_CONFIG,
  AUDIO_TRANSFORMER_FORM_SCHEMA,
} from '@/schemas/audio-transformer-form-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { forwardRef, ReactNode } from 'react';
import { FormSliderFieldItem } from '@/components/form-slider-field-item';
import { SliderConfig } from '@/types/form';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const DEFAULT_VALUES = {
  applySlowdown: true,
  slowdown: 85,
  applyReverb: true,
  reverbDelay: 250,
  reverbDecayFactor: 20,
  reverbWetDryMix: 90,
};

type InferredFormSchema = z.infer<typeof AUDIO_TRANSFORMER_FORM_SCHEMA>;

type SliderFieldsDefinition = {
  name: keyof InferredFormSchema;
  sliderConfig: SliderConfig;
  label: ReactNode;
  labelAppendix?: ReactNode;
  description?: ReactNode;
};

export const AudioTransformerForm = forwardRef<HTMLFormElement>(({}, ref) => {
  const form = useForm<InferredFormSchema>({
    resolver: zodResolver(AUDIO_TRANSFORMER_FORM_SCHEMA),
    defaultValues: DEFAULT_VALUES,
  });

  const onSubmit = (values: InferredFormSchema) => {
    console.log(values);
  };

  return (
    <Form {...form}>
      <form
        ref={ref}
        className='flex flex-col gap-y-6'
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          name='file'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Audio File</FormLabel>
              <FormControl>
                <Input type='file' {...field} />
              </FormControl>
              <FormDescription />
              <FormMessage />
            </FormItem>
          )}
        />
        <Separator />
        {SLIDER_FIELDS.map(({ name, ...sliderFieldItemProps }) => (
          <FormField
            key={name}
            control={form.control}
            name={name}
            render={({ field }) => (
              <FormSliderFieldItem<InferredFormSchema>
                controllerRenderProps={field}
                {...sliderFieldItemProps}
              />
            )}
          />
        ))}
        <div className='flex gap-x-2'>
          <Button type='submit' className='w-full'>
            Submit
          </Button>
          <Button type='button' className='w-3/12' variant='outline'>
            Reset
          </Button>
        </div>
      </form>
    </Form>
  );
});

AudioTransformerForm.displayName = 'AudioTransformerForm';

const SLIDER_FIELDS: SliderFieldsDefinition[] = [
  {
    name: 'slowdown',
    sliderConfig: AUDIO_TRANSFORMER_FIELD_CONFIG.slowdown,
    label: 'Slowdown',
    labelAppendix: '(in %)',
    description: (
      <>
        This value determines the rate of slowing down a song.{' '}
        <b>The lower the value, the slower the song.</b>
      </>
    ),
  },
  {
    name: 'reverbDelay',
    sliderConfig: AUDIO_TRANSFORMER_FIELD_CONFIG.reverb.delay,
    label: 'Reverb — Delay',
    labelAppendix: '(in milliseconds)',
    description: (
      <>
        This value controls the echo and delay effects of a song.{' '}
        <b>Higher values create a more pronounced and lingering echo.</b>
      </>
    ),
  },
  {
    name: 'reverbDecayFactor',
    sliderConfig: AUDIO_TRANSFORMER_FIELD_CONFIG.reverb.decayFactor,
    label: 'Reverb — Decay Factor',
    labelAppendix: '(in %)',
    description: (
      <>
        This value field defines how long the reverb lasts.{' '}
        <b>
          Higher values extend the decay time, creating a longer-lasting reverb
          effect.
        </b>
      </>
    ),
  },
  {
    name: 'reverbWetDryMix',
    sliderConfig: AUDIO_TRANSFORMER_FIELD_CONFIG.reverb.wetDryMix,
    label: 'Reverb — Wet-Dry Mix',
    labelAppendix: '(in %)',
    description: (
      <>
        The value adjusts the balance between the reverb effect and the original
        sound.{' '}
        <b>
          Higher values increase the reverb effect, while lower values emphasize
          the original sound.
        </b>
      </>
    ),
  },
];
