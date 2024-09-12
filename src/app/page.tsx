'use client'

import { useUser } from '@auth0/nextjs-auth0/client';
import { redirect } from 'next/navigation';

export default function Home() {
	const { user, error, isLoading } = useUser();
	if (isLoading) return;
	if (!user) redirect('/api/auth/login');

	return (
		<main className="flex flex-col items-center justify-center h-screen">
			<h1>UniVerse Pre-Login Display Page (Home Page at /home)</h1>
		</main>
	);
}
