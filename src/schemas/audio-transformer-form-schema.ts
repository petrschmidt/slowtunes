import { z } from 'zod';
import { SliderConfig, SliderValueType } from '@/types/form';
import { zodSliderValidator } from '@/lib/form';

export type AudioTransformerSliderFields = {
  slowdown: SliderConfig;
  reverb: Record<'delay' | 'decayFactor' | 'wetDryMix', SliderConfig>;
};

export const AUDIO_TRANSFORMER_FIELD_CONFIG: AudioTransformerSliderFields = {
  slowdown: {
    type: SliderValueType.Percent,
    min: 20,
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

export const AUDIO_TRANSFORMER_FORM_SCHEMA = z.object({
  file: z.instanceof(File),
  applySlowdown: z.boolean(),
  slowdown: zodSliderValidator(
    AUDIO_TRANSFORMER_FIELD_CONFIG.slowdown,
    'Slowdown Multiplier',
  ),
  applyReverb: z.boolean(),
  reverbDelay: zodSliderValidator(
    AUDIO_TRANSFORMER_FIELD_CONFIG.reverb.delay,
    'Reverb Delay',
  ),
  reverbDecayFactor: zodSliderValidator(
    AUDIO_TRANSFORMER_FIELD_CONFIG.reverb.decayFactor,
    'Reverb Decay Factor',
  ),
  reverbWetDryMix: zodSliderValidator(
    AUDIO_TRANSFORMER_FIELD_CONFIG.reverb.wetDryMix,
    'Wet-Dry Mix',
  ),
});
