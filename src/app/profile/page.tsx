'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
	communities,
	getCampus,
	posts,
	resourcesForStudent,
	StudentRecord,
	students,
} from '@/lib/schema-demo';
import { PageShell, SchemaChip, SectionPanel, StatCard } from '@/components/schema-shell';

interface DraftHandles {
	instagram: string;
	github: string;
	linkedin: string;
}

export default function ProfilePage() {
	const { user, isLoading } = useUser();
	const [profileStudent, setProfileStudent] = useState<StudentRecord | null>(null);
	const [editMode, setEditMode] = useState(false);
	const [draftHandles, setDraftHandles] = useState<DraftHandles>({
		instagram: '',
		github: '',
		linkedin: '',
	});

	useEffect(() => {
		if (isLoading) return;

		const matchedStudent =
			students.find((student) => student.email.toLowerCase() === user?.email?.toLowerCase()) ??
			students[0];

		setProfileStudent(matchedStudent);
		setDraftHandles({
			instagram: matchedStudent.instagram,
			github: matchedStudent.github,
			linkedin: matchedStudent.linkedin,
		});
	}, [isLoading, user?.email]);

	if (!profileStudent) {
		return (
			<PageShell
				eyebrow="Profile schema"
				title="Preparing student profile surface"
				description="Loading the schema-shaped student preview."
			>
				<div className="surface-panel p-6 text-sm text-slate-300">Loading profile preview...</div>
			</PageShell>
		);
	}

	const campus = getCampus(profileStudent.campusId);
	const joinedCommunities = communities.filter(
		(community) => community.campusId === profileStudent.campusId,
	);
	const studentResources = resourcesForStudent(profileStudent.studentId);
	const studentPosts = posts.filter((post) => post.studentId === profileStudent.studentId);
	const previewMode = !user || user.email?.toLowerCase() !== profileStudent.email.toLowerCase();

	const savePreviewHandles = () => {
		setProfileStudent({
			...profileStudent,
			instagram: draftHandles.instagram,
			github: draftHandles.github,
			linkedin: draftHandles.linkedin,
		});
		setEditMode(false);
	};

	return (
		<PageShell
			eyebrow="Student schema"
			title="Profile UI now aligns with the `student` table."
			description="The profile surface uses the same fields the MySQL schema expects: student ID, campus ID, department, batch, and direct social links."
			actions={[
				{ href: '/search', label: 'Find more students' },
				{ href: '/resources', label: 'Open resources' },
			]}
		>
			{previewMode ? (
				<div className="surface-panel border border-amber-300/20 bg-amber-300/10 p-4 text-sm leading-6 text-amber-100/90">
					Preview mode is active. This page is showing a schema-matched sample student until a signed-in user maps directly to a backend record.
				</div>
			) : null}

			<div className="grid gap-4 md:grid-cols-3">
				<StatCard label="student id" value={profileStudent.studentId} hint="Primary key from the `student` table." />
				<StatCard label="campus id" value={profileStudent.campusId} hint="Foreign key back to the `campus` table." />
				<StatCard label="activity" value={String(studentResources.length + studentPosts.length).padStart(2, '0')} hint="Combined resources and posts authored by this student." />
			</div>

			<div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
				<SectionPanel
					kicker="Identity"
					title="Primary student record"
					description="This top card makes the important schema fields easy to scan."
				>
					<div className="flex flex-col gap-5 lg:flex-row lg:items-center">
						<Avatar className="h-24 w-24 border border-white/10 bg-teal-300/10">
							<AvatarFallback className="bg-transparent text-3xl font-semibold text-teal-100">
								{profileStudent.name
									.split(' ')
									.map((part) => part[0])
									.join('')
									.slice(0, 2)}
							</AvatarFallback>
						</Avatar>
						<div className="space-y-2">
							<h2 className="text-3xl font-semibold text-white">{profileStudent.name}</h2>
							<p className="text-sm text-slate-300">{profileStudent.email}</p>
							<div className="flex flex-wrap gap-2">
								<SchemaChip>{profileStudent.department}</SchemaChip>
								<SchemaChip>Batch {profileStudent.batch}</SchemaChip>
								{campus ? <SchemaChip>{campus.campusName}</SchemaChip> : null}
							</div>
						</div>
					</div>
				</SectionPanel>

				<SectionPanel
					kicker="Connected fields"
					title="Social handles from the current schema"
					description="These are kept local for now because the UI has moved ahead of the MySQL API work."
				>
					<div className="flex items-center justify-between gap-3">
						<p className="text-sm text-slate-300">Edit the schema-backed social columns in place.</p>
						<button
							type="button"
							onClick={() => setEditMode((current) => !current)}
							className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white transition hover:border-teal-300/30 hover:bg-teal-300/10"
						>
							{editMode ? 'Cancel' : 'Edit links'}
						</button>
					</div>
					<div className="mt-5 space-y-4">
						{(['instagram', 'github', 'linkedin'] as Array<keyof DraftHandles>).map((platform) => (
							<div key={platform} className="rounded-[1.15rem] border border-white/10 bg-white/5 p-4">
								<p className="text-xs uppercase tracking-[0.18em] text-slate-400">{platform}</p>
								{editMode ? (
									<input
										type="text"
										value={draftHandles[platform]}
										onChange={(event) =>
											setDraftHandles({
												...draftHandles,
												[platform]: event.target.value,
											})
										}
										className="mt-3 w-full rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-white outline-none placeholder:text-slate-500 focus:border-teal-300/45"
									/>
								) : (
									<p className="mt-3 break-all text-sm text-teal-200/78">
										{profileStudent[platform]}
									</p>
								)}
							</div>
						))}
						{editMode ? (
							<button
								type="button"
								onClick={savePreviewHandles}
								className="rounded-full bg-teal-300 px-4 py-2 text-sm font-medium text-slate-950 transition hover:bg-teal-200"
							>
								Save local preview
							</button>
						) : null}
					</div>
				</SectionPanel>
			</div>

			<div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
				<SectionPanel
					kicker="Community footprint"
					title="Communities connected through campus membership"
					description="The current schema does not define a student-community join table yet, so this view uses campus alignment as the bridge."
				>
					<div className="grid gap-4">
						{joinedCommunities.map((community) => (
							<div
								key={community.communityId}
								className="rounded-[1.25rem] border border-white/10 bg-white/5 p-4"
							>
								<div className="flex flex-wrap gap-2">
									<SchemaChip>{community.communityId}</SchemaChip>
									<SchemaChip>{profileStudent.campusId}</SchemaChip>
								</div>
								<h3 className="mt-3 text-lg font-semibold text-white">{community.name}</h3>
								<p className="mt-2 text-sm leading-6 text-slate-300">{community.description}</p>
							</div>
						))}
					</div>
				</SectionPanel>

				<SectionPanel
					kicker="Output"
					title="Resources and posts authored by this student"
					description="These cards tie the profile back to the `resource` and `post` tables."
				>
					<div className="space-y-4">
						{studentResources.map((resource) => (
							<div
								key={resource.resourceId}
								className="rounded-[1.25rem] border border-white/10 bg-white/5 p-4"
							>
								<div className="flex flex-wrap gap-2">
									<SchemaChip>{resource.resourceId}</SchemaChip>
									<SchemaChip>{resource.communityId}</SchemaChip>
								</div>
								<h3 className="mt-3 text-lg font-semibold text-white">{resource.title}</h3>
								<p className="mt-2 text-sm text-slate-300">{resource.createdAt}</p>
							</div>
						))}
						{studentPosts.map((post) => (
							<div
								key={post.postId}
								className="rounded-[1.25rem] border border-white/10 bg-white/5 p-4"
							>
								<div className="flex flex-wrap gap-2">
									<SchemaChip>{post.postId}</SchemaChip>
									<SchemaChip>{post.communityId}</SchemaChip>
								</div>
								<p className="mt-3 text-sm leading-7 text-white">{post.content}</p>
								<p className="mt-3 text-xs uppercase tracking-[0.18em] text-slate-400">
									{post.createdAt}
								</p>
							</div>
						))}
					</div>
				</SectionPanel>
			</div>
		</PageShell>
	);
}
