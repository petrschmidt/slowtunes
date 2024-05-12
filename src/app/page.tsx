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
import { useRef } from 'react';
import { Button } from '@/components/ui/button';

export default function Home() {
  const formRef = useRef<HTMLFormElement>(null);
  const onSubmit = () => formRef.current?.submit();

  return (
    <main className='flex min-h-screen items-center'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
          <Card className='md:col-span-2 lg:col-start-2'>
            <CardHeader>
              <CardTitle>SlowTunes</CardTitle>
              <CardDescription>
                Generate slowed and reverb music with ease
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AudioTransformerForm />
            </CardContent>
            <CardFooter>
              <Button type='submit' onSubmit={onSubmit}>
                Generate
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </main>
  );
}
