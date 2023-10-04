import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
	const { otpId, otp, mobile } = await req.json();

	if (!mobile) {
		return NextResponse.json(
			{ message: 'Please enter a valid mobile number' },
			{
				status: 400,
			}
		);
	}

	if (!otp || !otpId) {
		return NextResponse.json(
			{ message: 'Please enter a valid OTP' },
			{
				status: 400,
			}
		);
	}

	// Get OTP from database
	const otpRecord = await db.otp.findUnique({
		where: {
			id: otpId,
		},
	});

	if (!otpRecord) {
		return NextResponse.json(
			{ message: 'Something went wrong, Please try again' },
			{
				status: 400,
			}
		);
	}

	if (otpRecord.code !== otp) {
		return NextResponse.json(
			{ message: 'Please try again' },
			{
				status: 400,
			}
		);
	}

	if (otpRecord.expires < new Date()) {
		return NextResponse.json(
			{ message: 'OTP expired, Please try again' },
			{
				status: 400,
			}
		);
	}

	const user = await db.user.create({
		data: {
			mobile,
		},
	});

	return NextResponse.json(
		{
			user,
			message: 'OTP verified successfully',
		},
		{ status: 200 }
	);
}
