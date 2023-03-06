import path from "path";
import { readFileSync } from "fs";
import { generate } from "../generator/index.js";

const sourcePath = path.resolve(process.cwd(), "ignitions/koda/cli/example.txt");
const source = readFileSync(sourcePath);

const result = generate({
  wordsCount: 300,
  start: 'Initial:',
  source,
});

console.log(result);
