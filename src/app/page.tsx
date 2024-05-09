import Image from 'next/image';

export default function Home() {
  return (
    <main className='flex min-h-screen flex-col items-center justify-between p-24'>
      <div className='flex w-full justify-start'>
        <Image
          src='/slowtunes-logo.svg'
          alt='SlowTunes Logo'
          className='invert'
          width={200}
          height={28.3}
          priority
        />
      </div>
    </main>
  );
}
