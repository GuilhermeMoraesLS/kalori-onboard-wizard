import { useEffect, useState } from "react";
import { loadOnboardingData, type OnboardingData } from "@/lib/storage";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const DebugPanel = () => {
  const [data, setData] = useState<OnboardingData>({});
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setData(loadOnboardingData());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen ? (
        <Button
          onClick={() => setIsOpen(true)}
          variant="outline"
          size="sm"
          className="shadow-lg"
        >
          🐛 Debug
        </Button>
      ) : (
        <Card className="p-4 max-w-md max-h-96 overflow-auto shadow-xl">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-sm">SessionStorage Data</h3>
            <Button
              onClick={() => setIsOpen(false)}
              variant="ghost"
              size="sm"
            >
              ✕
            </Button>
          </div>
          <pre className="text-xs bg-secondary p-2 rounded overflow-auto">
            {JSON.stringify(data, null, 2)}
          </pre>
        </Card>
      )}
    </div>
  );
};
