import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
	const { email, password } = await req.json();

	const existingUser = await db.user.findUnique({
		where: {
			email,
		},
	});

	if (existingUser) {
		return NextResponse.json(
			{ message: 'User already exists' },
			{
				status: 422,
			}
		);
	}

	const salt = await bcrypt.genSalt(10);
	const hash = await bcrypt.hash(password, salt);

	const user = await db.user.create({
		data: {
			email,
			password: hash,
		},
	});

	return NextResponse.json(user, {
		status: 201,
	});
}
