import path from "path";
import { fileURLToPath } from "url";

export const seoDistDir = () =>
  path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../dist");

export const isSeoCli = (scriptFile: string) =>
  process.argv.some((arg) =>
    arg.replace(/\\/g, "/").endsWith(`/${scriptFile}`)
  );

export const runCli = (work: Promise<unknown>) => {
  work.catch((error) => {
    console.error(error);
    process.exit(1);
  });
};
