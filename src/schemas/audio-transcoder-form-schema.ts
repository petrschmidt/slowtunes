import { z } from 'zod';
import { SliderConfig, SliderValueType } from '@/types/form';
import { zodSliderValidator } from '@/lib/form';

export type AudioTranscoderSliderFields = {
  speed: SliderConfig;
  reverb: Record<'delay' | 'decayFactor' | 'wetDryMix', SliderConfig>;
};

export const AUDIO_TRANSCODER_FIELD_CONFIG: AudioTranscoderSliderFields = {
  speed: {
    type: SliderValueType.Percent,
    min: 50,
    max: 100,
    step: 5,
  },
  reverb: {
    delay: {
      type: SliderValueType.Time,
      min: 0,
      max: 2000,
      step: 10,
    },
    decayFactor: {
      type: SliderValueType.Percent,
      min: 0,
      max: 100,
      step: 5,
    },
    wetDryMix: {
      type: SliderValueType.Percent,
      min: 0,
      max: 100,
      step: 5,
    },
  },
};

const AUDIO_TRANSCODER_MAX_FILE_SIZE = 1024 * 1024 * 100;
const AUDIO_TRANSCODER_ACCEPTED_AUDIO_FILE_TYPES = [
  'audio/aac',
  'audio/ac3',
  'audio/flac',
  'audio/m4a',
  'audio/x-m4a',
  'audio/mpeg',
  'audio/mp3',
  'audio/ogg',
  'audio/wav',
  'audio/wma',
];

export const AUDIO_TRANSFORMER_FORM_SCHEMA = z.object({
  file: z
    .custom<File>()
    .refine((file) => file instanceof File, {
      // If the refinement fails, throw an error with this message
      message: 'Expected a file',
    })
    .refine(
      (file) => file?.size <= AUDIO_TRANSCODER_MAX_FILE_SIZE,
      `Max file size is 100MB`,
    )
    .refine(
      (file) => AUDIO_TRANSCODER_ACCEPTED_AUDIO_FILE_TYPES.includes(file?.type),
      'Unsupported format, please try a different file type or codec',
    ),
  speed: zodSliderValidator(
    AUDIO_TRANSCODER_FIELD_CONFIG.speed,
    'Speed',
  ).transform((value) => value / 100),
  applyReverb: z.boolean(),
  reverbDelay: zodSliderValidator(
    AUDIO_TRANSCODER_FIELD_CONFIG.reverb.delay,
    'Reverb Delay',
  ),
  reverbDecayFactor: zodSliderValidator(
    AUDIO_TRANSCODER_FIELD_CONFIG.reverb.decayFactor,
    'Reverb Decay Factor',
  ).transform((value) => value / 100),
  reverbWetDryMix: zodSliderValidator(
    AUDIO_TRANSCODER_FIELD_CONFIG.reverb.wetDryMix,
    'Wet-Dry Mix',
  ),
});
