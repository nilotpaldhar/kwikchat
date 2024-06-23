import AuthNavbar from "@/app/(auth)/_components/navbar";
import AuthFooter from "@/app/(auth)/_components/footer";

interface AuthLayoutProps {
	children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => (
	<div className="container p-0 flex flex-col min-h-screen">
		<header>
			<AuthNavbar />
		</header>
		<main className="flex-1 flex justify-center">
			<div className="w-full max-w-sm py-16 px-5 lg:max-w-md overflow-hidden">{children}</div>
		</main>
		<footer>
			<AuthFooter />
		</footer>
	</div>
);

export default AuthLayout;
