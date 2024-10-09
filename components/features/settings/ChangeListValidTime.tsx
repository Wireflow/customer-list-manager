import React, { useState, useEffect, useMemo } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUpdateBranch } from "@/hooks/mutations/branches/useUpdateBranch";
import { useSession } from "@/hooks/queries/auth/useSession";
import { useBranchById } from "@/hooks/queries/branches/useBranchById";
import { millisecondsToHoursAndMinutes } from "@/utils/dateUtils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Clock } from "lucide-react";

const ChangeListValidTime: React.FC = () => {
  const { session } = useSession();
  const { data: branch, isLoading } = useBranchById({
    branchId: session?.user.user_metadata.branchId ?? "",
    enabled: true,
  });
  const { mutate, isPending } = useUpdateBranch();

  const [hours, setHours] = useState<string>("");
  const [minutes, setMinutes] = useState<string>("");

  useEffect(() => {
    if (branch?.listValidTime) {
      const { hours: h, minutes: m } = millisecondsToHoursAndMinutes(
        branch.listValidTime
      );
      setHours(h?.toString() || "");
      setMinutes(m?.toString() || "");
    }
  }, [branch?.listValidTime]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const totalMilliseconds =
      (parseInt(hours || "0") * 60 * 60 + parseInt(minutes || "0") * 60) * 1000;
    mutate({ id: branch?.id, listValidTime: totalMilliseconds });
  };

  const newMilliseconds = useMemo(() => {
    return (
      (parseInt(hours || "0") * 60 * 60 + parseInt(minutes || "0") * 60) * 1000
    );
  }, [hours, minutes]);

  const displayValue = (value: string, unit: string) => {
    if (value === "" || value === "0") return unit;
    return value;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          List Valid Time
        </CardTitle>
        <CardDescription>
          Set the duration for which a list remains valid after creation
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4 sm:space-y-0">
            <div className="flex flex-col sm:flex-row items-start sm:items-end space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="w-full sm:w-1/3">
                <Label htmlFor="hours" className="text-sm font-medium">
                  Hours
                </Label>
                <Select value={hours} onValueChange={setHours}>
                  <SelectTrigger id="hours" className="w-full">
                    <SelectValue placeholder="Hours">
                      {displayValue(hours, "Hours")}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {[...Array(24)].map((_, i) => (
                      <SelectItem key={i} value={i.toString()}>
                        {i}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-full sm:w-1/3">
                <Label htmlFor="minutes" className="text-sm font-medium">
                  Minutes
                </Label>
                <Select value={minutes} onValueChange={setMinutes}>
                  <SelectTrigger id="minutes" className="w-full">
                    <SelectValue placeholder="Minutes">
                      {displayValue(minutes, "Minutes")}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {[...Array(60)].map((_, i) => (
                      <SelectItem key={i} value={i.toString()}>
                        {i}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                type="submit"
                className="w-full sm:w-auto mt-4 sm:mt-0"
                disabled={
                  isPending ||
                  newMilliseconds === branch?.listValidTime ||
                  isLoading
                }
              >
                {isPending ? "Updating..." : "Update List Valid Time"}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ChangeListValidTime;
