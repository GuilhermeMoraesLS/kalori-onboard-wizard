import React from "react";
import { OptionButton } from "./OptionButton";

export const MultiSelectButtons = ({ options, value = [], onChange }: { options: string[]; value: string[]; onChange: (v: string[]) => void }) => {
  const toggle = (opt: string) => {
    if (value.includes(opt)) onChange(value.filter((v) => v !== opt));
    else onChange([...value, opt]);
  };

  return (
    <div className="space-y-3">
      {options.map((opt, i) => (
        <OptionButton key={opt} selected={value.includes(opt)} onClick={() => toggle(opt)} delay={i}>
          {opt}
        </OptionButton>
      ))}
    </div>
  );
};