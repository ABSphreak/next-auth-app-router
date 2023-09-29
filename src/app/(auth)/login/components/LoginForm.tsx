'use client';

import { useRouter } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';

import Button from '@/components/Button';
import Input from '@/components/Input';
import GoogleIcon from '@/components/icons/GoogleIcon';
import GitHubIcon from '@/components/icons/GitHubIcon';

const LoginForm = () => {
	const router = useRouter();
	const { status } = useSession();

	if (status === 'authenticated') {
		router.push('/');
	}

	return (
		<div className="p-6 rounded-lg border flex-col border-slate-100 shadow-lg w-96 flex justify-center gap-y-3">
			Login
			<Input required className="w-full" placeholder="Email" type="email" />
			<Input required className="w-full" placeholder="Password" autoComplete="off" type="password" />
			<Button type="submit" className="w-full">
				Sign in
			</Button>
			<div className="h-[1px] bg-slate-200 my-4" />
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
