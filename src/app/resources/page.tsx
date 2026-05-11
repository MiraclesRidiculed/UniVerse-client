import {
	communities,
	getCommunity,
	getStudent,
	posts,
	resources,
} from '@/lib/schema-demo';
import { PageShell, SchemaChip, SectionPanel, StatCard } from '@/components/schema-shell';

export default function ResourcesPage() {
	return (
		<PageShell
			eyebrow="Resources schema"
			title="Resources and posts now feel like product surfaces, not leftover tables."
			description="The resource library and discussion feed are both rendered from the current schema draft, with community and author relationships visible in the UI."
			actions={[
				{ href: '/home', label: 'Back to dashboard' },
				{ href: '/search', label: 'Search entries' },
			]}
		>
			<div className="grid gap-4 md:grid-cols-3">
				<StatCard label="resources" value={String(resources.length).padStart(2, '0')} hint="Files and references published by students." />
				<StatCard label="posts" value={String(posts.length).padStart(2, '0')} hint="Conversation layers inside communities." />
				<StatCard label="communities" value={String(communities.length).padStart(2, '0')} hint="Every resource and post points back to one of these." />
			</div>

			<div className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
				<SectionPanel
					kicker="Resource table"
					title="Published assets by student and community"
					description="This list stays close to the SQL shape while still feeling like a library view."
				>
					<div className="grid gap-4">
						{resources.map((resource) => {
							const author = getStudent(resource.studentId);
							const community = getCommunity(resource.communityId);

							return (
								<div
									key={resource.resourceId}
									className="rounded-[1.4rem] border border-white/10 bg-white/5 p-5"
								>
									<div className="flex flex-wrap gap-2">
										<SchemaChip>{resource.resourceId}</SchemaChip>
										{community ? <SchemaChip>{community.name}</SchemaChip> : null}
										{author ? <SchemaChip>{author.department}</SchemaChip> : null}
									</div>
									<h2 className="mt-4 text-xl font-semibold text-white">{resource.title}</h2>
									<p className="mt-2 text-sm text-slate-300">
										Created by {author?.name ?? 'Unknown student'} • {resource.createdAt}
									</p>
									<p className="mt-4 break-all rounded-2xl border border-white/10 bg-slate-950/45 p-3 text-sm text-teal-200/78">
										{resource.fileUrl}
									</p>
								</div>
							);
						})}
					</div>
				</SectionPanel>

				<SectionPanel
					kicker="Post layer"
					title="What the communities are talking about"
					description="Posts and resources are shown side by side so the content model is easier to visualize."
				>
					<div className="space-y-4">
						{posts.map((post) => {
							const author = getStudent(post.studentId);
							const community = getCommunity(post.communityId);

							return (
								<div
									key={post.postId}
									className="rounded-[1.35rem] border border-white/10 bg-white/5 p-4"
								>
									<div className="flex flex-wrap gap-2">
										<SchemaChip>{post.postId}</SchemaChip>
										{community ? <SchemaChip>{community.name}</SchemaChip> : null}
									</div>
									<p className="mt-3 text-sm leading-7 text-white">{post.content}</p>
									<p className="mt-3 text-xs uppercase tracking-[0.18em] text-slate-400">
										{author?.name ?? 'Unknown student'} • {post.createdAt}
									</p>
								</div>
							);
						})}
					</div>
				</SectionPanel>
			</div>
		</PageShell>
	);
}
