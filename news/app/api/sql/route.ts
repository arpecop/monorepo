import { db } from "@/app/_lib/sql";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { sql } = (await req.json()) as unknown as { sql?: string };

  if (!sql || typeof sql !== "string") {
    return NextResponse.json(
      { error: "SQL query is required" },
      { status: 400 },
    );
  }

  if (/delete/i.test(sql)) {
    return NextResponse.json(
      { error: "DELETE statements are not allowed" },
      { status: 403 },
    );
  }

  try {
    const result = await db.unsafe(sql);
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(
      { error: "An unknown error occurred" },
      { status: 500 },
    );
  }
}
