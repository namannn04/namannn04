import { z } from "zod";
import path from "path";




export const READMEFILE_PATH = path.resolve(
  path.dirname(new URL(import.meta.url).pathname),
  "../../README.md",
);

export const DATA_DIR = path.resolve(
  path.dirname(new URL(import.meta.url).pathname),
  "../../data",
);

export const TODAY = new Date(
  new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }),
);
