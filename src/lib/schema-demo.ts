export interface CampusRecord {
	campusId: string;
	campusName: string;
	location: string;
}

export interface StudentRecord {
	studentId: string;
	campusId: string;
	name: string;
	email: string;
	department: string;
	batch: number;
	instagram: string;
	github: string;
	linkedin: string;
}

export interface AdminRecord {
	adminId: string;
	campusId: string;
	name: string;
	email: string;
}

export interface CommunityRecord {
	communityId: string;
	campusId: string;
	name: string;
	description: string;
}

export interface PostRecord {
	postId: string;
	studentId: string;
	communityId: string;
	content: string;
	createdAt: string;
}

export interface ResourceRecord {
	resourceId: string;
	studentId: string;
	communityId: string;
	title: string;
	fileUrl: string;
	createdAt: string;
}

export interface TableDefinition {
	table: string;
	description: string;
	columns: string[];
}

export const campuses: CampusRecord[] = [
	{
		campusId: 'camp_north',
		campusName: 'North Campus',
		location: 'Bhubaneswar, Odisha',
	},
	{
		campusId: 'camp_design',
		campusName: 'Design Annex',
		location: 'Cuttack, Odisha',
	},
	{
		campusId: 'camp_research',
		campusName: 'Research Yard',
		location: 'Rourkela, Odisha',
	},
];

export const students: StudentRecord[] = [
	{
		studentId: 'stu_001',
		campusId: 'camp_north',
		name: 'Aarav Sen',
		email: 'aarav@universe.edu',
		department: 'Computer Science',
		batch: 2026,
		instagram: 'https://instagram.com/aarav.codes',
		github: 'https://github.com/aaravsen',
		linkedin: 'https://linkedin.com/in/aaravsen',
	},
	{
		studentId: 'stu_002',
		campusId: 'camp_north',
		name: 'Mira Dutta',
		email: 'mira@universe.edu',
		department: 'Electronics',
		batch: 2025,
		instagram: 'https://instagram.com/mira.builds',
		github: 'https://github.com/miradutta',
		linkedin: 'https://linkedin.com/in/miradutta',
	},
	{
		studentId: 'stu_003',
		campusId: 'camp_design',
		name: 'Kabir Ray',
		email: 'kabir@universe.edu',
		department: 'Design',
		batch: 2027,
		instagram: 'https://instagram.com/kabirframes',
		github: 'https://github.com/kabirray',
		linkedin: 'https://linkedin.com/in/kabirray',
	},
	{
		studentId: 'stu_004',
		campusId: 'camp_research',
		name: 'Tara Bose',
		email: 'tara@universe.edu',
		department: 'Data Science',
		batch: 2026,
		instagram: 'https://instagram.com/tarabose.ai',
		github: 'https://github.com/tarabose',
		linkedin: 'https://linkedin.com/in/tarabose',
	},
	{
		studentId: 'stu_005',
		campusId: 'camp_design',
		name: 'Ishaan Malik',
		email: 'ishaan@universe.edu',
		department: 'Product',
		batch: 2025,
		instagram: 'https://instagram.com/ishaan.makes',
		github: 'https://github.com/ishaanmalik',
		linkedin: 'https://linkedin.com/in/ishaanmalik',
	},
];

export const admins: AdminRecord[] = [
	{
		adminId: 'adm_001',
		campusId: 'camp_north',
		name: 'Rhea Kapoor',
		email: 'rhea.kapoor@universe.edu',
	},
	{
		adminId: 'adm_002',
		campusId: 'camp_design',
		name: 'Neel Banerjee',
		email: 'neel.banerjee@universe.edu',
	},
	{
		adminId: 'adm_003',
		campusId: 'camp_research',
		name: 'Vani Sharma',
		email: 'vani.sharma@universe.edu',
	},
];

export const communities: CommunityRecord[] = [
	{
		communityId: 'com_001',
		campusId: 'camp_north',
		name: 'Systems Guild',
		description: 'Backend builds, distributed systems labs, and infra review nights.',
	},
	{
		communityId: 'com_002',
		campusId: 'camp_design',
		name: 'Visual Lab',
		description: 'Product narratives, interface critiques, and brand experiments.',
	},
	{
		communityId: 'com_003',
		campusId: 'camp_research',
		name: 'Data Commons',
		description: 'Research notes, experiments, and model benchmarking sessions.',
	},
	{
		communityId: 'com_004',
		campusId: 'camp_north',
		name: 'Launch Circle',
		description: 'Student startup operators sharing playbooks, decks, and feedback.',
	},
];

export const posts: PostRecord[] = [
	{
		postId: 'post_001',
		studentId: 'stu_001',
		communityId: 'com_001',
		content: 'Pushed a cleaner auth flow for our campus tooling. Need feedback on the retry states before demo day.',
		createdAt: '2026-05-08 18:30:00',
	},
	{
		postId: 'post_002',
		studentId: 'stu_003',
		communityId: 'com_002',
		content: 'Shared three moodboards for the new resource library. The orange-teal route is winning so far.',
		createdAt: '2026-05-09 10:15:00',
	},
	{
		postId: 'post_003',
		studentId: 'stu_004',
		communityId: 'com_003',
		content: 'Benchmark notebook is ready. Added dataset notes and a cleaner eval summary for the weekly review.',
		createdAt: '2026-05-10 08:50:00',
	},
	{
		postId: 'post_004',
		studentId: 'stu_005',
		communityId: 'com_004',
		content: 'Uploaded a lightweight pitch skeleton for first-time founders. Happy to pair on edits.',
		createdAt: '2026-05-10 20:05:00',
	},
];

export const resources: ResourceRecord[] = [
	{
		resourceId: 'res_001',
		studentId: 'stu_001',
		communityId: 'com_001',
		title: 'Node service boot checklist',
		fileUrl: 'https://example.com/resources/node-service-boot-checklist.pdf',
		createdAt: '2026-05-07 14:20:00',
	},
	{
		resourceId: 'res_002',
		studentId: 'stu_003',
		communityId: 'com_002',
		title: 'Interface toneboard starter pack',
		fileUrl: 'https://example.com/resources/interface-toneboard.zip',
		createdAt: '2026-05-08 11:00:00',
	},
	{
		resourceId: 'res_003',
		studentId: 'stu_004',
		communityId: 'com_003',
		title: 'Model evaluation worksheet',
		fileUrl: 'https://example.com/resources/model-eval-worksheet.xlsx',
		createdAt: '2026-05-09 16:45:00',
	},
	{
		resourceId: 'res_004',
		studentId: 'stu_005',
		communityId: 'com_004',
		title: 'Pitch review scorecard',
		fileUrl: 'https://example.com/resources/pitch-review-scorecard.docx',
		createdAt: '2026-05-10 12:10:00',
	},
];

export const schemaTables: TableDefinition[] = [
	{
		table: 'campus',
		description: 'Parent entity for each physical location in the network.',
		columns: ['campus_id', 'campus_name', 'location'],
	},
	{
		table: 'student',
		description: 'Student directory records with campus membership and social handles.',
		columns: ['student_id', 'campus_id', 'name', 'email', 'department', 'batch', 'instagram', 'github', 'linkedin'],
	},
	{
		table: 'admin',
		description: 'Campus-level operators who moderate and manage each node.',
		columns: ['admin_id', 'campus_id', 'name', 'email'],
	},
	{
		table: 'community',
		description: 'Interest groups anchored to campuses.',
		columns: ['community_id', 'campus_id', 'name', 'description'],
	},
	{
		table: 'post',
		description: 'Conversation layer connecting students to communities over time.',
		columns: ['post_id', 'student_id', 'community_id', 'content', 'created_at'],
	},
	{
		table: 'resource',
		description: 'Files and references published by students inside communities.',
		columns: ['resource_id', 'student_id', 'community_id', 'title', 'file_url', 'created_at'],
	},
];

export function getCampus(campusId: string): CampusRecord | undefined {
	return campuses.find((campus) => campus.campusId === campusId);
}

export function getStudent(studentId: string): StudentRecord | undefined {
	return students.find((student) => student.studentId === studentId);
}

export function getCommunity(communityId: string): CommunityRecord | undefined {
	return communities.find((community) => community.communityId === communityId);
}

export function studentsForCampus(campusId: string): StudentRecord[] {
	return students.filter((student) => student.campusId === campusId);
}

export function adminsForCampus(campusId: string): AdminRecord[] {
	return admins.filter((admin) => admin.campusId === campusId);
}

export function communitiesForCampus(campusId: string): CommunityRecord[] {
	return communities.filter((community) => community.campusId === campusId);
}

export function resourcesForStudent(studentId: string): ResourceRecord[] {
	return resources.filter((resource) => resource.studentId === studentId);
}
