'use client';

import { FormEvent, useEffect, useState } from 'react';
import { Download, FileUp } from 'lucide-react';
import { PageShell, SchemaChip, SectionPanel, StatCard } from '@/components/schema-shell';
import { useAuth } from '@/components/auth-provider';
import { LoginPrompt, ProtectedRoute } from '@/components/protected-route';
import { fileUrl, request, userMessage, type Community, type Resource } from '@/lib/api';

export default function ResourcesPage() {
	const { token, student } = useAuth();
	const [resources, setResources] = useState<Resource[]>([]);
	const [communities, setCommunities] = useState<Community[]>([]);
	const [filter, setFilter] = useState('');
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(true);

	const load = async (communityId = filter) => {
		setLoading(true);
		const [nextResources, nextCommunities] = await Promise.all([
			request<Resource[]>(`/resources${communityId ? `?communityId=${communityId}` : ''}`, { token }),
			request<Community[]>('/communities', { token }),
		]);
		setResources(nextResources);
		setCommunities(nextCommunities);
		setLoading(false);
	};

	useEffect(() => {
		if (!token) return;
		load()
			.catch((caught) => setError(userMessage(caught)))
			.finally(() => setLoading(false));
	}, [token]);

	const upload = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const body = new FormData(event.currentTarget);
		try {
			await request<Resource>('/resources', {
				method: 'POST',
				token,
				body,
			});
			event.currentTarget.reset();
			await load();
		} catch (caught: any) {
			setError(userMessage(caught));
		}
	};

	const updateFilter = async (communityId: string) => {
		try {
			setFilter(communityId);
			await load(communityId);
		} catch (caught) {
			setError(userMessage(caught));
		}
	};

	return (
		<ProtectedRoute>
		<PageShell
			eyebrow="Resources"
			title="Academic files with relational metadata."
			description="Uploads are stored locally and indexed in MySQL with title, file path, student, community, and timestamp."
			actions={[{ href: '/home', label: 'Dashboard' }, { href: '/campus', label: 'Communities' }]}
		>
			{error ? <div className="surface-panel border-red-300/20 p-4 text-sm text-red-100">{error}</div> : null}
			{loading ? <div className="surface-panel p-4 text-sm text-slate-300">Loading resources...</div> : null}
			<div className="grid gap-4 md:grid-cols-3">
				<StatCard label="visible files" value={String(resources.length)} hint="Filtered resource records." />
				<StatCard label="communities" value={String(communities.length)} hint="Available resource groups." />
				<StatCard label="uploader" value={student?.name || 'Login required'} hint="Files attach to the active student." />
			</div>

			<div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
				<SectionPanel kicker="Upload" title="Share notes or PDFs">
					{student ? (
						<form onSubmit={upload} className="space-y-4">
							<input name="title" required placeholder="Resource title" className="form-input" />
							<select name="communityId" required className="form-input">
								<option value="">Choose community</option>
								{communities.map((community) => (
									<option key={community.communityId} value={community.communityId}>{community.name}</option>
								))}
							</select>
							<input name="file" required type="file" accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.zip" className="form-input" />
							<button className="primary-button">
								<FileUp className="h-4 w-4" />
								Upload resource
							</button>
						</form>
					) : (
						<LoginPrompt message="Login to upload academic resources." />
					)}
				</SectionPanel>

				<SectionPanel kicker="Library" title="Browse resources">
					<div className="mb-4">
						<select value={filter} onChange={(event) => updateFilter(event.target.value)} className="form-input max-w-sm">
							<option value="">All communities</option>
							{communities.map((community) => (
								<option key={community.communityId} value={community.communityId}>{community.name}</option>
							))}
						</select>
					</div>
					<div className="grid gap-4">
						{!loading && resources.length === 0 ? (
							<div className="rounded-lg border border-white/10 bg-white/[0.03] p-4 text-sm text-slate-300">
								No resources match this community yet.
							</div>
						) : null}
						{resources.map((resource) => (
							<article key={resource.resourceId} className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
								<div className="flex flex-wrap gap-2">
									<SchemaChip>{resource.communityName}</SchemaChip>
									<SchemaChip>{resource.studentDepartment}</SchemaChip>
								</div>
								<h2 className="mt-4 text-lg font-semibold text-white">{resource.title}</h2>
								<p className="mt-2 text-sm text-slate-400">{resource.studentName} · {resource.createdAt}</p>
								<a href={fileUrl(resource.fileUrl)} target="_blank" rel="noreferrer" className="secondary-button mt-4">
									<Download className="h-4 w-4" />
									Open file
								</a>
							</article>
						))}
					</div>
				</SectionPanel>
			</div>
		</PageShell>
		</ProtectedRoute>
	);
}
