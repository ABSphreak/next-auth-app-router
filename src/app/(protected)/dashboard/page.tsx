import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

const DashboardPage = async () => {
	const session = await getServerSession();

	if (!session?.user) {
		redirect('/login');
	}

	return <>You can access the Dashboard {session.user.email}</>;
};

export default DashboardPage;
