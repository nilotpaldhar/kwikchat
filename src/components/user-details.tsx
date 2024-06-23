"use client";

import useCurrentUser from "@/hooks/use-current-user";

const UserDetails = () => {
	const user = useCurrentUser();

	return (
		<ul className="list">
			<li>Name: {user?.name}</li>
			<li>Display Name: {user?.displayName}</li>
			<li>Username: {user?.username}</li>
			<li>Email: {user?.email}</li>
			<li>bio: {user?.bio} </li>
			<li>Joining Date: {user?.createdAt?.toString()}</li>
		</ul>
	);
};

export default UserDetails;
