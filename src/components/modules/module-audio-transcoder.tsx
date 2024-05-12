'use client';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/shadcn/form';
import { Input } from '@/components/ui/shadcn/input';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  AUDIO_TRANSCODER_FIELD_CONFIG,
  AUDIO_TRANSFORMER_FORM_SCHEMA,
} from '@/schemas/audio-transcoder-form-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { forwardRef, ReactNode, useContext } from 'react';
import { FormSliderFieldItem } from '@/components/form/form-slider-field-item';
import { SliderConfig } from '@/types/form';
import { Button } from '@/components/ui/shadcn/button';
import { Separator } from '@/components/ui/shadcn/separator';
import { FFmpegContext } from '@/contexts/ffmpeg-context';

const DEFAULT_VALUES = {
  file: undefined,
  speed: 85,
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

export const ModuleAudioTranscoder = forwardRef<HTMLFormElement>(({}, ref) => {
  const ffmpegContext = useContext(FFmpegContext);
  const form = useForm<InferredFormSchema>({
    resolver: zodResolver(AUDIO_TRANSFORMER_FORM_SCHEMA),
    defaultValues: DEFAULT_VALUES,
    disabled: !ffmpegContext.loaded,
    mode: 'onTouched',
    reValidateMode: 'onBlur',
  });

  const onSubmit = (values: InferredFormSchema) => {
    ffmpegContext.transcode({
      tempo: values.speed,
      reverb: {
        delay: values.reverbDelay,
        decay: values.reverbDecayFactor,
        wet: values.reverbWetDryMix,
      },
    });
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
          render={({ field: { value: _, onChange, ...fieldProps } }) => (
            <FormItem className=''>
              <FormLabel>Audio File</FormLabel>
              <FormControl>
                <Input
                  type='file'
                  className='transition hover:border-primary disabled:hover:border-[inherit]'
                  accept='audio/*'
                  {...fieldProps}
                  {...ffmpegContext.registerFileInput()}
                  onChange={(e) => onChange(e.target.files?.[0])}
                />
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
        <div className='flex flex-col gap-y-2 sm:flex-row sm:gap-x-2 sm:gap-y-0'>
          <Button
            type='button'
            className='sm:w-3/12'
            variant='outline'
            onClick={() => form.reset()}
            disabled={!ffmpegContext.loaded}
          >
            Reset
          </Button>
          <Button
            type='submit'
            className='w-full'
            disabled={!ffmpegContext.loaded}
          >
            Generate
          </Button>
        </div>
      </form>
    </Form>
  );
});

ModuleAudioTranscoder.displayName = 'ModuleAudioTranscoder';

const SLIDER_FIELDS: SliderFieldsDefinition[] = [
  {
    name: 'speed',
    sliderConfig: AUDIO_TRANSCODER_FIELD_CONFIG.speed,
    label: 'Speed',
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
    sliderConfig: AUDIO_TRANSCODER_FIELD_CONFIG.reverb.delay,
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
    sliderConfig: AUDIO_TRANSCODER_FIELD_CONFIG.reverb.decayFactor,
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
    sliderConfig: AUDIO_TRANSCODER_FIELD_CONFIG.reverb.wetDryMix,
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
