import Loader from "@/components/ui/loader";
import { WrapperContentZone, WrapperContent } from "@/app/messenger/_components/wrapper";

const Loading = () => (
	<WrapperContentZone>
		<WrapperContent className="m-0 h-screen">
			<div className="flex h-full items-center justify-center">
				<Loader />
			</div>
		</WrapperContent>
	</WrapperContentZone>
);

export default Loading;
