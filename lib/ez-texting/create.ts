import axios, { AxiosResponse } from "axios";
import { createKey } from "next/dist/shared/lib/router/router";
import { stringify } from "querystring";

interface EZTextingResponse {
  Response: {
    Status: string;
    Code: number;
    Entry?: {
      ID: number;
      Subject: string;
      Message: string;
      MessageTypeID: number;
      RecipientsCount: number;
      Credits: number;
      StampToSend: string;
      PhoneNumbers: string[];
      LocalOptOuts: string[];
      GlobalOptOuts: string[];
      Groups: string[];
    };
    Errors?: string[];
  };
}

interface SendSMSResult {
  success: boolean;
  data?: EZTextingResponse["Response"]["Entry"];
  error?: string;
}

interface CreateContactResult {
  success: boolean;
  data?: EZTextingResponse["Response"]["Entry"];
  error?: string;
}

interface ContactInfo {
  PhoneNumber: string;
  FirstName?: string;
  LastName?: string;
  Email?: string;
  Groups?: string[];
}

class EZTextingClient {
  private username: string;
  private password: string;
  private baseURL: string;

  constructor(username: string, password: string) {
    this.username = username;
    this.password = password;
    this.baseURL = "https://app.eztexting.com";
  }

  async sendSMS(
    phoneNumbers: string | string[],
    message: string,
    subject: string = ""
  ): Promise<SendSMSResult> {
    const endpoint = "/sending/messages";

    const data = {
      User: this.username,
      Password: this.password,
      PhoneNumbers: Array.isArray(phoneNumbers) ? phoneNumbers : [phoneNumbers],
      Message: message,
      Subject: subject,
      MessageTypeID: 1,
    };

    try {
      const response: AxiosResponse<EZTextingResponse> = await axios.post(
        `${this.baseURL}${endpoint}?format=json`,
        stringify(data),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      if (response.data.Response.Code === 201) {
        return {
          success: true,
          data: response.data.Response.Entry,
        };
      } else {
        throw new Error(JSON.stringify(response.data.Response.Errors));
      }
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
      };
    }
  }

  async createContact(contactInfo: ContactInfo): Promise<CreateContactResult> {
    const endpoint = "/contacts";

    const data = {
      User: this.username,
      Password: this.password,
      PhoneNumber: contactInfo.PhoneNumber,
    };

    try {
      const response: AxiosResponse<EZTextingResponse> = await axios.post(
        `${this.baseURL}${endpoint}?format=json`,
        stringify(data),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      if (response.data.Response.Code === 201) {
        return {
          success: true,
          data: response.data.Response.Entry,
        };
      } else {
        throw new Error(JSON.stringify(response.data.Response.Errors ?? []));
      }
    } catch (error) {
      console.log(error);
      if (axios.isAxiosError(error) && error.response) {
        const responseData = error.response.data as EZTextingResponse;
        return {
          success: false,
          error:
            responseData.Response.Errors?.join(", ") ||
            "Unknown error occurred",
        };
      }
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
      };
    }
  }
}

export const createEZTextingClient = (
  username: string,
  password: string
): EZTextingClient => {
  return new EZTextingClient(username, password);
};

// Example usage:
// import { createEZTextingClient } from './ezTextingClient';
//
// const client = createEZTextingClient('your_username', 'your_password');
//
// async function optInAndSendMessage() {
//   try {
//     const optInResult = await client.optIn('1234567890');
//     console.log(optInResult);
//
//     if (optInResult.success) {
//       const sendResult = await client.sendSMS('1234567890', 'Hello, this is a test message!');
//       console.log(sendResult);
//     }
//   } catch (error) {
//     console.error(error);
//   }
// }
//
// optInAndSendMessage();
