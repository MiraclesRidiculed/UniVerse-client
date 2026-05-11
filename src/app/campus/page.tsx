import {
	adminsForCampus,
	campuses,
	communitiesForCampus,
	studentsForCampus,
} from '@/lib/schema-demo';
import { PageShell, SchemaChip, SectionPanel, StatCard } from '@/components/schema-shell';

export default function CampusPage() {
	return (
		<PageShell
			eyebrow="Campus schema"
			title="Campus nodes, operators, and membership in one place."
			description="This route turns the parent-child relationships in the SQL draft into clear UI sections: each campus owns students, admins, and communities."
			actions={[
				{ href: '/search', label: 'Search records' },
				{ href: '/profile', label: 'Student view' },
			]}
		>
			<div className="grid gap-4 md:grid-cols-3">
				<StatCard label="campus records" value={String(campuses.length).padStart(2, '0')} hint="The three campus records currently anchor the sample network." />
				<StatCard label="admins" value={String(campuses.reduce((total, campus) => total + adminsForCampus(campus.campusId).length, 0)).padStart(2, '0')} hint="Each campus has a dedicated operator in the current UI pass." />
				<StatCard label="students" value={String(campuses.reduce((total, campus) => total + studentsForCampus(campus.campusId).length, 0)).padStart(2, '0')} hint="Student counts surface the same `campus_id` grouping used in SQL." />
			</div>

			<SectionPanel
				kicker="Campus cards"
				title="Parent entities from the `campus` table"
				description="Each card shows the direct descendants that would be retrieved through foreign-key joins once the MySQL backend is in place."
			>
				<div className="grid gap-5 lg:grid-cols-3">
					{campuses.map((campus) => {
						const campusAdmins = adminsForCampus(campus.campusId);
						const campusStudents = studentsForCampus(campus.campusId);
						const campusCommunities = communitiesForCampus(campus.campusId);

						return (
							<div
								key={campus.campusId}
								className="rounded-[1.45rem] border border-white/10 bg-white/5 p-5"
							>
								<div className="flex flex-wrap gap-2">
									<SchemaChip>{campus.campusId}</SchemaChip>
									<SchemaChip>{campus.location}</SchemaChip>
								</div>
								<h2 className="mt-4 text-2xl font-semibold text-white">{campus.campusName}</h2>
								<div className="mt-5 grid grid-cols-3 gap-3">
									<div className="rounded-2xl border border-white/10 bg-slate-950/50 p-3">
										<p className="text-xs uppercase tracking-[0.2em] text-slate-400">admins</p>
										<p className="mt-2 text-xl text-white">{campusAdmins.length}</p>
									</div>
									<div className="rounded-2xl border border-white/10 bg-slate-950/50 p-3">
										<p className="text-xs uppercase tracking-[0.2em] text-slate-400">students</p>
										<p className="mt-2 text-xl text-white">{campusStudents.length}</p>
									</div>
									<div className="rounded-2xl border border-white/10 bg-slate-950/50 p-3">
										<p className="text-xs uppercase tracking-[0.2em] text-slate-400">groups</p>
										<p className="mt-2 text-xl text-white">{campusCommunities.length}</p>
									</div>
								</div>
								<div className="mt-5 space-y-3">
									<div>
										<p className="text-sm uppercase tracking-[0.2em] text-teal-200/72">Admin roster</p>
										<div className="mt-2 flex flex-wrap gap-2">
											{campusAdmins.map((admin) => (
												<SchemaChip key={admin.adminId}>{admin.name}</SchemaChip>
											))}
										</div>
									</div>
									<div>
										<p className="text-sm uppercase tracking-[0.2em] text-teal-200/72">Communities</p>
										<div className="mt-2 flex flex-wrap gap-2">
											{campusCommunities.map((community) => (
												<SchemaChip key={community.communityId}>{community.name}</SchemaChip>
											))}
										</div>
									</div>
								</div>
							</div>
						);
					})}
				</div>
			</SectionPanel>

			<div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
				<SectionPanel
					kicker="Admins"
					title="Campus operators"
					description="The `admin` table is small, but it deserves a clearer presentation than a hidden backend record."
				>
					<div className="space-y-3">
						{campuses.map((campus) =>
							adminsForCampus(campus.campusId).map((admin) => (
								<div
									key={admin.adminId}
									className="rounded-[1.25rem] border border-white/10 bg-white/5 p-4"
								>
									<div className="flex flex-wrap items-center justify-between gap-2">
										<h3 className="text-lg font-semibold text-white">{admin.name}</h3>
										<SchemaChip>{admin.adminId}</SchemaChip>
									</div>
									<p className="mt-2 text-sm text-slate-300">{admin.email}</p>
									<p className="mt-2 text-sm text-teal-200/72">{campus.campusName}</p>
								</div>
							)),
						)}
					</div>
				</SectionPanel>

				<SectionPanel
					kicker="Student mix"
					title="Who belongs to each campus"
					description="This section keeps `student.campus_id` visible so the frontend stays aligned with the schema."
				>
					<div className="space-y-4">
						{campuses.map((campus) => (
							<div
								key={campus.campusId}
								className="rounded-[1.3rem] border border-white/10 bg-white/5 p-4"
							>
								<div className="flex flex-wrap items-center justify-between gap-3">
									<h3 className="text-lg font-semibold text-white">{campus.campusName}</h3>
									<SchemaChip>{campus.campusId}</SchemaChip>
								</div>
								<div className="mt-4 grid gap-3 sm:grid-cols-2">
									{studentsForCampus(campus.campusId).map((student) => (
										<div
											key={student.studentId}
											className="rounded-2xl border border-white/10 bg-slate-950/45 p-3"
										>
											<p className="text-base font-semibold text-white">{student.name}</p>
											<p className="mt-1 text-sm text-slate-300">{student.department}</p>
											<p className="mt-2 text-xs uppercase tracking-[0.18em] text-slate-400">
												{student.studentId} • Batch {student.batch}
											</p>
										</div>
									))}
								</div>
							</div>
						))}
					</div>
				</SectionPanel>
			</div>
		</PageShell>
	);
}
