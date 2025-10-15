import { useState } from "react";

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
      <input
        type="range"
        min="40"
        max="200"
        value={weight}
        onChange={(e) => handleChange(parseInt(e.target.value))}
        className="w-full h-3 bg-secondary rounded-full appearance-none cursor-pointer accent-primary"
      />
      <div className="flex justify-between text-sm text-muted-foreground mt-2">
        <span>40 kg</span>
        <span>200 kg</span>
      </div>
    </div>
  );
};
