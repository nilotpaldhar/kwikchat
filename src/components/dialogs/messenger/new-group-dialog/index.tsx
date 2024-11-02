"use client";

import type { Area } from "react-easy-crop";

import { useReducer, useTransition } from "react";
import { useRouter } from "next/navigation";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Loader2, XOctagon } from "lucide-react";

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogBody,
	DialogTitle,
	DialogDescription,
	DialogFooter,
} from "@/components/ui/dialog";
import {
	Drawer,
	DrawerContent,
	DrawerHeader,
	DrawerBody,
	DrawerFooter,
	DrawerTitle,
	DrawerDescription,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle } from "@/components/ui/alert";

import GroupInfoInput from "@/components/dialogs/messenger/new-group-dialog/group-info-input";
import GroupIconEditor from "@/components/dialogs/messenger/new-group-dialog/group-icon-editor";
import GroupMemberSelector from "@/components/dialogs/messenger/new-group-dialog/group-member-selector";

import useMediaQuery from "@/hooks/use-media-query";
import useMessengerDialogStore from "@/store/use-messenger-dialog-store";

import { getCroppedImg, readFile } from "@/lib/crop-image";
import initGroupConversation from "@/actions/conversation/init-group-conversation";

import {
	validateGroupName,
	validateGroupIcon,
	validateGroupDescription,
	validateGroupMembers,
} from "@/utils/messenger/group-input-validation";

type ViewMode = "default" | "icon_editor" | "member_selector";

type ActionTypes =
	| { type: "SET_VIEW_MODE"; payload: ViewMode }
	| { type: "SET_DIRECTION"; payload: number }
	| { type: "RESET" }
	| { type: "SET_GROUP_NAME"; payload: string }
	| { type: "SET_GROUP_DESCRIPTION"; payload: string }
	| { type: "SET_GROUP_ICON"; payload: string }
	| { type: "SET_GROUP_ICON_DATA_URL"; payload: string }
	| { type: "SET_CROP_PIXELS"; payload: Area | null }
	| { type: "SET_GROUP_MEMBER_IDS"; payload: string[] }
	| { type: "SET_ERROR"; payload: string };

// Initial state for the reducer
const initialState = {
	viewMode: "default" as ViewMode,
	direction: 0,
	groupName: "",
	groupDescription: "",
	groupIcon: null as string | null,
	groupIconDataUrl: "",
	cropPixels: null as Area | null,
	groupMemberIds: [] as string[],
	error: "",
};

// Reducer function to manage state transitions
const reducer = (state: typeof initialState, action: ActionTypes) => {
	switch (action.type) {
		case "SET_VIEW_MODE":
			return { ...state, viewMode: action.payload };
		case "SET_DIRECTION":
			return { ...state, direction: action.payload };
		case "RESET":
			return initialState;
		case "SET_GROUP_NAME":
			return { ...state, groupName: action.payload };
		case "SET_GROUP_DESCRIPTION":
			return { ...state, groupDescription: action.payload };
		case "SET_GROUP_ICON":
			return { ...state, groupIcon: action.payload };
		case "SET_GROUP_ICON_DATA_URL":
			return { ...state, groupIconDataUrl: action.payload };
		case "SET_CROP_PIXELS":
			return { ...state, cropPixels: action.payload };
		case "SET_GROUP_MEMBER_IDS":
			return { ...state, groupMemberIds: action.payload };
		case "SET_ERROR":
			return { ...state, error: action.payload };
		default:
			return state;
	}
};

const NewGroupDialog = () => {
	const router = useRouter();

	const [state, dispatch] = useReducer(reducer, initialState);
	const [pending, startTransition] = useTransition();
	const isDesktop = useMediaQuery("(min-width: 768px)");

	// Extract dialog state from store
	const { type, isOpen, onClose } = useMessengerDialogStore();
	const isDialogOpen = isOpen && type === "NEW_GROUP_CHAT";

	// Get dialog title based on the current view mode
	const getDialogTitle = () => {
		if (state.viewMode === "icon_editor") return "Edit Icon";
		if (state.viewMode === "member_selector") return "Add Group Members";
		return "New Group";
	};

	const slideAnimation = {
		initial: (dir: number) => ({ x: dir > 0 ? 300 : -300, opacity: 0 }),
		animate: { x: 0, opacity: 1, transition: { duration: 0.3 } },
		exit: (dir: number) => ({ x: dir < 0 ? 300 : -300, opacity: 0, transition: { duration: 0.3 } }),
	};

	// Handle member selection, updates state with selected member IDs
	const handleMemberSelect = (userId: string, selected: boolean) => {
		dispatch({
			type: "SET_GROUP_MEMBER_IDS",
			payload: selected
				? [...state.groupMemberIds, userId]
				: state.groupMemberIds.filter((id) => id !== userId),
		});
	};

	// Validate and set group name in state
	const handleGroupNameChange = (groupName: string) => {
		dispatch({ type: "SET_GROUP_NAME", payload: groupName });
		const { isValid, error } = validateGroupName(groupName);
		if (!isValid && error) {
			dispatch({ type: "SET_ERROR", payload: error });
		} else {
			dispatch({ type: "SET_ERROR", payload: "" });
		}
	};

	// Validate and set group description in state
	const handleGroupDescChange = (groupDesc: string) => {
		dispatch({ type: "SET_GROUP_DESCRIPTION", payload: groupDesc });
		const { isValid, error } = validateGroupDescription(groupDesc);
		if (!isValid && error) {
			dispatch({ type: "SET_ERROR", payload: error });
		} else {
			dispatch({ type: "SET_ERROR", payload: "" });
		}
	};

	// Handle group icon change with validation
	const handleGroupIconChange = async (icon: File) => {
		dispatch({ type: "SET_ERROR", payload: "" });

		const { isValid, error } = validateGroupIcon(icon);

		if (!isValid && error) {
			dispatch({ type: "SET_ERROR", payload: error });
			return;
		}

		const iconDataUrl = await readFile(icon);
		if (iconDataUrl && typeof iconDataUrl === "string") {
			dispatch({ type: "SET_DIRECTION", payload: 1 });
			dispatch({ type: "SET_VIEW_MODE", payload: "icon_editor" });
			dispatch({ type: "SET_GROUP_ICON_DATA_URL", payload: iconDataUrl });
		}
	};

	// Handle cropping of the group icon
	const handleGroupIconCrop = async (croppedAreaPixels: Area | null) => {
		if (!croppedAreaPixels || !state.groupIconDataUrl) return;

		const errMsg = "An error occurred while processing the icon. Please try again.";

		startTransition(() => {
			getCroppedImg(state.groupIconDataUrl, croppedAreaPixels)
				.then((croppedIcon) => {
					if (!croppedIcon) {
						dispatch({ type: "SET_ERROR", payload: errMsg });
						return;
					}
					dispatch({ type: "SET_GROUP_ICON", payload: croppedIcon });
				})
				.catch(() => dispatch({ type: "SET_ERROR", payload: errMsg }));
		});
	};

	// Close the dialog and reset state
	const handleClose = () => {
		if (pending) return;
		dispatch({ type: "RESET" });
		onClose();
	};

	// Handle navigation to previous views
	const handlePrev = () => {
		dispatch({ type: "SET_ERROR", payload: "" });
		dispatch({ type: "SET_DIRECTION", payload: -1 });

		if (state.viewMode === "icon_editor" || state.viewMode === "member_selector") {
			dispatch({ type: "SET_VIEW_MODE", payload: "default" });
			return;
		}

		handleClose();
	};

	// Handle navigation to next views and validation
	const handleNext = async () => {
		dispatch({ type: "SET_ERROR", payload: "" });
		dispatch({ type: "SET_DIRECTION", payload: 1 });

		// Validate group name
		const { isValid: isGroupNameValid, error: groupNameError } = validateGroupName(state.groupName);
		if (state.viewMode === "default" && !isGroupNameValid && groupNameError) {
			dispatch({ type: "SET_ERROR", payload: groupNameError });
			return;
		}

		// Validate group description
		const { isValid: isGroupDescValid, error: groupDescError } = validateGroupDescription(
			state.groupDescription
		);
		if (state.viewMode === "default" && !isGroupDescValid && groupDescError) {
			dispatch({ type: "SET_ERROR", payload: groupDescError });
			return;
		}

		// Validate group members
		const { isValid: isGroupMembersValid, error: groupMembersError } = validateGroupMembers(
			state.groupMemberIds
		);
		if (state.viewMode === "member_selector" && !isGroupMembersValid && groupMembersError) {
			dispatch({ type: "SET_ERROR", payload: groupMembersError });
			return;
		}

		// Change view mode to member_selector if currently in default mode
		if (state.viewMode === "default") {
			dispatch({ type: "SET_VIEW_MODE", payload: "member_selector" });
			return;
		}

		// Handle icon editing if currently in icon_editor mode
		if (state.viewMode === "icon_editor") {
			await handleGroupIconCrop(state.cropPixels);
			dispatch({ type: "SET_VIEW_MODE", payload: "default" });
			return;
		}

		// If in member_selector mode, prepare to create a group conversation
		if (state.viewMode === "member_selector") {
			const values = {
				groupName: state.groupName,
				groupDescription: state.groupDescription,
				groupIcon: state.groupIcon ?? "",
				groupMemberIds: state.groupMemberIds,
			};

			// Start a transition to create a group conversation
			startTransition(() => {
				initGroupConversation(values).then((data) => {
					if (data?.error) dispatch({ type: "SET_ERROR", payload: data.error });
					if (data?.redirectPath) {
						handleClose();
						router.push(data.redirectPath);
					}
				});
			});
		}
	};

	// Render title
	const renderTitle = () => (
		<div className="flex items-center space-x-3">
			{state.viewMode !== "default" && (
				<Button
					size="icon"
					variant="outline"
					disabled={pending}
					onClick={handlePrev}
					className="size-max border-none bg-transparent hover:bg-transparent dark:bg-transparent"
				>
					<ArrowLeft size={20} />
					<span className="sr-only">Back</span>
				</Button>
			)}
			<span>{getDialogTitle()}</span>
		</div>
	);

	// Render body content
	const renderBody = () => (
		<>
			{state.error && (
				<div className="mb-5 flex flex-col space-y-10 px-4 sm:px-5 lg:px-6">
					<Alert variant="danger" closable={false}>
						<XOctagon />
						<AlertTitle>{state.error}</AlertTitle>
					</Alert>
				</div>
			)}
			<AnimatePresence custom={state.direction} initial={false} mode="wait">
				<motion.div
					key={state.viewMode}
					custom={state.direction}
					variants={slideAnimation}
					initial="initial"
					animate="animate"
					exit="exit"
				>
					{state.viewMode === "default" && (
						<GroupInfoInput
							groupName={state.groupName}
							groupDescription={state.groupDescription}
							icon={state.groupIcon}
							onGroupNameChange={handleGroupNameChange}
							onGroupDescriptionChange={handleGroupDescChange}
							onGroupIconChange={handleGroupIconChange}
						/>
					)}
					{state.viewMode === "icon_editor" && (
						<GroupIconEditor
							groupIconDataUrl={state.groupIconDataUrl}
							onCropComplete={(croppedAreaPixels) =>
								dispatch({ type: "SET_CROP_PIXELS", payload: croppedAreaPixels })
							}
						/>
					)}
					{state.viewMode === "member_selector" && (
						<GroupMemberSelector
							defaultSelectedIds={state.groupMemberIds}
							onSelect={handleMemberSelect}
						/>
					)}
				</motion.div>
			</AnimatePresence>
		</>
	);

	// Render footer content
	const renderFooter = () => (
		<>
			<Button
				variant="outline"
				disabled={pending}
				onClick={handlePrev}
				className="space-x-2 border-none bg-transparent hover:bg-transparent dark:bg-transparent"
			>
				<span>
					{state.viewMode === "default" && "Cancel"}
					{state.viewMode === "icon_editor" && "Close"}
					{state.viewMode === "member_selector" && "Previous"}
				</span>
			</Button>
			<Button className="space-x-2" disabled={pending} onClick={handleNext}>
				{pending && <Loader2 size={18} className="animate-spin" />}
				<span>
					{state.viewMode === "default" && "Next"}
					{state.viewMode === "icon_editor" && "Finish"}
					{state.viewMode === "member_selector" && "Create"}
				</span>
			</Button>
		</>
	);

	// Render dialog for desktop
	if (isDesktop) {
		return (
			<Dialog open={isDialogOpen} onOpenChange={handleClose}>
				<DialogContent className="outline-none">
					<DialogHeader className="text-left">
						<DialogTitle>{renderTitle()}</DialogTitle>
						<DialogDescription className="hidden">No Description</DialogDescription>
					</DialogHeader>
					<DialogBody className="overflow-hidden !px-0">{renderBody()}</DialogBody>
					<DialogFooter>{renderFooter()}</DialogFooter>
				</DialogContent>
			</Dialog>
		);
	}

	// Render drawer for mobile
	return (
		<Drawer
			open={isDialogOpen}
			onOpenChange={(open) => {
				if (!open) handleClose();
			}}
		>
			<DrawerContent>
				<DrawerHeader className="text-left">
					<DrawerTitle>{renderTitle()}</DrawerTitle>
					<DrawerDescription className="hidden">No Description</DrawerDescription>
				</DrawerHeader>
				<DrawerBody className="overflow-hidden !px-0">{renderBody()}</DrawerBody>
				<DrawerFooter>{renderFooter()}</DrawerFooter>
			</DrawerContent>
		</Drawer>
	);
};

export default NewGroupDialog;
