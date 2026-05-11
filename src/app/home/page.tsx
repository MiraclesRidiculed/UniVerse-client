import {
	admins,
	campuses,
	communities,
	getCampus,
	getCommunity,
	getStudent,
	posts,
	resources,
	schemaTables,
	students,
} from '@/lib/schema-demo';
import { PageShell, SchemaChip, SectionPanel, StatCard } from '@/components/schema-shell';

export default function HomePage() {
	return (
		<PageShell
			eyebrow="Schema dashboard"
			title="The network now reads like the database it sits on."
			description="This dashboard makes the current SQL model visible in the interface, so teams can reason about entities, flows, and gaps before wiring the MySQL backend."
			actions={[
				{ href: '/campus', label: 'Review campuses' },
				{ href: '/resources', label: 'Open library' },
			]}
		>
			<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
				<StatCard label="campuses" value={String(campuses.length).padStart(2, '0')} hint="Top-level locations for every student, admin, and community." />
				<StatCard label="students" value={String(students.length).padStart(2, '0')} hint="Directory records currently powering the profile and search surfaces." />
				<StatCard label="admins" value={String(admins.length).padStart(2, '0')} hint="Campus operators responsible for each node in the system." />
				<StatCard label="communities" value={String(communities.length).padStart(2, '0')} hint="Groups where posts and resources start to layer on top." />
			</div>

			<div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
				<SectionPanel
					kicker="Recent activity"
					title="Latest post and resource movement"
					description="The feed below mirrors the `post` and `resource` tables, but presents them as a shared product narrative."
				>
					<div className="space-y-4">
						{posts.map((post) => {
							const author = getStudent(post.studentId);
							const community = getCommunity(post.communityId);

							return (
								<div
									key={post.postId}
									className="rounded-[1.4rem] border border-white/10 bg-white/5 p-4"
								>
									<div className="flex flex-wrap items-center gap-2">
										<SchemaChip>{post.postId}</SchemaChip>
										{community ? <SchemaChip>{community.name}</SchemaChip> : null}
										{author ? <SchemaChip>{author.department}</SchemaChip> : null}
									</div>
									<p className="mt-3 text-base leading-7 text-white">{post.content}</p>
									<p className="mt-4 text-sm text-slate-400">
										{author?.name ?? 'Unknown student'} • {post.createdAt}
									</p>
								</div>
							);
						})}
					</div>
				</SectionPanel>

				<SectionPanel
					kicker="Entity coverage"
					title="Key columns in play"
					description="The schema draft already shapes the page system, even before the MySQL API is fully wired up."
				>
					<div className="space-y-4">
						{schemaTables.map((table) => (
							<div key={table.table} className="rounded-[1.35rem] border border-white/10 bg-white/5 p-4">
								<div className="flex flex-wrap items-center justify-between gap-2">
									<h3 className="text-lg font-semibold text-white">{table.table}</h3>
									<SchemaChip>{table.columns.length} columns</SchemaChip>
								</div>
								<div className="mt-3 flex flex-wrap gap-2">
									{table.columns.map((column) => (
										<SchemaChip key={column}>{column}</SchemaChip>
									))}
								</div>
							</div>
						))}
					</div>
				</SectionPanel>
			</div>

			<div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
				<SectionPanel
					kicker="Campus loadout"
					title="Each campus acts as a parent node"
					description="Students, admins, and communities all hang from the `campus` table, so the UI makes that relationship explicit."
				>
					<div className="grid gap-4 sm:grid-cols-2">
						{campuses.map((campus) => {
							const campusStudents = students.filter((student) => student.campusId === campus.campusId);
							const campusCommunities = communities.filter((community) => community.campusId === campus.campusId);
							const campusAdmins = admins.filter((admin) => admin.campusId === campus.campusId);

							return (
								<div
									key={campus.campusId}
									className="rounded-[1.35rem] border border-white/10 bg-white/5 p-4"
								>
									<p className="surface-eyebrow">{campus.campusId}</p>
									<h3 className="mt-2 text-xl font-semibold text-white">{campus.campusName}</h3>
									<p className="mt-2 text-sm text-slate-300">{campus.location}</p>
									<div className="mt-4 grid grid-cols-3 gap-3 text-sm">
										<div className="rounded-2xl border border-white/10 bg-slate-950/50 p-3">
											<p className="text-slate-400">students</p>
											<p className="mt-1 text-lg text-white">{campusStudents.length}</p>
										</div>
										<div className="rounded-2xl border border-white/10 bg-slate-950/50 p-3">
											<p className="text-slate-400">admins</p>
											<p className="mt-1 text-lg text-white">{campusAdmins.length}</p>
										</div>
										<div className="rounded-2xl border border-white/10 bg-slate-950/50 p-3">
											<p className="text-slate-400">groups</p>
											<p className="mt-1 text-lg text-white">{campusCommunities.length}</p>
										</div>
									</div>
								</div>
							);
						})}
					</div>
				</SectionPanel>

				<SectionPanel
					kicker="Resource trail"
					title="Linked student output"
					description="Resources are shown alongside their author and community to mirror the foreign keys in the schema."
				>
					<div className="space-y-4">
						{resources.map((resource) => {
							const author = getStudent(resource.studentId);
							const community = getCommunity(resource.communityId);
							const campus = author ? getCampus(author.campusId) : undefined;

							return (
								<div
									key={resource.resourceId}
									className="rounded-[1.35rem] border border-white/10 bg-white/5 p-4"
								>
									<div className="flex flex-wrap gap-2">
										<SchemaChip>{resource.resourceId}</SchemaChip>
										{community ? <SchemaChip>{community.name}</SchemaChip> : null}
										{campus ? <SchemaChip>{campus.campusName}</SchemaChip> : null}
									</div>
									<h3 className="mt-3 text-lg font-semibold text-white">{resource.title}</h3>
									<p className="mt-2 text-sm text-slate-300">
										Published by {author?.name ?? 'Unknown student'} • {resource.createdAt}
									</p>
									<p className="mt-3 break-all text-sm text-teal-200/78">{resource.fileUrl}</p>
								</div>
							);
						})}
					</div>
				</SectionPanel>
			</div>
		</PageShell>
	);
}
