'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth-provider';
import { userMessage } from '@/lib/api';

export default function LandingPage() {
	const router = useRouter();
	const { student, login, signup } = useAuth();
	const [mode, setMode] = useState<'login' | 'signup'>('login');
	const [error, setError] = useState('');
	const [busy, setBusy] = useState(false);

	useEffect(() => {
		const nextPath = new URLSearchParams(window.location.search).get('next') || '/home';
		if (student) router.push(nextPath);
	}, [router, student]);

	const submit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setBusy(true);
		setError('');
		const form = new FormData(event.currentTarget);
		try {
			if (mode === 'login') {
				await login(String(form.get('email')), String(form.get('password')));
			} else {
				await signup({
					name: String(form.get('name')),
					email: String(form.get('email')),
					password: String(form.get('password')),
				});
			}
			const nextPath = new URLSearchParams(window.location.search).get('next') || '/home';
			router.push(nextPath);
		} catch (caught: any) {
			setError(userMessage(caught));
		} finally {
			setBusy(false);
		}
	};

	return (
		<main className="flex min-h-screen items-center justify-center px-4 py-10">
			<section className="surface-panel w-full max-w-md p-6 sm:p-7">
				<div className="mb-7">
					<p className="text-sm font-semibold text-teal-200">UniVerse</p>
					<p className="mt-1 text-sm text-slate-400">Student campus platform</p>
				</div>
				<div className="mb-6">
					<h2 className="text-2xl font-semibold text-white">
						{mode === 'login' ? 'Welcome back' : 'Create your account'}
					</h2>
					<p className="mt-2 text-sm leading-6 text-slate-300">
						{mode === 'login'
							? 'Use your UniVerse email and password to open your campus workspace.'
							: 'Start with the basics. Academic details can be added from profile settings after login.'}
					</p>
				</div>
				<div className="mb-6 flex rounded-md border border-white/10 bg-white/[0.03] p-1">
					{(['login', 'signup'] as const).map((nextMode) => (
						<button
							key={nextMode}
							type="button"
							onClick={() => setMode(nextMode)}
							className={`flex-1 rounded px-3 py-2 text-sm capitalize transition ${
								mode === nextMode
									? 'bg-teal-300 text-slate-950'
									: 'text-slate-300 hover:bg-white/5'
							}`}
						>
							{nextMode}
						</button>
					))}
				</div>
				<form onSubmit={submit} className="space-y-5">
					{mode === 'signup' ? (
						<label className="block space-y-2">
							<span className="text-sm font-medium text-slate-300">Name</span>
							<input name="name" required placeholder="Full name" className="form-input" />
						</label>
					) : null}
					<label className="block space-y-2">
						<span className="text-sm font-medium text-slate-300">Email</span>
						<input name="email" required type="email" placeholder="you@universe.edu" className="form-input" />
					</label>
					<label className="block space-y-2">
						<span className="text-sm font-medium text-slate-300">Password</span>
						<input name="password" required type="password" minLength={8} placeholder="At least 8 characters" className="form-input" />
					</label>
					{error ? <p className="rounded-md border border-red-300/20 bg-red-500/10 p-3 text-sm text-red-100">{error}</p> : null}
					<button disabled={busy} className="primary-button w-full">
						{busy ? 'Working...' : mode === 'login' ? 'Login' : 'Create account'}
					</button>
				</form>
			</section>
		</main>
	);
}
