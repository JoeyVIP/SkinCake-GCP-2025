import { NextResponse } from 'next/server';
import { getRandomPosts } from '@/lib/wordpress-api';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const excludeId = parseInt(searchParams.get('exclude') || '0', 10);
    const count = parseInt(searchParams.get('count') || '6', 10);

    const posts = await getRandomPosts(count, isNaN(excludeId) ? undefined : excludeId);
    return NextResponse.json(posts);
  } catch (error) {
    console.error('API /random-related error:', error);
    return NextResponse.json({ error: 'Failed to fetch random posts' }, { status: 500 });
  }
} 