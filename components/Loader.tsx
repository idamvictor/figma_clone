import Image from "next/image";

const Loader = () => (
  <div className='flex h-screen w-screen flex-col items-center justify-center gap-4 bg-background'>
    <div className="relative">
      <Image
        src='/assets/loader.gif'
        alt='loader'
        width={100}
        height={100}
        className='object-contain'
      />
    </div>
    <div className="flex flex-col items-center gap-2">
      <p className='text-xs font-bold tracking-[0.3em] uppercase text-muted-foreground animate-pulse'>FIGPRO</p>
      <div className="h-0.5 w-6 bg-primary rounded-full" />
    </div>
  </div>
);

export default Loader;
