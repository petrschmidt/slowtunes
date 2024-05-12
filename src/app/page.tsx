'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { AudioTransformerForm } from '@/components/audio-transformer-form';

export default function Home() {
  return (
    <main className='flex min-h-screen w-full justify-center bg-gradient-to-tr from-indigo-50 via-white to-cyan-100 md:items-center'>
      <div className='p-2 md:p-8'>
        <Card className='max-w-xl bg-white/65 shadow-2xl shadow-black/10 backdrop-blur'>
          <CardHeader>
            <CardTitle>SlowTunes</CardTitle>
            <CardDescription>
              Generate slowed and reverb music with ease
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AudioTransformerForm />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
