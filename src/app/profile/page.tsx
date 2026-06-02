'use client';

import { FormEvent, useEffect, useState } from 'react';
import { Github, Instagram, Linkedin } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { PageShell, SchemaChip, SectionPanel, StatCard } from '@/components/schema-shell';
import { useAuth } from '@/components/auth-provider';
import { ProtectedRoute } from '@/components/protected-route';
import { request, userMessage, type Student } from '@/lib/api';

export default function ProfilePage() {
	const { student, token, refreshMe } = useAuth();
	const [profile, setProfile] = useState<Student | null>(null);
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (!token) return;
		request<Student>('/students/me', { token })
			.then(setProfile)
			.catch((caught) => setError(userMessage(caught)))
			.finally(() => setLoading(false));
	}, [token]);

	const save = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const form = new FormData(event.currentTarget);
		try {
			const next = await request<Student>('/students/me', {
				method: 'PATCH',
				token,
				body: JSON.stringify(Object.fromEntries(form)),
			});
			setProfile(next);
			await refreshMe();
		} catch (caught: any) {
			setError(userMessage(caught));
		}
	};

	const current = profile || student;

	return (
		<ProtectedRoute>
		<PageShell
			eyebrow="Profile"
			title="Student identity and social links."
			description="Profile edits update the MySQL student row immediately through the protected API."
			actions={[{ href: '/search', label: 'Directory' }, { href: '/resources', label: 'Resources' }]}
		>
			{error ? <div className="surface-panel border-red-300/20 p-4 text-sm text-red-100">{error}</div> : null}
			{loading ? <div className="surface-panel p-4 text-sm text-slate-300">Loading profile...</div> : null}
			{!current ? (
				<div className="surface-panel p-6 text-sm text-slate-300">Login to view your protected profile.</div>
			) : (
				<>
					<div className="grid gap-4 md:grid-cols-3">
						<StatCard label="student id" value={current.studentId} hint="Primary key." />
						<StatCard label="campus" value={current.campus?.campusName || current.campusId} hint="Campus foreign key." />
						<StatCard label="activity" value={String((current.posts?.length || 0) + (current.resources?.length || 0))} hint="Posts and uploads." />
					</div>

					<div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
						<SectionPanel kicker="Identity" title="Student record">
							<div className="flex items-center gap-4">
								<Avatar className="h-20 w-20 border border-white/10 bg-teal-300/10">
									<AvatarFallback className="bg-transparent text-2xl text-teal-100">
										{current.name.split(' ').map((part) => part[0]).join('').slice(0, 2)}
									</AvatarFallback>
								</Avatar>
								<div>
									<h2 className="text-2xl font-semibold text-white">{current.name}</h2>
									<p className="mt-1 text-sm text-slate-300">{current.email}</p>
									<div className="mt-3 flex flex-wrap gap-2">
										<SchemaChip>{current.department}</SchemaChip>
										<SchemaChip>Batch {current.batch}</SchemaChip>
									</div>
								</div>
							</div>
							<div className="mt-6 grid gap-3">
								{[
									['Instagram', current.instagram, Instagram],
									['GitHub', current.github, Github],
									['LinkedIn', current.linkedin, Linkedin],
								].map(([label, value, Icon]: any) => (
									<a key={label} href={value || '#'} target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-md border border-white/10 bg-white/[0.03] p-3 text-sm text-slate-300">
										<Icon className="h-4 w-4 text-teal-200" />
										<span className="break-all">{value || `${label} not added`}</span>
									</a>
								))}
							</div>
						</SectionPanel>

						<SectionPanel kicker="Edit" title="Update profile">
							<form onSubmit={save} className="grid gap-4 sm:grid-cols-2">
								<input name="name" defaultValue={current.name} className="form-input" placeholder="Name" />
								<input name="email" type="email" defaultValue={current.email} className="form-input" placeholder="Email" />
								<input name="department" defaultValue={current.department} className="form-input" placeholder="Department" />
								<input name="batch" type="number" defaultValue={current.batch} className="form-input" placeholder="Batch" />
								<input name="instagram" defaultValue={current.instagram} className="form-input sm:col-span-2" placeholder="Instagram URL" />
								<input name="github" defaultValue={current.github} className="form-input sm:col-span-2" placeholder="GitHub URL" />
								<input name="linkedin" defaultValue={current.linkedin} className="form-input sm:col-span-2" placeholder="LinkedIn URL" />
								<button className="primary-button sm:col-span-2">Save profile</button>
							</form>
						</SectionPanel>
					</div>
				</>
			)}
		</PageShell>
		</ProtectedRoute>
	);
}
