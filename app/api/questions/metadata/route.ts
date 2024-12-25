import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const questionsPath = path.join(process.cwd(), 'app/data/questions.json');
    const fileContents = fs.readFileSync(questionsPath, 'utf8');
    const data = JSON.parse(fileContents);
    
    return NextResponse.json(data.metadata);
  } catch (error) {
    console.error('Error reading metadata:', error);
    return NextResponse.json(
      { error: 'Failed to load book metadata' },
      { status: 500 }
    );
  }
}
