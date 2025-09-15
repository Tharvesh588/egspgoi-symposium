
import fs from 'fs/promises';
import path from 'path';
import type { Department, Event, User, Winner } from './types';
import { initialDb } from './data';

type Db = {
    departments: Department[];
    users: User[];
    events: Event[];
    winners: Winner[];
}

const dbPath = path.join(process.cwd(), 'db.json');

async function readDb(): Promise<Db> {
    try {
        const data = await fs.readFile(dbPath, 'utf-8');
        return JSON.parse(data) as Db;
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            // If the file doesn't exist, create it with initial data
            await fs.writeFile(dbPath, JSON.stringify(initialDb, null, 2));
            return initialDb;
        }
        console.error("Error reading database:", error);
        throw new Error("Could not read from database.");
    }
}

async function writeDb(data: Db): Promise<void> {
    try {
        await fs.writeFile(dbPath, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error("Error writing to database:", error);
        throw new Error("Could not write to database.");
    }
}

export { readDb, writeDb };
export type { Db };
