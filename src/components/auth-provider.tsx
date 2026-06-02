'use client';

import {
	createContext,
	type ReactNode,
	useContext,
	useEffect,
	useMemo,
	useState,
} from 'react';
import { request, type Student } from '@/lib/api';

interface AuthContextValue {
	student: Student | null;
	token: string;
	loading: boolean;
	login: (email: string, password: string) => Promise<void>;
	signup: (payload: Record<string, string | number>) => Promise<void>;
	logout: () => void;
	refreshMe: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
	const [student, setStudent] = useState<Student | null>(null);
	const [token, setToken] = useState('');
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const savedToken = window.localStorage.getItem('universe_token') || '';
		const savedStudent = window.localStorage.getItem('universe_student');
		if (!savedToken) {
			setLoading(false);
			return;
		}

		setToken(savedToken);
		if (savedStudent) {
			try {
				setStudent(JSON.parse(savedStudent));
			} catch (_error) {
				window.localStorage.removeItem('universe_student');
			}
		}

		request<Student>('/auth/me', { token: savedToken })
			.then((nextStudent) => persist(savedToken, nextStudent))
			.catch(() => persist('', null))
			.finally(() => setLoading(false));
	}, []);

	const persist = (nextToken: string, nextStudent: Student | null) => {
		setToken(nextToken);
		setStudent(nextStudent);
		if (nextToken) window.localStorage.setItem('universe_token', nextToken);
		else window.localStorage.removeItem('universe_token');
		if (nextStudent)
			window.localStorage.setItem('universe_student', JSON.stringify(nextStudent));
		else window.localStorage.removeItem('universe_student');
	};

	const value = useMemo<AuthContextValue>(
		() => ({
			student,
			token,
			loading,
			login: async (email, password) => {
				const data = await request<{ token: string; student: Student }>(
					'/auth/login',
					{
						method: 'POST',
						body: JSON.stringify({ email, password }),
					},
				);
				persist(data.token, data.student);
			},
			signup: async (payload) => {
				const data = await request<{ token: string; student: Student }>(
					'/auth/signup',
					{
						method: 'POST',
						body: JSON.stringify(payload),
					},
				);
				persist(data.token, data.student);
			},
			logout: () => persist('', null),
			refreshMe: async () => {
				if (!token) return;
				const nextStudent = await request<Student>('/auth/me', { token });
				persist(token, nextStudent);
			},
		}),
		[loading, student, token],
	);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (!context) throw new Error('useAuth must be used inside AuthProvider');
	return context;
}
