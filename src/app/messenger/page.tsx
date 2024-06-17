import logout from "@/actions/auth/logout";
import { Button } from "@/components/ui/button";
import UserDetails from "@/components/user-details";

const MessengerRootPage = () => (
	<main className="container my-10">
		<h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-5">
			Messenger Root Page
		</h1>
		<form action={logout}>
			<Button type="submit">Logout</Button>
		</form>
		<div className="my-4">
			<UserDetails />
		</div>
	</main>
);

export default MessengerRootPage;
