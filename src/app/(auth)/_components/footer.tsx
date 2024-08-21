const AuthFooter = () => {
	const year = new Date().getFullYear();

	return (
		<div className="flex items-center justify-center px-5 pb-6 pt-5 text-center md:px-10 md:pb-8">
			<p className="text-small text-neutral-500 dark:text-neutral-400">
				&copy; {year} KwikChat. All rights reserved
			</p>
		</div>
	);
};

export default AuthFooter;
