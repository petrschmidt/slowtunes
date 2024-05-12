export const FFMPEG_URL_BASE_URL =
  'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';

export type FFComposeFilterComplexParams = {
  tempo: number;
  reverb?: {
    delay: number;
    decay: number;
    wet: number;
  };
};

export const ffComposeFilterComplex = ({
  tempo,
  reverb,
}: FFComposeFilterComplexParams) =>
  // `[0:a]atempo=${tempo},adelay=${reverb.delay}|${reverb.delay},areverb=${reverb.decay}:0:0:0:0:0:${reverb.wet}:${100 - reverb.wet}`;
  `[0:a]atempo=${tempo}, asetrate=35280`;
