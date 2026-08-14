import { useEffect } from "react";
import { useOptimizerStore } from "./optimizer-store";

export const useOptimizerService = () => {
  const { isScanning, updateMetrics } = useOptimizerStore();

  useEffect(() => {
    if (isScanning) return;

    // Simulate real-time metric updates
    const interval = setInterval(() => {
      updateMetrics([
        { 
          id: "cpu", 
          value: Math.floor(20 + Math.random() * 30),
          status: Math.random() > 0.9 ? "warning" : "optimal"
        },
        { 
          id: "ram", 
          value: Number((5.5 + Math.random() * 1.5).toFixed(1)),
          status: Math.random() > 0.8 ? "warning" : "optimal"
        },
        { 
          id: "temp_cpu", 
          value: Math.floor(45 + Math.random() * 10),
          status: Math.random() > 0.95 ? "warning" : "optimal"
        },
        {
          id: "ping",
          value: Math.floor(10 + Math.random() * 5),
          status: "optimal"
        }
      ]);
    }, 3000);

    return () => clearInterval(interval);
  }, [isScanning, updateMetrics]);

  return {
    isBridgeActive: false, // Future bridge integration
  };
};
