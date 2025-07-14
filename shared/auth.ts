import type { FieldAttribute } from "better-auth/db";

export enum AuthPermission {
  Guest = 0,
  User = 1 << 0,
  Writer = 1 << 1,
  Member = 1 << 2,
  BingoModerator = 1 << 3,
  Admin = 1 << 7,
}

export const hasPermission = (permissions: number, required: AuthPermission) => (permissions & required) !== 0;

export const userAdditionalFields = {
  permissions: {
    type: "number",
    required: true,
    defaultValue: 1,
    input: true,
  },
  flair: {
    type: "string",
    defaultValue: "none",
    input: true,
  },
  youtube: {
    type: "string",
    defaultValue: "none",
    input: true,
  },
  bilibili: {
    type: "string",
    defaultValue: "none",
    input: true,
  },
  discord: {
    type: "string",
    defaultValue: "none",
    input: true,
  },
  bluesky: {
    type: "string",
    defaultValue: "none",
    input: true,
  },
  twitter: {
    type: "string",
    defaultValue: "none",
    input: true,
  },
  reddit: {
    type: "string",
    defaultValue: "none",
    input: true,
  },
} satisfies {
  [key: string]: FieldAttribute;
};