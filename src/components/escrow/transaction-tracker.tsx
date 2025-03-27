import { CheckCircle, Clock, Truck } from "lucide-react";
import { cn } from "@/src/lib/utils";

type TransactionStatus = "payment_escrowed" | "in_delivery" | "completed";

interface TransactionTrackerProps {
  status: TransactionStatus;
}

export function TransactionTracker({ status }: TransactionTrackerProps) {
  const steps = [
    {
      id: "payment_escrowed",
      name: "Payment Escrowed",
      icon: Clock,
      complete: ["payment_escrowed", "in_delivery", "completed"].includes(
        status
      ),
    },
    {
      id: "in_delivery",
      name: "In Delivery",
      icon: Truck,
      complete: ["in_delivery", "completed"].includes(status),
    },
    {
      id: "completed",
      name: "Completed",
      icon: CheckCircle,
      complete: status === "completed",
    },
  ];

  return (
    <div className="w-full">
      <div className="space-y-2">
        <div className="relative">
          <div className="overflow-hidden h-2 mb-6 flex rounded bg-muted">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={cn(
                  "h-full transition-all duration-300",
                  step.complete ? "bg-primary" : "bg-transparent",
                  index === 0 ? "rounded-l" : "",
                  index === steps.length - 1 ? "rounded-r" : ""
                )}
                style={{ width: `${100 / steps.length}%` }}
              />
            ))}
          </div>

          <div className="flex justify-between">
            {steps.map((step) => (
              <div key={step.id} className="flex flex-col items-center">
                <div
                  className={cn(
                    "flex items-center justify-center w-10 h-10 rounded-full mb-2",
                    step.complete
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  <step.icon className="h-5 w-5" />
                </div>
                <div className="text-xs text-center">{step.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
