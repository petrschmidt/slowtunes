import {
  createContext,
  createRef,
  ReactNode,
  RefObject,
  useRef,
  useState,
} from 'react';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';
import {
  ffGetAudioFileFrequency,
  FFMPEG_URL_BASE_URL,
} from '@/lib/ffmpeg-utils';
import { useToast } from '@/components/ui/shadcn/use-toast';
import {
  ffComposeFilterComplex,
  FFComposeFilterComplexParams,
} from '@/lib/ffmpeg-utils';
import { getAudioFileFrequency } from '@/lib/frequency-analyser';

export type FFmpegContextProviderProps = {
  children?: ReactNode;
};

export const FFmpegContextProvider = ({
  children,
}: FFmpegContextProviderProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loaded, setLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const ffmpegRef = useRef(new FFmpeg());
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

  const registerFileInput = () => ({ ref: fileInputRef });

  const load = async () => {
    setIsLoading(true);

    const ffmpeg = ffmpegRef.current;
    ffmpeg.on('log', ({ message }) => {
      console.log(message);
    });

    await ffmpeg.load({
      coreURL: await toBlobURL(
        `ffmpeg-0.12.6/ffmpeg-core.js`,
        'text/javascript',
      ),
      wasmURL: await toBlobURL(
        `ffmpeg-0.12.6/ffmpeg-core.wasm`,
        'application/wasm',
      ),
    });

    setLoaded(true);
    setIsLoading(false);
  };

  console.log(fileInputRef);

  const transcode = async ({ tempo, reverb }: FFComposeFilterComplexParams) => {
    const ffmpeg = ffmpegRef.current;
    const audioFile = fileInputRef.current?.files?.[0];

    if (!audioFile) {
      toast({
        title: 'An error occured',
        description: 'Audio file missing or invalid',
      });
      return;
    }

    // console.log(await getAudioFileFrequency(audioFile));

    await ffmpeg.writeFile(audioFile.name, await fetchFile(audioFile));

    // await ffGetAudioFileFrequency(ffmpeg-0.12.6, audioFile.name);

    await ffmpeg.exec([
      '-i',
      audioFile.name,
      '-filter_complex',
      ffComposeFilterComplex({ tempo, reverb }),
      `SlowTunes - ${audioFile.name}`,
    ]);

    const data = await ffmpeg.readFile(`SlowTunes - ${audioFile.name}`);

    const link = document.createElement('a');
    link.style.display = 'none';
    link.href = URL.createObjectURL(new Blob([data], { type: 'audio/mp3' }));
    link.download = `SlowTunes - ${audioFile.name}`;

    document.body.appendChild(link);
    link.click();

    setTimeout(() => {
      URL.revokeObjectURL(link.href);
      link.parentNode?.removeChild(link);
    }, 0);
  };

  return (
    <FFmpegContext.Provider
      value={{ loaded, isLoading, load, registerFileInput, transcode }}
    >
      {children}
    </FFmpegContext.Provider>
  );
};

export type FFmpegContextProps = {
  loaded: boolean;
  isLoading: boolean;
  load: () => void;
  registerFileInput: () => { ref: RefObject<HTMLInputElement> };
  transcode: (params: FFComposeFilterComplexParams) => void;
};

export const FFmpegContext = createContext<FFmpegContextProps>({
  loaded: false,
  isLoading: false,
  load: () => {},
  registerFileInput: () => ({ ref: createRef() }),
  transcode: () => {},
});
