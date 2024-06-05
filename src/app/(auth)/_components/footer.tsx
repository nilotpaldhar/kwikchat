const AuthFooter = () => {
	const year = new Date().getFullYear();

	return (
		<div className="flex justify-center items-center text-center px-5 pt-5 pb-6 md:px-10 md:pb-8">
			<p className="text-small text-neutral-500 dark:text-neutral-400">
				&copy; {year} KwikChat. All rights reserved
			</p>
		</div>
	);
};

export default AuthFooter;
