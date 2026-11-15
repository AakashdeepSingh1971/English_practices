import { openDB, type IDBPDatabase } from "idb";

const DB_NAME = "ielts-prep-cache";
const STORE_NAME = "in-progress-answers";

let dbPromise: Promise<IDBPDatabase> | null = null;

function getDb() {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      },
    });
  }
  return dbPromise;
}

// Keyed by submissionId so a refresh mid-test can restore the draft even if
// the backend autosave hasn't caught up yet.
export async function saveDraftAnswers(submissionId: string, answers: Record<string, unknown>) {
  const db = await getDb();
  await db.put(STORE_NAME, answers, submissionId);
}

export async function loadDraftAnswers(submissionId: string): Promise<Record<string, unknown> | undefined> {
  const db = await getDb();
  return db.get(STORE_NAME, submissionId);
}

export async function clearDraftAnswers(submissionId: string) {
  const db = await getDb();
  await db.delete(STORE_NAME, submissionId);
}
