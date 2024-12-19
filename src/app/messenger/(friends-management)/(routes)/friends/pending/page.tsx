"use client";

import { useState } from "react";

import SearchBar from "@/components/search-bar";
import FriendRequestDirectory from "@/app/messenger/(friends-management)/_components/friend-request-directory";

const FriendsPendingPage = () => {
	const [searchQuery, setSearchQuery] = useState("");

	return (
		<div className="flex flex-col space-y-8">
			<div>
				<SearchBar placeholder="Search" onSearch={(searchTerm) => setSearchQuery(searchTerm)} />
			</div>
			<FriendRequestDirectory searchQuery={searchQuery} />
		</div>
	);
};

export default FriendsPendingPage;
