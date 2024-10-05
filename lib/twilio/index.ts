import client from "twilio";

const account_sid = "";
const auth_token = "";
export const phone_number = "";

export const smsClient = client(account_sid, auth_token);

export default smsClient;
