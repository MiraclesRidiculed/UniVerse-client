
import type { Metadata } from 'next';
import './globals.css';
import { ReactNode } from 'react';
import localFont from 'next/font/local';
import Taskbar from '@/components/taskbar';
import { UserProvider } from '@auth0/nextjs-auth0/client';

const mono = localFont({
	src: 'mono.woff2',
	display: 'swap',
});

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
		<UserProvider>
			<body className={mono.className + ' bg-gray-950 text-blue-400'}>
			{children}
			<Taskbar />
			</body>
		</UserProvider>
		</html>
	);
}
