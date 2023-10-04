'use client';

import axios from 'axios';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import { useForm, SubmitHandler } from 'react-hook-form';
import toast from 'react-hot-toast';

import Button from '@/components/Button';
import Input from '@/components/Input';
import GoogleIcon from '@/components/icons/GoogleIcon';
import GitHubIcon from '@/components/icons/GitHubIcon';

type LoginFormInputs = {
	email: string;
	password: string;
};

const LoginForm = () => {
	const router = useRouter();
	const { status } = useSession();
	const [otpId, setOtpId] = useState(false);
	const [mobile, setMobile] = useState('');
	const [otp, setOtp] = useState('');

	const {
		register: registerEmail,
		handleSubmit: handleSubmitEmail,
		// formState: { errors },
	} = useForm<LoginFormInputs>();

	if (status === 'authenticated') {
		router.push('/');
	}

	const handleEmailLogin: SubmitHandler<LoginFormInputs> = async values => {
		await signIn('email', {
			email: values.email,
			password: values.password,
			redirect: false,
		});
		router.push('/dashboard');
	};

	const handleSendOtp = async () => {
		try {
			const { status, data } = await axios.post('/api/send-otp', {
				mobile,
			});
			if (status === 200 || (status === 201 && data?.id)) {
				toast.success('OTP Sent');
				setOtpId(data.id);
				console.log({ data });
			}
		} catch (error) {
			toast.error('Error sending OTP');
			console.error(error);
		}
	};

	const handleOtpLogin = async () => {
		await signIn('otp', {
			otp,
			otpId,
			mobile,
			redirect: false,
		});
		router.push('/dashboard');
	};

	return (
		<div className="p-6 rounded-lg border flex-col border-slate-100 shadow-lg w-96 flex justify-center gap-y-3">
			Login with Email
			<form onSubmit={handleSubmitEmail(handleEmailLogin)} className="flex flex-col justify-center gap-y-3">
				<Input required className="w-full" placeholder="Email" type="email" {...registerEmail('email')} />
				<Input required className="w-full" placeholder="Password" autoComplete="off" type="password" {...registerEmail('password')} />
				<Button type="submit" className="w-full">
					Sign in with Email
				</Button>
			</form>
			<div className="h-[1px] bg-slate-200 my-4" />
			Login with OTP
			{otpId ? (
				<>
					<Input required className="w-full" placeholder="OTP" value={otp} type="text" onChange={e => setOtp(e.target.value)} />
					<Button onClick={handleOtpLogin} className="w-full">
						Verify & Login
					</Button>
				</>
			) : (
				<>
					<Input required className="w-full" placeholder="Mobile" type="text" value={mobile} onChange={e => setMobile(e.target.value)} />
					<Button onClick={handleSendOtp} className="w-full">
						Send OTP
					</Button>
				</>
			)}
			<div className="h-[1px] bg-slate-200 my-4" />
			Login with OAuth
			<Button className="w-full shadow-sm text-zinc-700 bg-white border border-zinc-200 hover:bg-zinc-100 active:bg-zinc-200" onClick={() => signIn('google')}>
				Sign in with Google <GoogleIcon />
			</Button>
			<Button className="w-full bg-zinc-800 hover:bg-zinc-900 active:bg-black" onClick={() => signIn('github')}>
				Sign in with GitHub <GitHubIcon />
			</Button>
		</div>
	);
};

export default LoginForm;
