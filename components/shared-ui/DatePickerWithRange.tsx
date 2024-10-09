import { addDays, format, subDays } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import * as React from "react";
import { DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

type DatePickerWithRangeProps = {
  onDateChange: (date?: DateRange) => void;
  defaultDate?: DateRange;
  date?: DateRange;
};

export function DatePickerWithRange({
  onDateChange,
  defaultDate,
  date,
}: DatePickerWithRangeProps) {
  const currentDefaultDate = defaultDate
    ? defaultDate
    : {
        from: subDays(new Date(), 7),
        to: addDays(new Date(), 1),
      };

  const [currentDate, setCurrentDate] = React.useState<DateRange | undefined>(
    currentDefaultDate
  );

  const handleOnChange = (date: DateRange | undefined) => {
    if (onDateChange) {
      return onDateChange(date);
    }
    setCurrentDate(date);
  };

  const displayDate = date || currentDate;

  return (
    <div className={cn("grid gap-2")}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            id="date"
            className={cn(
              "flex h-14 w-[280px] items-center justify-between rounded-lg border-gray-200 text-left text-[15px] font-semibold text-gray-500",
              !date && "text-muted-foreground"
            )}
          >
            <p className="pt-1">
              {displayDate?.from ? (
                displayDate.to ? (
                  <>
                    {format(displayDate.from, "LLL dd, y")} -{" "}
                    {format(displayDate.to, "LLL dd, y")}
                  </>
                ) : (
                  format(displayDate.from, "LLL dd, y")
                )
              ) : (
                <span>Pick a date range</span>
              )}
            </p>
            <CalendarIcon className="ml-2 h-7 w-7 text-black" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={displayDate?.from}
            selected={displayDate}
            onSelect={handleOnChange}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
