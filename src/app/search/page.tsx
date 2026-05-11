'use client';

import { useState } from 'react';
import { PageShell, SchemaChip, SectionPanel, StatCard } from '@/components/schema-shell';
import {
	campuses,
	communities,
	getCampus,
	students,
} from '@/lib/schema-demo';

type SearchMode = 'students' | 'communities' | 'campuses';

export default function SearchPage() {
	const [mode, setMode] = useState<SearchMode>('students');
	const [query, setQuery] = useState('');

	const normalizedQuery = query.trim().toLowerCase();
	const studentResults = students.filter((student) => {
		if (!normalizedQuery) return true;
		return (
			student.name.toLowerCase().includes(normalizedQuery) ||
			student.email.toLowerCase().includes(normalizedQuery) ||
			student.department.toLowerCase().includes(normalizedQuery) ||
			student.studentId.toLowerCase().includes(normalizedQuery)
		);
	});
	const communityResults = communities.filter((community) => {
		const campus = getCampus(community.campusId);
		if (!normalizedQuery) return true;
		return (
			community.name.toLowerCase().includes(normalizedQuery) ||
			community.description.toLowerCase().includes(normalizedQuery) ||
			community.communityId.toLowerCase().includes(normalizedQuery) ||
			(campus?.campusName.toLowerCase().includes(normalizedQuery) ?? false)
		);
	});
	const campusResults = campuses.filter((campus) => {
		if (!normalizedQuery) return true;
		return (
			campus.campusId.toLowerCase().includes(normalizedQuery) ||
			campus.campusName.toLowerCase().includes(normalizedQuery) ||
			campus.location.toLowerCase().includes(normalizedQuery)
		);
	});

	return (
		<PageShell
			eyebrow="Search schema"
			title="Filter the same entities your SQL model already defines."
			description="This route turns schema exploration into a usable directory: students, communities, and campuses can all be searched from one surface."
			actions={[
				{ href: '/campus', label: 'See campus map' },
				{ href: '/profile', label: 'Open profile' },
			]}
		>
			<div className="grid gap-4 md:grid-cols-3">
				<StatCard label="student search" value={String(studentResults.length).padStart(2, '0')} hint="Matches across name, email, department, and `student_id`." />
				<StatCard label="community search" value={String(communityResults.length).padStart(2, '0')} hint="Matches across community name, description, and campus." />
				<StatCard label="campus search" value={String(campusResults.length).padStart(2, '0')} hint="Matches across campus name, ID, and location." />
			</div>

			<SectionPanel
				kicker="Directory"
				title="Search across schema-backed records"
				description="Switch the mode to focus on one entity family at a time."
			>
				<div className="flex flex-col gap-4">
					<div className="flex flex-wrap gap-2">
						{(['students', 'communities', 'campuses'] as SearchMode[]).map((nextMode) => (
							<button
								key={nextMode}
								type="button"
								onClick={() => setMode(nextMode)}
								className={`rounded-full px-4 py-2 text-sm uppercase tracking-[0.18em] transition ${
									mode === nextMode
										? 'border border-teal-300/30 bg-teal-300/15 text-teal-100'
										: 'border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'
								}`}
							>
								{nextMode}
							</button>
						))}
					</div>

					<input
						type="text"
						value={query}
						onChange={(event) => setQuery(event.target.value)}
						placeholder="Search by id, name, location, department, or community..."
						className="rounded-[1.2rem] border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-teal-300/45"
					/>
				</div>
			</SectionPanel>

			{mode === 'students' ? (
				<SectionPanel
					kicker="Results"
					title="Students"
					description="Student cards expose the exact fields you will eventually fetch from the MySQL-backed API."
				>
					<div className="grid gap-4 md:grid-cols-2">
						{studentResults.map((student) => {
							const campus = getCampus(student.campusId);
							return (
								<div
									key={student.studentId}
									className="rounded-[1.35rem] border border-white/10 bg-white/5 p-4"
								>
									<div className="flex flex-wrap gap-2">
										<SchemaChip>{student.studentId}</SchemaChip>
										<SchemaChip>{student.department}</SchemaChip>
									</div>
									<h2 className="mt-3 text-xl font-semibold text-white">{student.name}</h2>
									<p className="mt-2 text-sm text-slate-300">{student.email}</p>
									<p className="mt-2 text-sm text-teal-200/72">
										{campus?.campusName ?? student.campusId} • Batch {student.batch}
									</p>
								</div>
							);
						})}
					</div>
				</SectionPanel>
			) : null}

			{mode === 'communities' ? (
				<SectionPanel
					kicker="Results"
					title="Communities"
					description="These cards mirror the `community` table and keep `campus_id` visible in the UI."
				>
					<div className="grid gap-4 md:grid-cols-2">
						{communityResults.map((community) => {
							const campus = getCampus(community.campusId);
							return (
								<div
									key={community.communityId}
									className="rounded-[1.35rem] border border-white/10 bg-white/5 p-4"
								>
									<div className="flex flex-wrap gap-2">
										<SchemaChip>{community.communityId}</SchemaChip>
										{campus ? <SchemaChip>{campus.campusName}</SchemaChip> : null}
									</div>
									<h2 className="mt-3 text-xl font-semibold text-white">{community.name}</h2>
									<p className="mt-3 text-sm leading-6 text-slate-300">{community.description}</p>
								</div>
							);
						})}
					</div>
				</SectionPanel>
			) : null}

			{mode === 'campuses' ? (
				<SectionPanel
					kicker="Results"
					title="Campuses"
					description="Campus results keep the top-level records legible before the joined API responses exist."
				>
					<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
						{campusResults.map((campus) => (
							<div
								key={campus.campusId}
								className="rounded-[1.35rem] border border-white/10 bg-white/5 p-4"
							>
								<div className="flex flex-wrap gap-2">
									<SchemaChip>{campus.campusId}</SchemaChip>
								</div>
								<h2 className="mt-3 text-xl font-semibold text-white">{campus.campusName}</h2>
								<p className="mt-2 text-sm text-slate-300">{campus.location}</p>
							</div>
						))}
					</div>
				</SectionPanel>
			) : null}
		</PageShell>
	);
}
