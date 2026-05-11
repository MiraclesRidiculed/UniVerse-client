import Link from 'next/link';
import { PageShell, SchemaChip, SectionPanel, StatCard } from '@/components/schema-shell';
import {
	campuses,
	communities,
	posts,
	resources,
	schemaTables,
	students,
} from '@/lib/schema-demo';

export default function Home() {
	return (
		<PageShell
			eyebrow="UniVerse schema preview"
			title="A front end shaped directly around the current relational model."
			description="This landing layer mirrors the SQL draft already living in the repo, so design, client flows, and the backend migration can move in the same direction."
			actions={[
				{ href: '/home', label: 'Open dashboard' },
				{ href: '/api/auth/login', label: 'Sign in with Auth0' },
			]}
		>
			<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
				<StatCard label="campus" value={String(campuses.length).padStart(2, '0')} hint="Physical nodes anchored by `campus_id`." />
				<StatCard label="student" value={String(students.length).padStart(2, '0')} hint="Profiles connected through `campus_id`." />
				<StatCard label="community" value={String(communities.length).padStart(2, '0')} hint="Discussion spaces for each campus." />
				<StatCard label="resource + post" value={String(resources.length + posts.length).padStart(2, '0')} hint="Content surfaces ready for richer endpoints." />
			</div>

			<div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
				<SectionPanel
					kicker="Available entities"
					title="The app shell now maps to the schema instead of placeholders."
					description="Each major route now lines up with the tables already defined in `universe_mysql_schema.sql`, including the relationships between students, communities, resources, and posts."
				>
					<div className="grid gap-4">
						{schemaTables.map((table) => (
							<div key={table.table} className="rounded-[1.4rem] border border-white/10 bg-white/5 p-4">
								<div className="flex flex-wrap items-center justify-between gap-3">
									<h2 className="text-lg font-semibold text-white">{table.table}</h2>
									<div className="flex flex-wrap gap-2">
										{table.columns.slice(0, 4).map((column) => (
											<SchemaChip key={column}>{column}</SchemaChip>
										))}
									</div>
								</div>
								<p className="mt-3 text-sm leading-6 text-slate-300">{table.description}</p>
							</div>
						))}
					</div>
				</SectionPanel>

				<SectionPanel
					kicker="Routing"
					title="Where each route fits"
					description="The UI is now laid out like a schema-aware product surface instead of disconnected placeholders."
				>
					<div className="space-y-3">
						{[
							{ href: '/home', label: 'Home', copy: 'Overview cards, recent post activity, and table-level coverage.' },
							{ href: '/campus', label: 'Campus', copy: 'Campus records, admins, student counts, and community distribution.' },
							{ href: '/resources', label: 'Resources', copy: 'Resource library plus the latest post layer around each community.' },
							{ href: '/search', label: 'Search', copy: 'Filter students, communities, and campuses using the shared schema data.' },
							{ href: '/profile', label: 'Profile', copy: 'Student-level view aligned with the `student` table fields.' },
						].map((route) => (
							<Link
								key={route.href}
								href={route.href}
								className="block rounded-[1.25rem] border border-white/10 bg-white/5 p-4 transition hover:border-teal-300/30 hover:bg-teal-300/5"
							>
								<p className="text-sm uppercase tracking-[0.2em] text-teal-200/72">{route.label}</p>
								<p className="mt-2 text-sm leading-6 text-slate-300">{route.copy}</p>
							</Link>
						))}
					</div>
					<div className="mt-6 rounded-[1.25rem] border border-amber-300/15 bg-amber-300/10 p-4 text-sm leading-6 text-amber-100/90">
						<p className="font-medium text-white">Current assumption</p>
						<p className="mt-2">
							These screens use a shared schema-shaped dataset for now, because the client has moved ahead of the backend migration from MongoDB to MySQL.
						</p>
					</div>
				</SectionPanel>
			</div>
		</PageShell>
	);
}
