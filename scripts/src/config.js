import { z } from "zod";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const READMEFILE_PATH = path.resolve(__dirname, "../../README.md");

export const DATA_DIR = path.resolve(__dirname, "../../data");

export const TODAY = new Date(
  new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }),
);
console.log({
  READMEFILE_PATH,
  DATA_DIR,
});
