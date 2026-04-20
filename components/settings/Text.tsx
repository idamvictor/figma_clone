import {
  fontFamilyOptions,
  fontSizeOptions,
  fontWeightOptions,
} from "@/constants";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const selectConfigs = [
  {
    property: "fontFamily",
    placeholder: "Choose a font",
    options: fontFamilyOptions,
  },
  { property: "fontSize", placeholder: "30", options: fontSizeOptions },
  {
    property: "fontWeight",
    placeholder: "Semibold",
    options: fontWeightOptions,
  },
];

type TextProps = {
  fontFamily: string;
  fontSize: string;
  fontWeight: string;
  handleInputChange: (property: string, value: string) => void;
};

const Text = ({
  fontFamily,
  fontSize,
  fontWeight,
  handleInputChange,
}: TextProps) => (
  <div className='flex flex-col gap-3 border-b border-border px-5 py-4'>
    <span className='text-[10px] font-semibold uppercase tracking-wider text-muted-foreground'>Text</span>

    <div className='flex flex-col gap-3'>
      <div className="flex flex-col gap-1">
        <span className="text-[10px] text-muted-foreground/60 ml-0.5">Font Family</span>
        {RenderSelect({
          config: selectConfigs[0],
          fontSize,
          fontWeight,
          fontFamily,
          handleInputChange,
        })}
      </div>

      <div className='grid grid-cols-2 gap-2'>
         <div className="flex flex-col gap-1">
          <span className="text-[10px] text-muted-foreground/60 ml-0.5">Size</span>
          {RenderSelect({
            config: selectConfigs[1],
            fontSize,
            fontWeight,
            fontFamily,
            handleInputChange,
          })}
        </div>
         <div className="flex flex-col gap-1">
          <span className="text-[10px] text-muted-foreground/60 ml-0.5">Weight</span>
          {RenderSelect({
            config: selectConfigs[2],
            fontSize,
            fontWeight,
            fontFamily,
            handleInputChange,
          })}
        </div>
      </div>
    </div>
  </div>
);

type Props = {
  config: {
    property: string;
    placeholder: string;
    options: { label: string; value: string }[];
  };
  fontSize: string;
  fontWeight: string;
  fontFamily: string;
  handleInputChange: (property: string, value: string) => void;
};

const RenderSelect = ({
  config,
  fontSize,
  fontWeight,
  fontFamily,
  handleInputChange,
}: Props) => (
  <Select
    key={config.property}
    onValueChange={(value) => handleInputChange(config.property, value)}
    value={
      config.property === "fontFamily"
        ? fontFamily
        : config.property === "fontSize"
          ? fontSize
          : fontWeight
    }
  >
    <SelectTrigger className='no-ring w-full h-8 rounded-md border border-border bg-background px-3 text-xs hover:bg-muted transition-all'>
      <SelectValue
        placeholder={
          config.property === "fontFamily"
            ? "Choose a font"
            : config.property === "fontSize"
              ? "30"
              : "Semibold"
        }
      />
    </SelectTrigger>
    <SelectContent className='border-border bg-background text-foreground'>
      {config.options.map((option) => (
        <SelectItem
          key={option.value}
          value={option.value}
          className='focus:bg-primary focus:text-primary-foreground'
        >
          {option.label}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
);

export default Text;
