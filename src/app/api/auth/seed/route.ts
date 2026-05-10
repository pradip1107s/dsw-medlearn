import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST() {
  try {
    // Check if admin already exists
    const existingAdmin = await db.user.findUnique({
      where: { email: 'admin@dsw.com' },
    });

    if (existingAdmin) {
      return NextResponse.json({ message: 'Admin user already exists', user: { email: existingAdmin.email, role: existingAdmin.role } });
    }

    // Create admin user
    const admin = await db.user.create({
      data: {
        name: 'Dr. Sagathiya',
        email: 'admin@dsw.com',
        password: 'dsw@2025',
        role: 'admin',
        plan: 'annual',
      },
    });

    // Create demo student users
    const students = [
      { name: 'Dr. Arjun Patel', email: 'arjun@demo.com', password: 'demo@123', college: 'NMC Ahmedabad', year: '3rd Year', plan: 'premium' },
      { name: 'Priya Sharma', email: 'priya@demo.com', password: 'demo@123', college: 'HNGU Patan', year: 'Final Year', plan: 'free' },
      { name: 'Rahul Desai', email: 'rahul@demo.com', password: 'demo@123', college: 'GHU Surat', year: 'Intern', plan: 'annual' },
      { name: 'Anita Mehta', email: 'anita@demo.com', password: 'demo@123', college: 'SDM Mangalore', year: '2nd Year', plan: 'free' },
    ];

    for (const s of students) {
      await db.user.create({ data: s });
    }

    return NextResponse.json({
      message: 'Database seeded successfully',
      admin: { email: admin.email, role: admin.role },
      students: students.length,
    });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
