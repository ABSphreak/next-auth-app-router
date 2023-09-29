import { getServerSession } from 'next-auth';

export default async function Home() {
	const session = await getServerSession();

	return (
		<main className="w-full flex justify-center flex-col items-center">
			<div>Home Page</div>
			<div>{session?.user?.name}</div>
		</main>
	);
}
