'use client';
import React, { useEffect, useState } from 'react';
import { FaGithub, FaLinkedin, FaInstagram, FaFacebook } from 'react-icons/fa';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';

interface Handles {
	instagram: string;
	github: string;
	facebook: string;
	linkedin: string;
}

interface User {
	picture: string;
	id: string;
	name: string;
	email: string;
	department: string;
	batch: number;
	handles: Handles;
}

const platforms: Array<keyof Handles> = ['github', 'linkedin', 'instagram', 'facebook'];

const ProfilePage: React.FC = () => {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const [editMode, setEditMode] = useState<boolean>(false);
	const [updatedHandles, setUpdatedHandles] = useState<Handles | null>(null);

	useEffect(() => {
		const fetchUserData = async () => {
			try {
				const res = await fetch('http://13.201.122.170:7000/client/students/nigga123');
				if (!res.ok) {
					return console.error(res.text);
				}

				const data: User = await res.json();
				setUser(data);
				setUpdatedHandles(data.handles); 
				console.log(data);
			} catch (error: any) {
				setError(error.message || 'Failed to fetch user data');
			} finally {
				setLoading(false);
			}
		};

		fetchUserData();
	}, []);

	const handleEditToggle = () => {
		setEditMode(!editMode);
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setUpdatedHandles(prev => prev ? { ...prev, [name]: value } : null);
	};

	const saveLinks = () => {
		if (updatedHandles && user) {
			setUser({ ...user, handles: updatedHandles });
		}
		setEditMode(false);
	};

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="bg-gray-900 shadow-md rounded-lg p-6">
				<div className="flex items-center space-x-4">
					<Avatar className="w-24 h-24">
						{user?.picture ?
							<AvatarImage src={user.picture} alt={user.name} />
						:	<AvatarFallback className="bg-gray-200 flex items-center justify-center text-2xl font-bold text-gray-500">
								{user?.name ? user.name[0] : 'N/A'}
							</AvatarFallback>
						}
					</Avatar>

					<div>
						<h1 className="text-3xl font-semibold mb-3">
							{user?.name || 'User Name'}
						</h1>
						<p className="text-blue-200">
							{user?.email || 'user@example.com'}
						</p>
						<p className="text-blue-200">
							Department: {user?.department || 'N/A'}
						</p>
						<p className="text-blue-200">
							Batch: {user?.batch || 'N/A'}
						</p>
					</div>
				</div>
			</div>

			<div className="bg-gray-900 shadow-md rounded-lg p-6 mt-5">
				<div className="flex justify-between items-center">
					<h2 className="text-2xl font-semibold text">Connections</h2>
					<button 
						onClick={handleEditToggle} 
						className="text-sm text-blue-500 underline"
					>
						{editMode ? 'Cancel' : 'Edit'}
					</button>
				</div>
				{editMode ? (
					<div className="mt-4 space-y-4">
						{platforms.map((platform) => (
							<div key={platform} className="flex items-center space-x-2">
								<label className="text-white capitalize">{platform}</label>
								<input
									type="text"
									name={platform}
									value={updatedHandles?.[platform] || ''}
									onChange={handleInputChange}
									className="bg-gray-200 rounded px-3 py-1"
								/>
							</div>
						))}
						<button 
							onClick={saveLinks}
							className="bg-blue-500 text-white py-1 px-4 rounded"
						>
							Save
						</button>
					</div>
				) : (
					<div className="mt-4 flex-col space-y-4">
						{user?.handles.github && (
							<Link
								href={user.handles.github}
								target="_blank"
								rel="noopener noreferrer"
								className="max-w-fit flex space-x-2 text-pink-500"
							>
								<FaGithub className="w-6 h-6" />
								<h3>GitHub</h3>
							</Link>
						)}
						{user?.handles.linkedin && (
							<Link
								href={user.handles.linkedin}
								target="_blank"
								rel="noopener noreferrer"
								className="max-w-fit flex space-x-2 text-pink-500"
							>
								<FaLinkedin className="w-6 h-6" />
								<h3>LinkedIn</h3>
							</Link>
						)}
						{user?.handles.instagram && (
							<Link
								href={user.handles.instagram}
								target="_blank"
								rel="noopener noreferrer"
								className="max-w-fit flex space-x-2 text-pink-500"
							>
								<FaInstagram className="w-6 h-6" />
								<h3>Instagram</h3>
							</Link>
						)}
						{user?.handles.facebook && (
							<Link
								href={user.handles.facebook}
								target="_blank"
								rel="noopener noreferrer"
								className="max-w-fit flex space-x-2 text-pink-500"
							>
								<FaFacebook className="w-6 h-6" />
								<h3>Facebook</h3>
							</Link>
						)}
					</div>
				)}
			</div>
		</div>
	);
};

export default ProfilePage;
