import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
	const { otpId, otp } = await req.json();

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

	return NextResponse.json(
		{
			message: 'OTP verified successfully',
		},
		{ status: 200 }
	);
}
