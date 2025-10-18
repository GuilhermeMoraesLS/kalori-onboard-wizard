import { useState } from "react";
import { Slider } from "@/components/ui/slider";

interface HeightPickerProps {
  value?: number;
  onChange: (height: number) => void;
}

export const HeightPicker = ({ value = 170, onChange }: HeightPickerProps) => {
  const [height, setHeight] = useState(value);

  const handleChange = (newHeight: number) => {
    setHeight(newHeight);
    onChange(newHeight);
  };

  return (
    <div className="py-12">
      <div className="text-center mb-8">
        <div className="text-6xl font-bold text-primary mb-2">
          {height}
          <span className="text-3xl text-muted-foreground ml-2">cm</span>
        </div>
      </div>
      <Slider
        min={120}
        max={220}
        step={1}
        value={[height]}
        onValueChange={(valueArray) => handleChange(valueArray[0])}
        className="w-full"
      />
    </div>
  );
};
