'use client';

import { FormEvent, useEffect, useState } from 'react';
import { Users } from 'lucide-react';
import { PageShell, SchemaChip, SectionPanel, StatCard } from '@/components/schema-shell';
import { useAuth } from '@/components/auth-provider';
import { LoginPrompt, ProtectedRoute } from '@/components/protected-route';
import { request, userMessage, type Campus, type Community, type Student } from '@/lib/api';

export default function CampusPage() {
	const { token, student } = useAuth();
	const [campuses, setCampuses] = useState<Campus[]>([]);
	const [communities, setCommunities] = useState<Community[]>([]);
	const [members, setMembers] = useState<Record<string, Student[]>>({});
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(true);

	const load = async () => {
		setLoading(true);
		const [nextCampuses, nextCommunities] = await Promise.all([
			request<Campus[]>('/campuses'),
			request<Community[]>('/communities', { token }),
		]);
		setCampuses(nextCampuses);
		setCommunities(nextCommunities);
		setLoading(false);
	};

	useEffect(() => {
		if (!token) return;
		load()
			.catch((caught) => setError(userMessage(caught)))
			.finally(() => setLoading(false));
	}, [token]);

	const create = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const form = new FormData(event.currentTarget);
		try {
			await request<Community>('/communities', {
				method: 'POST',
				token,
				body: JSON.stringify(Object.fromEntries(form)),
			});
			event.currentTarget.reset();
			await load();
		} catch (caught: any) {
			setError(userMessage(caught));
		}
	};

	const join = async (communityId: string) => {
		try {
			await request<Community>(`/communities/${communityId}/join`, {
				method: 'POST',
				token,
			});
			await load();
		} catch (caught) {
			setError(userMessage(caught));
		}
	};

	const showMembers = async (communityId: string) => {
		try {
			const data = await request<Student[]>(`/communities/${communityId}/members`);
			setMembers((current) => ({ ...current, [communityId]: data }));
		} catch (caught) {
			setError(userMessage(caught));
		}
	};

	return (
		<ProtectedRoute>
		<PageShell
			eyebrow="Communities"
			title="Create groups, join them, and inspect membership."
			description="Community records stay attached to campuses, while membership is tracked through a dedicated join table."
			actions={[{ href: '/home', label: 'Feed' }, { href: '/resources', label: 'Resources' }]}
		>
			{error ? <div className="surface-panel border-red-300/20 p-4 text-sm text-red-100">{error}</div> : null}
			{loading ? <div className="surface-panel p-4 text-sm text-slate-300">Loading communities...</div> : null}
			<div className="grid gap-4 md:grid-cols-3">
				<StatCard label="campuses" value={String(campuses.length)} hint="Campus parent records." />
				<StatCard label="communities" value={String(communities.length)} hint="Groups across campuses." />
				<StatCard label="signed in" value={student ? 'Yes' : 'No'} hint="Required to create or join." />
			</div>

			<div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
				<SectionPanel kicker="Create" title="Start a community">
					{student ? (
						<form onSubmit={create} className="space-y-4">
							<input name="name" required placeholder="Community name" className="form-input" />
							<select name="campusId" required className="form-input">
								<option value="">Choose campus</option>
								{campuses.map((campus) => (
									<option key={campus.campusId} value={campus.campusId}>{campus.campusName}</option>
								))}
							</select>
							<textarea name="description" rows={4} placeholder="What is this community for?" className="form-input resize-none" />
							<button className="primary-button">Create community</button>
						</form>
					) : (
						<LoginPrompt message="Login to create or join campus communities." />
					)}
				</SectionPanel>

				<SectionPanel kicker="Directory" title="Campus communities">
					<div className="grid gap-4">
						{!loading && communities.length === 0 ? (
							<div className="rounded-lg border border-white/10 bg-white/[0.03] p-4 text-sm text-slate-300">
								No communities exist yet.
							</div>
						) : null}
						{communities.map((community) => (
							<article key={community.communityId} className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
								<div className="flex flex-wrap items-center justify-between gap-3">
									<div className="flex flex-wrap gap-2">
										<SchemaChip>{community.campusName || community.campusId}</SchemaChip>
										<SchemaChip>{community.memberCount || 0} members</SchemaChip>
										<SchemaChip>{community.postCount || 0} posts</SchemaChip>
									</div>
									<button disabled={!student || community.joined} onClick={() => join(community.communityId)} className="secondary-button">
										<Users className="h-4 w-4" />
										{community.joined ? 'Joined' : 'Join'}
									</button>
								</div>
								<h2 className="mt-4 text-lg font-semibold text-white">{community.name}</h2>
								<p className="mt-2 text-sm leading-6 text-slate-300">{community.description}</p>
								<button type="button" onClick={() => showMembers(community.communityId)} className="secondary-button mt-4">Show members</button>
								{members[community.communityId] ? (
									<div className="mt-4 grid gap-2 sm:grid-cols-2">
										{members[community.communityId].map((member) => (
											<div key={member.studentId} className="rounded-md border border-white/10 bg-slate-950/50 p-3 text-sm">
												<p className="font-medium text-white">{member.name}</p>
												<p className="mt-1 text-slate-400">{member.department} · Batch {member.batch}</p>
											</div>
										))}
									</div>
								) : null}
							</article>
						))}
					</div>
				</SectionPanel>
			</div>
		</PageShell>
		</ProtectedRoute>
	);
}
