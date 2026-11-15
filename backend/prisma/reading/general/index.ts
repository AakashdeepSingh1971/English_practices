import type { ReadingTestDef } from "../types";
import { gt01 } from "./gt01";
import { gt02 } from "./gt02";
import { gt03 } from "./gt03";

// IELTS General Training Reading tests: Section 1 everyday texts, Section 2
// work-related texts, Section 3 one longer general-interest text.
// Add new tests here (one file per test). Numbers must be unique.
export const GENERAL_TESTS: ReadingTestDef[] = [gt01, gt02, gt03];
