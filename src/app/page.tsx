'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/shadcn/card';
import { ModuleAudioTranscoder } from '@/components/modules/module-audio-transcoder';
import {
  FFmpegContext,
  FFmpegContextProvider,
} from '@/contexts/ffmpeg-context';
import { ReactNode, useContext, useEffect } from 'react';
import Image from 'next/image';
import { useToast } from '@/components/ui/shadcn/use-toast';
import { FFmpegInitAlert } from '@/components/ffmpeg-init-alert';
import NoSSRWrapper from '@/components/no-ssr-wrapper';

export default function Home() {
  return (
    <NoSSRWrapper>
      <FFmpegContextProvider>
        <main className='flex min-h-screen w-full justify-center bg-gradient-to-tr from-indigo-50 via-white to-cyan-100 md:items-center dark:from-indigo-950 dark:via-black dark:to-cyan-950'>
          <div className='p-2 md:p-8'>
            <ModuleWrapper />
          </div>
        </main>
      </FFmpegContextProvider>
    </NoSSRWrapper>
  );
}

type ModuleWrapperProps = {
  children?: ReactNode;
};

const ModuleWrapper = ({ children }: ModuleWrapperProps) => {
  const ffmpegContext = useContext(FFmpegContext);
  const { toast } = useToast();

  useEffect(() => {
    if (ffmpegContext.initialized) {
      toast({
        title: 'FFmpeg Initialized ✅',
        description:
          'The FFmpeg library has been successfully initialized; you can now fully use the app!',
      });
    }
  }, [ffmpegContext.initialized, toast]);

  return (
    <Card className='max-w-2xl bg-white/65 shadow-2xl shadow-black/10 backdrop-blur dark:bg-slate-900/75'>
      <CardHeader>
        <CardTitle>
          <Image
            className='pb-2 dark:hidden'
            src='/slowtunes-logo-light-mode.svg'
            alt='SlowTunes Logo'
            width={160}
            height={29}
          />
          <Image
            className='hidden pb-2 dark:block'
            src='/slowtunes-logo-dark-mode.svg'
            alt='SlowTunes Logo'
            width={160}
            height={29}
          />
        </CardTitle>
        <CardDescription>
          Generate slowed and reverb music with ease
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FFmpegInitAlert />
        <ModuleAudioTranscoder />
      </CardContent>
    </Card>
  );
};
