import type { ModuleTypeValue } from "../../types/enums";

interface BandThreshold {
  minCorrect: number;
  band: number;
}

// Official published IELTS raw-score (out of 40) to band conversion tables.
// Listening and Academic Reading tables differ slightly, hence two tables.
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

export function rawScoreToBand(moduleType: ModuleTypeValue, rawScore: number): number {
  const table = moduleType === "LISTENING" ? LISTENING_BAND_TABLE : READING_BAND_TABLE;
  const match = table.find((entry) => rawScore >= entry.minCorrect);
  return match ? match.band : 0;
}
