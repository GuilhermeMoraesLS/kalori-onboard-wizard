import { useState } from "react";

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
      <input
        type="range"
        min="120"
        max="220"
        value={height}
        onChange={(e) => handleChange(parseInt(e.target.value))}
        className="w-full h-3 bg-secondary rounded-full appearance-none cursor-pointer accent-primary"
      />
      <div className="flex justify-between text-sm text-muted-foreground mt-2">
        <span>120 cm</span>
        <span>220 cm</span>
      </div>
    </div>
  );
};
