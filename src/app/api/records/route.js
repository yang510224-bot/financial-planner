import fs from 'fs/promises';
import path from 'path';
import { NextResponse } from 'next/server';

let kv;
try {
  const vercelKv = require('@vercel/kv');
  kv = vercelKv.kv;
} catch (e) {
  kv = null;
}

const getLocalDbPath = () => path.join(process.cwd(), 'local_records_db.json');

export async function POST(request) {
  try {
    const data = await request.json();
    const id = Date.now().toString();
    const record = { id, timestamp: new Date().toISOString(), ...data };

    if (process.env.KV_REST_API_URL && kv) {
      // Use Vercel KV
      await kv.lpush('financial_records', record);
    } else {
      // Local development fallback
      const dbPath = getLocalDbPath();
      let currentData = [];
      try {
        const fileContent = await fs.readFile(dbPath, 'utf8');
        currentData = JSON.parse(fileContent);
      } catch (e) {
        // File not found, create new array
      }
      currentData.push(record);
      await fs.writeFile(dbPath, JSON.stringify(currentData, null, 2), 'utf8');
    }

    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error('Error saving data:', error);
    return NextResponse.json({ error: 'Failed to save data' }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    let records = [];

    if (process.env.KV_REST_API_URL && kv) {
      records = await kv.lrange('financial_records', 0, -1);
    } else {
      const dbPath = getLocalDbPath();
      try {
        const fileContent = await fs.readFile(dbPath, 'utf8');
        records = JSON.parse(fileContent);
        // Reverse array to put newest first, mimicking lpush behavior
        records.reverse();
      } catch (e) {
        records = [];
      }
    }

    return NextResponse.json({ records });
  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}
