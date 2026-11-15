import type { ReadingTestDef } from "../types";
import { test01 } from "./test01";
import { test02 } from "./test02";
import { test03 } from "./test03";

// IELTS Academic Reading tests. Add new tests here (one file per test). Numbers must be unique.
export const ACADEMIC_TESTS: ReadingTestDef[] = [test01, test02, test03];
/** @deprecated use ACADEMIC_TESTS */
export const READING_TESTS = ACADEMIC_TESTS;
