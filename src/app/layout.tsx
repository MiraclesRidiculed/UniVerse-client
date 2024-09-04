import type { Metadata } from "next";
import "./globals.css";
import { ReactNode } from 'react';
import { FaUser, FaRegBookmark, FaSearch, FaHome } from 'react-icons/fa';
import { FaBuildingColumns } from 'react-icons/fa6';
import Link from 'next/link';

import localFont from 'next/font/local';

const mono = localFont({
	src: 'mono.woff2',
	display: 'swap',
});

export const metadata: Metadata = {
	title: "UniVerse",
	description: "College Networking Site",
};

export default function RootLayout({
									   children,
								   }: Readonly<{
	children: ReactNode;
}>) {
	return (
		<html lang="en">
		<body className={mono.className + ' bg-gray-950 text-blue-400'}>
		{children}
		<div className="flex justify-around p-4 fixed bottom-0 w-full z-10">
			<Link
				href={'/home'}
				className="text-2xl p-3 transition-transform transform hover:scale-125"
			>
				<FaHome />
			</Link>
			<Link
				href={'/resources'}
				className="text-2xl p-3 transition-transform transform hover:scale-125"
			>
				<FaRegBookmark />
			</Link>
			<Link
				href={'/search'}
				className="text-2xl p-3 transition-transform transform hover:scale-125"
			>
				<FaSearch />
			</Link>
			<Link
				href={'/campus'}
				className="text-2xl p-3 transition-transform transform hover:scale-125"
			>
				<FaBuildingColumns />
			</Link>
			<Link
				href={'/profile'}
				className="text-2xl p-3 transition-transform transform hover:scale-125"
			>
				<FaUser />
			</Link>
		</div>
		</body>
		</html>
	);
}
