import { createClient } from '@libsql/client';

// Cliente directo a Turso
const db = createClient({
  url: process.env.DATABASE_URL || 'libsql://madrugada-salvada-alejandralarquin.aws-us-west-2.turso.io',
  authToken: process.env.TURSO_AUTH_TOKEN || '',
});

// Generar ID simple
function generateId(): string {
  return 'id-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
}

export async function findLead(email: string) {
  const result = await db.execute({
    sql: 'SELECT * FROM Lead WHERE email = ?',
    args: [email],
  });
  return result.rows[0] as { id: string; email: string; secuencia: number; estado: string } | undefined;
}

export async function createLead(email: string) {
  const id = generateId();
  await db.execute({
    sql: "INSERT INTO Lead (id, email, secuencia, estado, createdAt, updatedAt) VALUES (?, ?, 1, 'nuevo', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)",
    args: [id, email],
  });
  return { id, email, secuencia: 1, estado: 'nuevo' };
}

export async function updateLead(email: string, secuencia: number, estado: string) {
  await db.execute({
    sql: 'UPDATE Lead SET secuencia = ?, estado = ?, updatedAt = CURRENT_TIMESTAMP WHERE email = ?',
    args: [secuencia, estado, email],
  });
}

export async function createDiagnosis(data: {
  email: string;
  profile: string;
  answer1: string;
  answer2: string;
  answer3: string;
  answer4: string;
  answer5: string;
  secuencia: number;
  estado: string;
}) {
  const id = generateId();
  await db.execute({
    sql: `INSERT INTO Diagnosis (id, email, profile, answer1, answer2, answer3, answer4, answer5, secuencia, estado, emailSent, createdAt, updatedAt) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
    args: [id, data.email, data.profile, data.answer1, data.answer2, data.answer3, data.answer4, data.answer5, data.secuencia, data.estado],
  });
  return id;
}

export { db };
