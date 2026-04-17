import fs from 'fs/promises';
import path from 'path';
import { NextResponse } from 'next/server';

let redisClient = null;
try {
  const { Redis } = require('@upstash/redis');
  if (process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL) {
    redisClient = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN,
    });
  }
} catch (e) {
  redisClient = null;
}

const getLocalDbPath = () => path.join(process.cwd(), 'local_records_db.json');

export async function POST(request) {
  try {
    const data = await request.json();
    const id = Date.now().toString();
    const record = { id, timestamp: new Date().toISOString(), ...data };

    if (redisClient) {
      // Use Upstash Redis
      await redisClient.lpush('financial_records', record);
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

    if (redisClient) {
      records = await redisClient.lrange('financial_records', 0, -1);
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
