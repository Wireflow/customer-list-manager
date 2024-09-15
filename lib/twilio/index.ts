import client from "twilio";

const account_sid = "ACd30e1ef05ce120e7583c0bb2b753b500";
const auth_token = "12f781b2ed424322a4be80ac2a242774";
export const phone_number = "+18557586392";

export const smsClient = client(account_sid, auth_token);

export default smsClient;
