import { NextRequest, NextResponse } from 'next/server';
import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!);

export async function POST(req: NextRequest) {
  const { query } = await req.json();

  if (!query || typeof query !== 'string') {
    return NextResponse.json({ error: 'Query is required' }, { status: 400 });
  }

  if (/delete/i.test(query)) {
    return NextResponse.json({ error: 'DELETE statements are not allowed' }, { status: 400 });
  }

  try {
    const result = await sql.unsafe(query);
    return NextResponse.json({ success: true, result });
  } catch (error) {
    if (error instanceof postgres.PostgresError) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'Failed to execute query' }, { status: 500 });
  }
}