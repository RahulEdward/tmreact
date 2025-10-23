"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import BrokerManagement from "@/components/dashboard/BrokerManagement";
import { CheckCircle } from "lucide-react";

export default function BrokersPage() {
  const searchParams = useSearchParams();
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    // Check if user just connected a broker
    if (searchParams.get("connected") === "true") {
      setShowSuccessMessage(true);
      // Hide success message after 5 seconds
      setTimeout(() => setShowSuccessMessage(false), 5000);
    }
  }, [searchParams]);

  return (
    <div className="space-y-6">
      {/* Success Message */}
      {showSuccessMessage && (
        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 flex items-start space-x-3">
          <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-green-400 font-medium">Broker Connected Successfully!</p>
            <p className="text-green-300 text-sm">Your broker account has been connected and is ready to use.</p>
          </div>
          <button
            onClick={() => setShowSuccessMessage(false)}
            className="ml-auto text-green-400 hover:text-green-300"
          >
            ×
          </button>
        </div>
      )}

      {/* Broker Management Component */}
      <BrokerManagement />
    </div>
  );
}