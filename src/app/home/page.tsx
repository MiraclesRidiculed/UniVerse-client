'use client';

import { FormEvent, useEffect, useState } from 'react';
import { Edit3, Trash2 } from 'lucide-react';
import { PageShell, SchemaChip, SectionPanel, StatCard } from '@/components/schema-shell';
import { useAuth } from '@/components/auth-provider';
import { ProtectedRoute } from '@/components/protected-route';
import { request, userMessage, type Community, type Post, type Summary } from '@/lib/api';

export default function HomePage() {
	const { student, token } = useAuth();
	const [summary, setSummary] = useState<Summary | null>(null);
	const [communities, setCommunities] = useState<Community[]>([]);
	const [posts, setPosts] = useState<Post[]>([]);
	const [editing, setEditing] = useState('');
	const [editText, setEditText] = useState('');
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(true);

	const load = async () => {
		setLoading(true);
		const [nextSummary, nextCommunities, nextPosts] = await Promise.all([
			request<Summary>('/summary', { token }),
			request<Community[]>('/communities', { token }),
			request<Post[]>('/posts', { token }),
		]);
		setSummary(nextSummary);
		setCommunities(nextCommunities);
		setPosts(nextPosts);
		setLoading(false);
	};

	useEffect(() => {
		if (!token) return;
		load()
			.catch((caught) => setError(userMessage(caught)))
			.finally(() => setLoading(false));
	}, [token]);

	const createPost = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const form = new FormData(event.currentTarget);
		try {
			await request<Post>('/posts', {
				method: 'POST',
				token,
				body: JSON.stringify({
					communityId: form.get('communityId'),
					content: form.get('content'),
				}),
			});
			event.currentTarget.reset();
			await load();
		} catch (caught: any) {
			setError(userMessage(caught));
		}
	};

	const savePost = async (postId: string) => {
		try {
			await request<Post>(`/posts/${postId}`, {
				method: 'PATCH',
				token,
				body: JSON.stringify({ content: editText }),
			});
			setEditing('');
			await load();
		} catch (caught) {
			setError(userMessage(caught));
		}
	};

	const deletePost = async (postId: string) => {
		try {
			await request(`/posts/${postId}`, { method: 'DELETE', token });
			await load();
		} catch (caught) {
			setError(userMessage(caught));
		}
	};

	return (
		<ProtectedRoute>
		<PageShell
			eyebrow="Dashboard"
			title="Campus activity, backed by MySQL records."
			description="Posts, communities, students, and resources are loaded through the Express API instead of static preview data."
			actions={[{ href: '/resources', label: 'Resources' }, { href: '/campus', label: 'Communities' }]}
		>
			{error ? <div className="surface-panel border-red-300/20 p-4 text-sm text-red-100">{error}</div> : null}
			{loading ? <div className="surface-panel p-4 text-sm text-slate-300">Loading dashboard...</div> : null}
			<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
				<StatCard label="students" value={String(summary?.counts.students ?? 0)} hint="Registered student profiles." />
				<StatCard label="communities" value={String(summary?.counts.communities ?? 0)} hint="Campus groups available to join." />
				<StatCard label="posts" value={String(summary?.counts.posts ?? 0)} hint="Discussion feed records." />
				<StatCard label="resources" value={String(summary?.counts.resources ?? 0)} hint="Uploaded academic files." />
			</div>

			<div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
				<SectionPanel kicker="Create" title="Post to a community">
					<form onSubmit={createPost} className="space-y-4">
						<select name="communityId" required className="form-input">
							<option value="">Choose community</option>
							{communities.map((community) => (
								<option key={community.communityId} value={community.communityId}>
									{community.name}
								</option>
							))}
						</select>
						<textarea name="content" required rows={6} placeholder="Share an update..." className="form-input resize-none" />
						<button disabled={!student} className="primary-button">Create post</button>
					</form>
				</SectionPanel>

				<SectionPanel kicker="Feed" title="Latest posts">
					<div className="space-y-4">
						{!loading && posts.length === 0 ? (
							<div className="rounded-lg border border-white/10 bg-white/[0.03] p-4 text-sm text-slate-300">
								No posts yet. Start the first community update.
							</div>
						) : null}
						{posts.map((post) => {
							const owned = post.studentId === student?.studentId;
							return (
								<article key={post.postId} className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
									<div className="flex flex-wrap items-center justify-between gap-3">
										<div className="flex flex-wrap gap-2">
											<SchemaChip>{post.communityName}</SchemaChip>
											<SchemaChip>{post.studentDepartment}</SchemaChip>
										</div>
										{owned ? (
											<div className="flex gap-2">
												<button type="button" onClick={() => { setEditing(post.postId); setEditText(post.content); }} className="secondary-button px-3" aria-label="Edit post">
													<Edit3 className="h-4 w-4" />
												</button>
												<button type="button" onClick={() => deletePost(post.postId)} className="secondary-button px-3" aria-label="Delete post">
													<Trash2 className="h-4 w-4" />
												</button>
											</div>
										) : null}
									</div>
									{editing === post.postId ? (
										<div className="mt-4 space-y-3">
											<textarea value={editText} onChange={(event) => setEditText(event.target.value)} rows={4} className="form-input resize-none" />
											<button type="button" onClick={() => savePost(post.postId)} className="primary-button">Save changes</button>
										</div>
									) : (
										<p className="mt-4 text-sm leading-7 text-white">{post.content}</p>
									)}
									<p className="mt-4 text-xs text-slate-400">{post.studentName} · {post.createdAt}</p>
								</article>
							);
						})}
					</div>
				</SectionPanel>
			</div>
		</PageShell>
		</ProtectedRoute>
	);
}
