import 'dotenv/config';
import { readFile } from 'node:fs/promises';
import mongoose from 'mongoose';

import { connectMongoDB } from '../src/db/connectMongoDB.js';
import { Note } from '../src/models/note.js';

const seed = async () => {
  await connectMongoDB();

  const raw = await readFile(new URL('./notes.json', import.meta.url), 'utf-8');
  const notes = JSON.parse(raw);

  await Note.deleteMany();
  const inserted = await Note.insertMany(notes);

  console.log(`Seeded ${inserted.length} notes into "${Note.collection.name}"`);

  await mongoose.disconnect();
};

seed();
