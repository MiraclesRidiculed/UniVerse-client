
import type { Metadata } from 'next';
import './globals.css';
import { ReactNode } from 'react';
import Taskbar from '@/components/taskbar';
import { AuthProvider } from '@/components/auth-provider';

export const metadata: Metadata = {
	title: 'UniVerse',
	description: 'College Networking Site',
	icons: {
		icon: '/favicon.ico',
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: ReactNode;
}>) {
	return (
		<html lang="en">
			<body className="bg-slate-950 text-slate-100 antialiased">
				<AuthProvider>
					{children}
					<Taskbar />
				</AuthProvider>
			</body>
		</html>
	);
}
