import { Database } from "./database";

export type EnumName = keyof Database["public"]["Enums"];

export type Enum<T extends EnumName> = Database["public"]["Enums"][T];
