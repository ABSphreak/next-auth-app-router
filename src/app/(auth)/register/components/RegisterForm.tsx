'use client';

import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useForm, SubmitHandler } from 'react-hook-form';
import toast from 'react-hot-toast';

import Button from '@/components/Button';
import Input from '@/components/Input';
import { useState } from 'react';

type RegisterFormInputs = {
	email: string;
	password: string;
};

const RegisterForm = () => {
	const router = useRouter();
	const { status } = useSession();
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<RegisterFormInputs>();

	const [otpId, setOtpId] = useState(false);
	const [mobile, setMobile] = useState('');
	const [otp, setOtp] = useState('');

	if (status === 'authenticated') {
		router.push('/');
	}

	const handleRegister: SubmitHandler<RegisterFormInputs> = async values => {
		try {
			const { status, data } = await axios.post('/api/register', values);
			if (status === 200 || status === 201) {
				console.log({ data });
				toast.success('Successfully registered!');
				router.push('/');
			} else {
				toast.error(data.message ?? 'An error occurred.');
			}
		} catch (error: any) {
			toast.error(error?.response.data.message ?? 'An error occurred.');
		}
	};

	const handleSendOtp = async () => {
		try {
			const { status, data } = await axios.post('/api/register/send-otp', {
				mobile,
			});
			if (status === 200 || (status === 201 && data?.id)) {
				toast.success('OTP Sent');
				setOtpId(data.id);
				console.log({ data });
			}
		} catch (error: any) {
			toast.error(error?.response.data.message ?? 'Error sending OTP');
			console.error(error);
		}
	};

	const handleOtpLogin = async () => {
		try {
			const { status, data } = await axios.post('/api/register/verify-otp', {
				otp,
				otpId,
				mobile,
			});
			if (status === 200 || (status === 201 && data?.id)) {
				toast.success('Successfully registed! Please login');
			}
		} catch (error: any) {
			toast.error(error?.response.data.message ?? 'An error occurred.');
			console.error(error);
		}
		router.push('/');
	};

	return (
		<form onSubmit={handleSubmit(handleRegister)} className="p-6 rounded-lg border flex-col border-slate-100 shadow-lg w-96 flex justify-center gap-y-3">
			Register with Email
			<Input required className="w-full" placeholder="Email" type="email" {...register('email', { required: true })} />
			{errors.email && <span className="text-red-500">{errors.email.message}</span>}
			<Input required className="w-full" placeholder="Password" autoComplete="off" type="password" {...register('password', { required: true })} />
			{errors.password && <span className="text-red-500">{errors.password.message}</span>}
			<Button type="submit" className="w-full">
				Register
			</Button>
			<div className="h-[1px] bg-slate-200 my-4" />
			Register with OTP
			{otpId ? (
				<>
					<Input required className="w-full" placeholder="OTP" value={otp} type="text" onChange={e => setOtp(e.target.value)} />
					<Button onClick={handleOtpLogin} className="w-full">
						Verify & Register
					</Button>
				</>
			) : (
				<>
					<Input required className="w-full" placeholder="Mobile" type="text" value={mobile} onChange={e => setMobile(e.target.value)} />
					<Button type="button" onClick={handleSendOtp} className="w-full">
						Send OTP
					</Button>
				</>
			)}
		</form>
	);
};

export default RegisterForm;
