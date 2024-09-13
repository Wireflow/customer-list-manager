import { Database } from "./database.types";

export type EnumName = keyof Database["public"]["Enums"];

export type Enum<T extends EnumName> = Database["public"]["Enums"][T];
