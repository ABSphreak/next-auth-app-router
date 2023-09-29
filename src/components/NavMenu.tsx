'use client';

import { useRouter } from 'next/navigation';
import { signIn, signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import Button from '@/components/Button';

function AuthButton() {
	const { data: session } = useSession();
	const router = useRouter();

	if (session) {
		return <Button onClick={() => signOut()}>Sign out</Button>;
	}

	return <Button onClick={() => router.push('/login')}>Sign in</Button>;
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
						<Link href="/">Home</Link>
					</li>
					<li>
						<Link href="/">Home</Link>
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
