import { useQuery } from "@tanstack/react-query";
import axios, { handleAxiosError } from "@/lib/axios";

import type { APIResponse, UserProfile } from "@/types";
import { userKeys } from "@/constants/tanstack-query";

const getCurrentUser = async () => {
	try {
		const res = await axios.get<APIResponse<UserProfile>>("/users/me");
		return res.data;
	} catch (error) {
		const errMsg = handleAxiosError(error);
		throw new Error(errMsg);
	}
};

const useCurrentUser = () =>
	useQuery({
		queryKey: userKeys.current,
		queryFn: getCurrentUser,
	});

export default useCurrentUser;
