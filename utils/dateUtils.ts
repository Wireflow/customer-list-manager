export const millisecondsToHours = (milliseconds: number) => {
  if (typeof milliseconds !== "number" || isNaN(milliseconds)) {
    throw new Error("Invalid input: milliseconds must be a number");
  }

  const MILLISECONDS_PER_HOUR = 3600000; // 3600000 ms = 1 hour
  return milliseconds / MILLISECONDS_PER_HOUR;
};
