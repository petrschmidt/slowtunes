import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/shadcn/alert';
import { PackagePlus } from 'lucide-react';
import { ButtonWithLoader } from '@/components/ui/button-with-loader';
import { useContext } from 'react';
import { FFmpegContext } from '@/contexts/ffmpeg-context';

export const FFmpegInitAlert = () => {
  const ffmpegContext = useContext(FFmpegContext);

  if (ffmpegContext.initialized) return null;

  return (
    <Alert className='mb-6'>
      <PackagePlus className='h-4 w-4' />
      <AlertTitle>First, initialize FFmpeg library</AlertTitle>
      <AlertDescription>
        FFmpeg library is required to enable the app&apos;s functionality.
        <br />
        <ButtonWithLoader
          type='button'
          className='mt-3'
          onClick={ffmpegContext.init}
          disabled={ffmpegContext.isInitializing}
          loading={ffmpegContext.isInitializing}
        >
          {ffmpegContext.isInitializing
            ? 'Initializing...'
            : 'Initialize FFmpeg'}
        </ButtonWithLoader>
      </AlertDescription>
    </Alert>
  );
};
