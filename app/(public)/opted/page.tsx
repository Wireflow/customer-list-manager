"use client";

import React, { useState, useEffect } from "react";
import { CheckCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";

const Opted = () => {
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowMessage(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-md shadow-none border-none">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center space-y-6">
            <div
              className={`transition-all duration-1000 ease-out ${
                showMessage ? "scale-100 opacity-100" : "scale-50 opacity-0"
              }`}
            >
              <CheckCircle className="w-16 h-16 text-green-500" />
            </div>
            <div className="space-y-2">
              <h2
                className={`text-3xl font-semibold transition-all duration-1000 ease-out ${
                  showMessage
                    ? "translate-y-0 opacity-100"
                    : "translate-y-10 opacity-0"
                }`}
              >
                Thank you for opting in!
              </h2>
              <p
                className={`text-muted-foreground transition-all duration-1000 delay-300 ease-out ${
                  showMessage
                    ? "translate-y-0 opacity-100"
                    : "translate-y-10 opacity-0"
                }`}
              >
                You're all set to receive our awesome updates.
              </p>
            </div>
            <div
              className={`w-full transition-all duration-1000 delay-600 ease-out ${
                showMessage
                  ? "translate-y-0 opacity-100"
                  : "translate-y-10 opacity-0"
              }`}
            >
              <Alert variant="default" className="bg-muted">
                <AlertDescription>
                  Exciting messages are on their way to your inbox. Stay tuned!
                </AlertDescription>
              </Alert>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Opted;
