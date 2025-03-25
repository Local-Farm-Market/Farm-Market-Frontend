import { CheckCircle, Clock, Truck, AlertTriangle } from "lucide-react";
import { cn } from "@/src/lib/utils";

type TransactionStatus =
  | "payment_escrowed"
  | "in_delivery"
  | "completed"
  | "disputed";

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
      disputed: status === "disputed",
    },
    {
      id: "in_delivery",
      name: "In Delivery",
      icon: Truck,
      complete: ["in_delivery", "completed"].includes(status),
      disputed: status === "disputed",
    },
    {
      id: "completed",
      name: "Completed",
      icon: CheckCircle,
      complete: status === "completed",
      disputed: status === "disputed",
    },
  ];

  return (
    <div className="w-full">
      <div className="space-y-2">
        {status === "disputed" && (
          <div className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 p-3 rounded-md flex items-center gap-2 mb-4">
            <AlertTriangle className="h-5 w-5" />
            <span>This transaction is currently under dispute</span>
          </div>
        )}

        <div className="relative">
          <div className="overflow-hidden h-2 mb-6 flex rounded bg-muted">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={cn(
                  "h-full transition-all duration-300",
                  step.complete
                    ? "bg-primary"
                    : step.disputed
                    ? "bg-yellow-500"
                    : "bg-transparent",
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
                      : step.disputed
                      ? "bg-yellow-500 text-yellow-50"
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
