import type { ModuleTypeValue } from "../../types/enums";

interface BandThreshold {
  minCorrect: number;
  band: number;
}

// Official published IELTS raw-score (out of 40) to band conversion tables.
// Listening, Academic Reading and General Training Reading each have their own.
// General Training needs more correct answers for the same band, because its
// texts are less demanding.
const LISTENING_BAND_TABLE: BandThreshold[] = [
  { minCorrect: 39, band: 9.0 },
  { minCorrect: 37, band: 8.5 },
  { minCorrect: 35, band: 8.0 },
  { minCorrect: 32, band: 7.5 },
  { minCorrect: 30, band: 7.0 },
  { minCorrect: 26, band: 6.5 },
  { minCorrect: 23, band: 6.0 },
  { minCorrect: 18, band: 5.5 },
  { minCorrect: 16, band: 5.0 },
  { minCorrect: 13, band: 4.5 },
  { minCorrect: 10, band: 4.0 },
  { minCorrect: 0, band: 0 },
];

const READING_BAND_TABLE: BandThreshold[] = [
  { minCorrect: 39, band: 9.0 },
  { minCorrect: 37, band: 8.5 },
  { minCorrect: 35, band: 8.0 },
  { minCorrect: 33, band: 7.5 },
  { minCorrect: 30, band: 7.0 },
  { minCorrect: 27, band: 6.5 },
  { minCorrect: 23, band: 6.0 },
  { minCorrect: 19, band: 5.5 },
  { minCorrect: 15, band: 5.0 },
  { minCorrect: 13, band: 4.5 },
  { minCorrect: 10, band: 4.0 },
  { minCorrect: 0, band: 0 },
];

const GENERAL_TRAINING_READING_BAND_TABLE: BandThreshold[] = [
  { minCorrect: 40, band: 9.0 },
  { minCorrect: 39, band: 8.5 },
  { minCorrect: 37, band: 8.0 },
  { minCorrect: 36, band: 7.5 },
  { minCorrect: 34, band: 7.0 },
  { minCorrect: 32, band: 6.5 },
  { minCorrect: 30, band: 6.0 },
  { minCorrect: 27, band: 5.5 },
  { minCorrect: 23, band: 5.0 },
  { minCorrect: 19, band: 4.5 },
  { minCorrect: 15, band: 4.0 },
  { minCorrect: 12, band: 3.5 },
  { minCorrect: 9, band: 3.0 },
  { minCorrect: 6, band: 2.5 },
  { minCorrect: 0, band: 0 },
];

// Which band table a reading task uses; stored as contentJson.bandScale.
export type BandScale = "ACADEMIC" | "GENERAL_TRAINING";

export function rawScoreToBand(moduleType: ModuleTypeValue, rawScore: number, scale: BandScale = "ACADEMIC"): number {
  const table =
    moduleType === "LISTENING"
      ? LISTENING_BAND_TABLE
      : scale === "GENERAL_TRAINING"
        ? GENERAL_TRAINING_READING_BAND_TABLE
        : READING_BAND_TABLE;
  const match = table.find((entry) => rawScore >= entry.minCorrect);
  return match ? match.band : 0;
}
