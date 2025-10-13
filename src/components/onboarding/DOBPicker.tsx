import React from "react";

type DOB = { day?: number; month?: number; year?: number };

export const DOBPicker = ({ value = {}, onChange }: { value?: DOB; onChange: (v: DOB) => void }) => {
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);

  return (
    <div className="flex gap-3 justify-center">
      <select value={value.month || ""} onChange={(e) => onChange({ ...value, month: parseInt(e.target.value) || undefined })} className="w-32 h-40 overflow-y-scroll">
        <option value="">Mês</option>
        {months.map((m) => <option key={m} value={m}>{m}</option>)}
      </select>
      <select value={value.day || ""} onChange={(e) => onChange({ ...value, day: parseInt(e.target.value) || undefined })} className="w-24 h-40 overflow-y-scroll">
        <option value="">Dia</option>
        {days.map((d) => <option key={d} value={d}>{d}</option>)}
      </select>
      <select value={value.year || ""} onChange={(e) => onChange({ ...value, year: parseInt(e.target.value) || undefined })} className="w-28 h-40 overflow-y-scroll">
        <option value="">Ano</option>
        {years.map((y) => <option key={y} value={y}>{y}</option>)}
      </select>
    </div>
  );
};