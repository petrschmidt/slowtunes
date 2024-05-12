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
import { ButtonWithLoader } from '@/components/ui/button-with-loader';

const DEFAULT_VALUES = {
  file: undefined,
  speed: 85,
  applyReverb: true,
  reverbDelay: 80,
  reverbDecayFactor: 5,
  reverbWetDryMix: 15,
};

type InferredFormSchema = z.infer<typeof AUDIO_TRANSFORMER_FORM_SCHEMA>;

type SliderFieldsDefinition = {
  name: keyof InferredFormSchema;
  sliderConfig: SliderConfig;
  label: ReactNode;
  labelAppendix?: ReactNode;
  description?: ReactNode;
  separatorAfter?: boolean;
};

export const ModuleAudioTranscoder = forwardRef<HTMLFormElement>(({}, ref) => {
  const ffmpegContext = useContext(FFmpegContext);
  const form = useForm<InferredFormSchema>({
    resolver: zodResolver(AUDIO_TRANSFORMER_FORM_SCHEMA),
    defaultValues: DEFAULT_VALUES,
    disabled: !ffmpegContext.initialized,
    mode: 'onTouched',
    reValidateMode: 'onBlur',
  });

  const onSubmit = (values: InferredFormSchema) => {
    ffmpegContext.process({
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
            <FormItem>
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
        {SLIDER_FIELDS.map(
          ({ name, separatorAfter, ...sliderFieldItemProps }) => (
            <>
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
              {separatorAfter && <Separator />}
            </>
          ),
        )}
        <div className='flex flex-col gap-y-2 sm:flex-row sm:gap-x-2 sm:gap-y-0'>
          <Button
            type='button'
            className='sm:w-3/12'
            variant='outline'
            onClick={() => form.reset()}
            disabled={!ffmpegContext.initialized || ffmpegContext.isProcessing}
          >
            Reset
          </Button>
          <ButtonWithLoader
            type='submit'
            className='w-full'
            loading={ffmpegContext.isProcessing}
            disabled={!ffmpegContext.initialized || ffmpegContext.isProcessing}
          >
            {ffmpegContext.isProcessing ? 'Generating...' : 'Generate'}
          </ButtonWithLoader>
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
    labelAppendix: '(%)',
    description: (
      <>
        This value determines the rate of slowing down a song.{' '}
        <b>The lower the value, the slower the song.</b>
      </>
    ),
    separatorAfter: true,
  },
  {
    name: 'reverbDelay',
    sliderConfig: AUDIO_TRANSCODER_FIELD_CONFIG.reverb.delay,
    label: 'Reverb — Delay',
    labelAppendix: '(ms)',
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
    labelAppendix: '(%)',
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
    labelAppendix: '(%)',
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
