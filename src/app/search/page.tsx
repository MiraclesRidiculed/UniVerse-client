'use client';

import { useEffect, useMemo, useState } from 'react';
import { PageShell, SchemaChip, SectionPanel, StatCard } from '@/components/schema-shell';
import { useAuth } from '@/components/auth-provider';
import { request, userMessage, type Campus, type Community, type Student } from '@/lib/api';

type SearchMode = 'students' | 'communities' | 'campuses';

export default function SearchPage() {
	const { token } = useAuth();
	const [mode, setMode] = useState<SearchMode>('students');
	const [query, setQuery] = useState('');
	const [students, setStudents] = useState<Student[]>([]);
	const [communities, setCommunities] = useState<Community[]>([]);
	const [campuses, setCampuses] = useState<Campus[]>([]);
	const [error, setError] = useState('');

	useEffect(() => {
		Promise.allSettled([
			request<Student[]>('/students'),
			token ? request<Community[]>('/communities', { token }) : Promise.resolve([]),
			request<Campus[]>('/campuses'),
		]).then(([studentResult, communityResult, campusResult]) => {
			if (studentResult.status === 'fulfilled') setStudents(studentResult.value);
			if (communityResult.status === 'fulfilled') setCommunities(communityResult.value);
			if (campusResult.status === 'fulfilled') setCampuses(campusResult.value);
			const failed = [studentResult, communityResult, campusResult].find(
				(result) => result.status === 'rejected',
			);
			if (failed?.status === 'rejected') setError(userMessage(failed.reason));
		});
	}, [token]);

	const normalized = query.trim().toLowerCase();
	const filteredStudents = useMemo(
		() =>
			students.filter((student) =>
				[student.name, student.email, student.department, student.studentId]
					.join(' ')
					.toLowerCase()
					.includes(normalized),
			),
		[normalized, students],
	);
	const filteredCommunities = communities.filter((community) =>
		[community.name, community.description, community.campusName, community.communityId]
			.join(' ')
			.toLowerCase()
			.includes(normalized),
	);
	const filteredCampuses = campuses.filter((campus) =>
		[campus.campusName, campus.location, campus.campusId]
			.join(' ')
			.toLowerCase()
			.includes(normalized),
	);

	return (
		<PageShell
			eyebrow="Directory"
			title="Search students, communities, and campuses."
			description="Directory results come from REST endpoints over the relational UniVerse schema."
			actions={[{ href: '/campus', label: 'Communities' }, { href: '/profile', label: 'Profile' }]}
		>
			{error ? <div className="surface-panel border-red-300/20 p-4 text-sm text-red-100">{error}</div> : null}
			<div className="grid gap-4 md:grid-cols-3">
				<StatCard label="students" value={String(filteredStudents.length)} hint="Name, email, department, ID." />
				<StatCard label="communities" value={String(filteredCommunities.length)} hint="Name, campus, description." />
				<StatCard label="campuses" value={String(filteredCampuses.length)} hint="Campus name, ID, location." />
			</div>

			<SectionPanel kicker="Search" title="Filter records">
				<div className="flex flex-col gap-4">
					<div className="flex flex-wrap gap-2">
						{(['students', 'communities', 'campuses'] as SearchMode[]).map((nextMode) => (
							<button key={nextMode} type="button" onClick={() => setMode(nextMode)} className={mode === nextMode ? 'primary-button' : 'secondary-button'}>
								{nextMode}
							</button>
						))}
					</div>
					<input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by ID, name, department, location..." className="form-input" />
				</div>
			</SectionPanel>

			<SectionPanel kicker="Results" title={mode}>
				<div className="grid gap-4 md:grid-cols-2">
					{mode === 'students' &&
						filteredStudents.map((student) => (
							<div key={student.studentId} className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
								<div className="flex flex-wrap gap-2"><SchemaChip>{student.studentId}</SchemaChip><SchemaChip>{student.department}</SchemaChip></div>
								<h2 className="mt-3 text-lg font-semibold text-white">{student.name}</h2>
								<p className="mt-2 text-sm text-slate-300">{student.email}</p>
								<p className="mt-2 text-sm text-teal-200">Batch {student.batch}</p>
							</div>
						))}
					{mode === 'communities' &&
						filteredCommunities.map((community) => (
							<div key={community.communityId} className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
								<div className="flex flex-wrap gap-2"><SchemaChip>{community.campusName}</SchemaChip><SchemaChip>{community.memberCount || 0} members</SchemaChip></div>
								<h2 className="mt-3 text-lg font-semibold text-white">{community.name}</h2>
								<p className="mt-2 text-sm leading-6 text-slate-300">{community.description}</p>
							</div>
						))}
					{mode === 'campuses' &&
						filteredCampuses.map((campus) => (
							<div key={campus.campusId} className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
								<SchemaChip>{campus.campusId}</SchemaChip>
								<h2 className="mt-3 text-lg font-semibold text-white">{campus.campusName}</h2>
								<p className="mt-2 text-sm text-slate-300">{campus.location}</p>
							</div>
						))}
				</div>
			</SectionPanel>
		</PageShell>
	);
}
