import AuthNavbar from "@/app/(auth)/_components/navbar";
import AuthFooter from "@/app/(auth)/_components/footer";

interface AuthLayoutProps {
	children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => (
	<div className="container flex min-h-screen flex-col p-0">
		<header>
			<AuthNavbar />
		</header>
		<main className="flex flex-1 justify-center">
			<div className="w-full max-w-sm overflow-hidden px-5 py-16 lg:max-w-md">{children}</div>
		</main>
		<footer>
			<AuthFooter />
		</footer>
	</div>
);

export default AuthLayout;
