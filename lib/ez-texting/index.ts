"use server";

import { createEZTextingClient } from "./create";

const client = createEZTextingClient("wireflowllc@gmail.com", "Wireflow@2024");

export async function sendMessage({ to, body }: { to: string; body: string }) {
  try {
    const result = await client.sendSMS(to, body);
    console.log(result);
  } catch (error) {
    console.error(error);
  }
}
