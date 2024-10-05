"use server";

import { createEZTextingClient } from "./create";

// It's better to use environment variables for sensitive information
const client = createEZTextingClient(
  process.env.EZ_TEXTING_USERNAME!,
  process.env.EZ_TEXTING_PASSWORD!
);

export async function sendMessage({
  to,
  body,
}: {
  to: string | string[];
  body: string;
}) {
  try {
    const result = await client.sendSMS(to, body);

    if (!result.success) {
      throw new Error(result.error || "Failed to send SMS");
    }

    return { success: true, data: result.data };
  } catch (error) {
    console.error("Error sending message:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}

export async function optIn({ to }: { to: string }) {
  try {
    const result = await client.createContact({ PhoneNumber: to });
    console.log(result);

    if (!result.success) {
      throw new Error(result.error || "Failed to opt-in contact");
    }

    return { success: true, data: result.data };
  } catch (error) {
    console.error("Error opting in contact:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}
