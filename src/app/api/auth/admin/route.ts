import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password are required' }, { status: 400 });
    }

    // Admin login uses username field — check if email matches or username matches
    const adminEmail = username.includes('@') ? username.trim().toLowerCase() : `${username.trim().toLowerCase()}@dsw.com`;

    const user = await db.user.findUnique({
      where: { email: adminEmail },
    });

    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Invalid admin credentials' }, { status: 401 });
    }

    if (user.password !== password) {
      return NextResponse.json({ error: 'Invalid admin credentials' }, { status: 401 });
    }

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
