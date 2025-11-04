import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'trips.db');
const schemaPath = path.join(__dirname, 'schema.sql');

// Initialize database
export function initDatabase() {
  const db = new Database(dbPath);
  
  // Enable foreign keys
  db.pragma('foreign_keys = ON');
  
  // Read and execute schema
  const schema = fs.readFileSync(schemaPath, 'utf-8');
  db.exec(schema);
  
  return db;
}

// Get database instance (singleton)
let dbInstance = null;

export function getDatabase() {
  if (!dbInstance) {
    dbInstance = initDatabase();
  }
  return dbInstance;
}

export function closeDatabase() {
  if (dbInstance) {
    dbInstance.close();
    dbInstance = null;
  }
}

