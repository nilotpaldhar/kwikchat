"use client";

import { useState } from "react";

import SearchBar from "@/components/search-bar";
import FriendDirectory from "@/app/messenger/(friends-management)/_components/friend-directory";

const FriendsRootPage = () => {
	const [searchQuery, setSearchQuery] = useState("");

	return (
		<div className="flex flex-col space-y-8">
			<div>
				<SearchBar placeholder="Search" onSearch={(searchTerm) => setSearchQuery(searchTerm)} />
			</div>
			<FriendDirectory searchQuery={searchQuery} />
		</div>
	);
};

export default FriendsRootPage;
