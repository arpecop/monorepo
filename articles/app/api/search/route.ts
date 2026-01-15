import { NextResponse } from 'next/server';
import { getClient } from '@/lib/apollo-client';
import { SEARCH_ARTICLES } from '@/lib/queries';

export async function POST(request: Request) {
  try {
    const { where } = await request.json();

    const result = await getClient().query({
      query: SEARCH_ARTICLES,
      variables: { where },
    });

    return NextResponse.json({ articles: result.data?.qa_ai || [] });
  } catch (error: any) {
    console.error('Search error:', error);
    return NextResponse.json({ articles: [], error: error.message }, { status: 500 });
  }
}
