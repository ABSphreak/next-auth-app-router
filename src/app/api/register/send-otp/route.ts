import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
	const { mobile } = await req.json();

	if (!mobile) {
		return NextResponse.json(
			{ message: 'Please enter a mobile number' },
			{
				status: 400,
			}
		);
	}

	const existingUser = await db.user.findFirst({
		where: {
			mobile,
		},
	});

	if (existingUser) {
		return NextResponse.json(
			{ message: 'User already exists' },
			{
				status: 400,
			}
		);
	}

	// Generate a new OTP
	const code = Math.random().toString().slice(2, 8);
	const expires = new Date(Date.now() + 5 * 60 * 1000);

	// Save OTP to database
	const otpRecord = await db.otp.create({
		data: {
			code,
			expires,
		},
	});

	// Send OTP to mobile
	// TODO: Implement SMS/WhatsApp API

	// Return OTP record
	return NextResponse.json(otpRecord, {
		status: 201,
	});
}
