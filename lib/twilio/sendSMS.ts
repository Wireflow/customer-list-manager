"use server";

import smsClient, { phone_number } from ".";

export const sendSMS = async (body: string, to: string) => {
  const response = await smsClient.messages.create({
    from: phone_number,
    to,
    body,
  });

  if (response.errorMessage) {
    return { success: false, error: response.errorMessage };
  }

  return { success: true, message: response.dateSent };
};
