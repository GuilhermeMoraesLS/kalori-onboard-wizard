import React from "react";

export const PlanCards = ({ data }: { data: { calories: number; carbs: number; protein: number; fats: number } }) => {
  const cards = [
    { key: "calories", label: "Calorias", value: data.calories },
    { key: "carbs", label: "Carboidratos (g)", value: data.carbs },
    { key: "protein", label: "Proteína (g)", value: data.protein },
    { key: "fats", label: "Gorduras (g)", value: data.fats },
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {cards.map((c) => (
        <div key={c.key} className="bg-card p-4 rounded-2xl border flex flex-col items-center">
          <div className="text-sm text-muted-foreground">{c.label}</div>
          <div className="text-3xl font-bold my-2">{c.value}</div>
          <svg width="72" height="72" viewBox="0 0 36 36" className="mt-2">
            <path d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#eee" strokeWidth="2" />
            <path d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831" fill="none" stroke="#f97316" strokeWidth="2" strokeDasharray="80" strokeDashoffset="20" />
          </svg>
        </div>
      ))}
    </div>
  );
};