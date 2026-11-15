import type { ReadingTestDef } from "../types";
import { test01 } from "./test01";
import { test02 } from "./test02";
import { test03 } from "./test03";

// Add new tests here (one file per test). Numbers must be unique.
export const READING_TESTS: ReadingTestDef[] = [test01, test02, test03];
