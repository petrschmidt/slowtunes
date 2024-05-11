import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function Home() {
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
            <CardContent></CardContent>
            <CardFooter>Test</CardFooter>
          </Card>
        </div>
      </div>
    </main>
  );
}
