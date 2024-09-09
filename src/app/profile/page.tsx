'use client';
import React, { useEffect, useState } from 'react';
import { FaGithub, FaLinkedin, FaInstagram, FaFacebook } from 'react-icons/fa';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Handles {
	instagram: string;
	github: string;
	facebook: string;
	linkedin: string;
}

interface User {
	pfp: string; // Changed from png to string assuming URL or path
	id: string;
	name: string;
	email: string;
	department: string;
	batch: number;
	handles: Handles;
}

const ProfilePage: React.FC = () => {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchUserData = async () => {
			try {
				const res = await fetch(
					'http://localhost:5000/client/students/nigga123',
				);
				if (!res.ok) {
					throw new Error('Network response was not ok');
				}
				const data: User = await res.json();
				setUser(data);
			} catch (error: any) {
				setError(error.message || 'Failed to fetch user data');
			} finally {
				setLoading(false);
			}
		};

		fetchUserData();
	}, []);

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="bg-gray-900 shadow-md rounded-lg p-6">
				<div className="flex items-center space-x-4">
					{}
					<Avatar className="w-24 h-24">
						{user?.pfp ?
							<AvatarImage src={user.pfp} alt={user.name} />
						:	<AvatarFallback className="bg-gray-200 flex items-center justify-center text-4xl font-bold text-gray-500">
								{user?.name ? user.name[0] : 'N/A'}
							</AvatarFallback>
						}
					</Avatar>
					{}
					<div>
						<h1 className="text-3xl font-semibold text">
							{user?.name || 'User Name'}
						</h1>
						<p className="text-white">
							{user?.email || 'user@example.com'}
						</p>
						<p className="text-white">
							Department: {user?.department || 'N/A'}
						</p>
						<p className="text-white">
							Batch: {user?.batch || 'N/A'}
						</p>
					</div>
				</div>
				{}
				<div className="mt-6 border-t border-gray-200 pt-6">
					<h2 className="text-2xl font-semibold text">Connections</h2>
					<div className="mt-4 flex flex-col space-y-4">
						<a
							href={
								user?.handles.github ||
								'https://github.com/example'
							}
							target="_blank"
							rel="noopener noreferrer"
							className="flex items-center space-x-2 text-gray-300 hover:text-blue-500"
						>
							<FaGithub className="w-6 h-6" />
							<span>GitHub</span>
						</a>
						<a
							href={
								user?.handles.linkedin ||
								'https://linkedin.com/in/example'
							}
							target="_blank"
							rel="noopener noreferrer"
							className="flex items-center space-x-2 text-gray-300 hover:text-blue-600"
						>
							<FaLinkedin className="w-6 h-6" />
							<span>LinkedIn</span>
						</a>
						<a
							href={
								user?.handles.instagram ||
								'https://instagram.com/example'
							}
							target="_blank"
							rel="noopener noreferrer"
							className="flex items-center space-x-2 text-gray-300 hover:text-pink-500"
						>
							<FaInstagram className="w-6 h-6" />
							<span>Instagram</span>
						</a>
						<a
							href={
								user?.handles.facebook ||
								'https://facebook.com/example'
							}
							target="_blank"
							rel="noopener noreferrer"
							className="flex items-center space-x-2 text-gray-300 hover:text-blue-800"
						>
							<FaFacebook className="w-6 h-6" />
							<span>Facebook</span>
						</a>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProfilePage;
