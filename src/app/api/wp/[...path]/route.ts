import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: { path: string[] } }) {
  const subPath = params.path?.join('/') ?? '';
  const search = req.nextUrl.search ?? '';
  const targetUrl = `https://skincake.online/wp-json/wp/v2/${subPath}${search}`;

  try {
    const wpRes = await fetch(targetUrl, {
      headers: {
        Accept: 'application/json',
      },
      cache: 'no-store',
    });

    const body = await wpRes.text();

    const res = new NextResponse(body, {
      status: wpRes.status,
      headers: {
        'content-type': 'application/json',
        'x-proxy': 'skincake-next',
      },
    });
    return res;
  } catch (_) {
    return NextResponse.json({ error: 'proxy_failed' }, { status: 500 });
  }
} 