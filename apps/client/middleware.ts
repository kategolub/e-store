import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is not set');
const secret = new TextEncoder().encode(process.env.JWT_SECRET);

async function isValid(token: string) {
  try {
    await jwtVerify(token, secret, { algorithms: ['HS256'] });
    return true;
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('access_token')?.value;

  if (token && (await isValid(token))) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}


export const config = {
  matcher: ['/auth/login', '/auth/register'],
};

