import { useState } from "react";
import { Slider } from "@/components/ui/slider";

interface WeightPickerProps {
  value?: number;
  onChange: (weight: number) => void;
}

export const WeightPicker = ({ value = 70, onChange }: WeightPickerProps) => {
  const [weight, setWeight] = useState(value);

  const handleChange = (newWeight: number) => {
    setWeight(newWeight);
    onChange(newWeight);
  };

  return (
    <div className="py-12">
      <div className="text-center mb-8">
        <div className="text-6xl font-bold text-primary mb-2">
          {weight}
          <span className="text-3xl text-muted-foreground ml-2">kg</span>
        </div>
      </div>
      <Slider
        min={40}
        max={200}
        step={1}
        value={[weight]}
        onValueChange={(valueArray) => handleChange(valueArray[0])}
        className="w-full"
      />
    </div>
  );
};
