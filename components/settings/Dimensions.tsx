import { Label } from "../ui/label";
import { Input } from "../ui/input";

const dimensionsOptions = [
  { label: "W", property: "width" },
  { label: "H", property: "height" },
];

type Props = {
  width: string;
  height: string;
  isEditingRef: React.MutableRefObject<boolean>;
  handleInputChange: (property: string, value: string) => void;
  disabled?: boolean;
};

const Dimensions = ({ width, height, isEditingRef, handleInputChange, disabled }: Props) => (
  <section className={`flex flex-col border-b border-border${disabled ? " opacity-40 pointer-events-none" : ""}`}>
    <div className='flex flex-col gap-3 px-5 py-4'>
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Dimensions</span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {dimensionsOptions.map((item) => (
          <div
            key={item.label}
            className='flex items-center gap-2 bg-background border border-border rounded-md px-2.5 py-1 transition-all focus-within:border-primary/50 focus-within:bg-muted/50'
          >
            <Label htmlFor={item.property} className='text-[10px] font-medium text-muted-foreground w-3'>
              {item.label}
            </Label>
            <Input
              type='number'
              id={item.property}
              placeholder='100'
              value={item.property === "width" ? width : height}
              className='!h-7 border-none bg-transparent p-0 text-xs focus-visible:ring-0 appearance-none'
              min={10}
              onChange={(e) => handleInputChange(item.property, e.target.value)}
              onBlur={(e) => {
                isEditingRef.current = false
              }}
            />
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Dimensions;
