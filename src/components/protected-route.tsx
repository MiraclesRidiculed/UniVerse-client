'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { type ReactNode, useEffect } from 'react';
import { LockKeyhole } from 'lucide-react';
import { useAuth } from './auth-provider';

export function LoginPrompt({ message = 'Login to continue.' }: { message?: string }) {
	return (
		<div className="surface-panel p-6 text-center">
			<div className="mx-auto flex h-11 w-11 items-center justify-center rounded-md border border-white/10 bg-white/5 text-teal-200">
				<LockKeyhole className="h-5 w-5" />
			</div>
			<h2 className="mt-4 text-xl font-semibold text-white">Authentication required</h2>
			<p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-300">
				{message}
			</p>
			<Link href="/" className="primary-button mt-5">
				Login or signup
			</Link>
		</div>
	);
}

export function ProtectedRoute({ children }: { children: ReactNode }) {
	const { loading, student, token } = useAuth();
	const router = useRouter();
	const pathname = usePathname();

	useEffect(() => {
		if (!loading && (!student || !token)) {
			router.replace(`/?next=${encodeURIComponent(pathname)}`);
		}
	}, [loading, pathname, router, student, token]);

	if (loading) {
		return (
			<div className="mx-auto min-h-screen max-w-6xl px-4 pb-12 pt-24 sm:px-6 lg:px-8">
				<div className="surface-panel p-6 text-sm text-slate-300">Checking session...</div>
			</div>
		);
	}

	if (!student || !token) {
		return (
			<div className="mx-auto min-h-screen max-w-6xl px-4 pb-12 pt-24 sm:px-6 lg:px-8">
				<LoginPrompt message="This page is part of your protected campus workspace." />
			</div>
		);
	}

	return children;
}
