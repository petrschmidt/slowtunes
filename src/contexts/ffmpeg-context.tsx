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
import { useToast } from '@/components/ui/shadcn/use-toast';
import {
  ffComposeFilterComplex,
  FFComposeFilterComplexParams,
  FFMPEG_URL_BASE_URL,
} from '@/lib/ffmpeg-utils';

export type FFmpegContextProviderProps = {
  children?: ReactNode;
};

export const FFmpegContextProvider = ({
  children,
}: FFmpegContextProviderProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [initialized, setInitialized] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const ffmpegRef = useRef(new FFmpeg());
  const { toast } = useToast();

  const registerFileInput = () => ({ ref: fileInputRef });

  const init = async () => {
    setIsInitializing(true);

    const ffmpeg = ffmpegRef.current;
    ffmpeg.on('log', ({ message }) => {
      console.log(message);
    });

    await ffmpeg.load({
      coreURL: await toBlobURL(
        `${FFMPEG_URL_BASE_URL}/ffmpeg-core.js`,
        'text/javascript',
      ),
      wasmURL: await toBlobURL(
        `${FFMPEG_URL_BASE_URL}/ffmpeg-core.wasm`,
        'application/wasm',
      ),
    });

    setInitialized(true);
    setIsInitializing(false);
  };

  const process = async ({ tempo, reverb }: FFComposeFilterComplexParams) => {
    setIsProcessing(true);

    const ffmpeg = ffmpegRef.current;
    const audioFile = fileInputRef.current?.files?.[0];

    if (!audioFile) {
      toast({
        title: 'An error occurred',
        description: 'Audio file missing or invalid',
      });
      setIsProcessing(false);

      return;
    }

    await ffmpeg.writeFile(audioFile.name, await fetchFile(audioFile));

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

    setIsProcessing(false);
  };

  return (
    <FFmpegContext.Provider
      value={{
        initialized,
        isInitializing,
        init,
        registerFileInput,
        process,
        isProcessing,
      }}
    >
      {children}
    </FFmpegContext.Provider>
  );
};

export type FFmpegContextProps = {
  initialized: boolean;
  isInitializing: boolean;
  init: () => void;
  registerFileInput: () => { ref: RefObject<HTMLInputElement> };
  process: (params: FFComposeFilterComplexParams) => void;
  isProcessing: boolean;
};

export const FFmpegContext = createContext<FFmpegContextProps>({
  initialized: false,
  isInitializing: false,
  init: () => {},
  registerFileInput: () => ({ ref: createRef() }),
  process: () => {},
  isProcessing: false,
});
