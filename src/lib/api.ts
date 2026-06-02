'use client';

const API_BASE =
	process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:7000/client';
const FILE_BASE = API_BASE.replace(/\/client$/, '');

export interface Student {
	studentId: string;
	id?: string;
	campusId: string;
	name: string;
	email: string;
	department: string;
	batch: number;
	instagram: string;
	github: string;
	linkedin: string;
	handles?: {
		instagram: string;
		github: string;
		linkedin: string;
	};
	campus?: Campus | null;
	communities?: Community[];
	resources?: Resource[];
	posts?: Post[];
}

export interface Campus {
	campusId: string;
	campusName: string;
	location: string;
	students?: Student[];
	communities?: Community[];
}

export interface Community {
	communityId: string;
	campusId: string;
	name: string;
	description: string;
	campusName?: string;
	postCount?: number;
	resourceCount?: number;
	memberCount?: number;
	joined?: boolean;
}

export interface Post {
	postId: string;
	studentId: string;
	communityId: string;
	content: string;
	createdAt: string;
	studentName: string;
	studentDepartment: string;
	communityName: string;
}

export interface Resource {
	resourceId: string;
	studentId: string;
	communityId: string;
	title: string;
	fileUrl: string;
	createdAt: string;
	studentName: string;
	studentDepartment: string;
	communityName: string;
}

export interface Summary {
	counts: {
		campuses: number;
		students: number;
		admins: number;
		communities: number;
		posts: number;
		resources: number;
	};
	recentPosts: Post[];
	recentResources: Resource[];
}

export class ApiError extends Error {
	status: number;
	details?: string;

	constructor(message: string, status: number, details?: string) {
		super(message);
		this.status = status;
		this.details = details;
	}
}

function authHeaders(token?: string): HeadersInit {
	return token ? { Authorization: `Bearer ${token}` } : {};
}

export function fileUrl(path: string): string {
	if (!path) return '#';
	if (path.startsWith('http')) return path;
	return `${FILE_BASE}${path}`;
}

export async function request<T>(
	path: string,
	options: RequestInit & { token?: string } = {},
): Promise<T> {
	const headers =
		options.body instanceof FormData
			? authHeaders(options.token)
			: { 'Content-Type': 'application/json', ...authHeaders(options.token) };

	try {
		const response = await fetch(`${API_BASE}${path}`, {
			...options,
			headers: { ...headers, ...(options.headers || {}) },
		});
		const text = await response.text();
		let data: any = null;

		if (text) {
			try {
				data = JSON.parse(text);
			} catch (_error) {
				data = { error: text };
			}
		}

		if (!response.ok) {
			throw new ApiError(
				data?.error || 'Request failed',
				response.status,
				data?.details,
			);
		}

		return data as T;
	} catch (error: any) {
		if (error instanceof ApiError) throw error;
		throw new ApiError(
			'Could not reach the UniVerse API. Check that the backend server is running.',
			0,
			error?.message,
		);
	}
}

export function userMessage(error: unknown): string {
	if (error instanceof ApiError) {
		if (error.status === 401) return 'Please login to continue.';
		if (error.status === 403) return 'You do not have permission for that action.';
		if (error.status === 404) return 'The requested record was not found.';
		if (error.status === 0) return error.message;
		return error.message || 'Something went wrong. Please try again.';
	}
	return 'Something went wrong. Please try again.';
}
