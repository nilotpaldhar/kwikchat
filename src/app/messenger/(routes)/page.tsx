import {
	Wrapper,
	WrapperSidePanel,
	WrapperContentZone,
	WrapperContent,
} from "@/app/messenger/_components/wrapper";

const MessengerRootPage = () => (
	<Wrapper>
		<WrapperSidePanel>Side Panel</WrapperSidePanel>
		<WrapperContentZone>
			<WrapperContent>MessengerRootPage</WrapperContent>
		</WrapperContentZone>
	</Wrapper>
);

export default MessengerRootPage;
