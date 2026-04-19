import { exportToPdf } from "@/lib/utils";

import { Button } from "../ui/button";

const Export = ({ canvas }: { canvas: fabric.Canvas | null }) => (
  <div className='flex flex-col gap-3'>
    <span className='text-[10px] font-semibold uppercase tracking-wider text-muted-foreground'>Export</span>
    <Button
      variant='outline'
      className='w-full h-9 rounded-md border border-border bg-background text-foreground hover:bg-muted transition-all shadow-sm'
      onClick={() => exportToPdf(canvas)}
    >
      Export to PDF
    </Button>
  </div>
);

export default Export;
