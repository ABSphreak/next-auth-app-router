'use client';

import { useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import Button from '@/components/Button';

function AuthButton() {
	const { data: session } = useSession();
	const router = useRouter();

	if (session) {
		return (
			<Button variant="destructive" onClick={() => signOut()}>
				Logout
			</Button>
		);
	}

	return (
		<>
			<Button variant="ghost" onClick={() => router.push('/login')}>
				Login
			</Button>
			<Button variant="ghost" onClick={() => router.push('/register')}>
				Register
			</Button>
		</>
	);
}

const NavMenu = () => {
	const { data: session } = useSession();

	return (
		<div className="border-b border-slate-200">
			<nav className="container flex justify-between items-center py-2">
				<ul className="flex items-center gap-x-2 text-xl italic">
					<li>
						<Link href="/">NextAuth Test</Link>
					</li>
				</ul>
				<ul className="flex items-center gap-x-6">
					<li>
						<Link href="/">Home</Link>
					</li>
					<li>
						<Link href="/dashboard">Dashboard</Link>
					</li>
				</ul>
				<ul className="flex items-center gap-x-2">
					{session && <li>{session?.user?.name}</li>}
					<li>
						<AuthButton />
					</li>
				</ul>
			</nav>
		</div>
	);
};

export default NavMenu;
