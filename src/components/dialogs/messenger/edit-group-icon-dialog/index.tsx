"use client";

import type { Area } from "react-easy-crop";

import { useEffect, useReducer, useTransition } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, ArrowLeft, XOctagon } from "lucide-react";

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

import GroupIconPicker from "@/components/messenger/group-icon-picker";
import GroupIconEditor from "@/components/dialogs/messenger/edit-group-icon-dialog/group-icon-editor";

import useMediaQuery from "@/hooks/use-media-query";
import useMessengerDialogStore from "@/store/use-messenger-dialog-store";
import { useUpdateGroupConversationDetails } from "@/hooks/tanstack-query/use-conversation";

import { getCroppedImg, readFile } from "@/lib/crop-image";
import { validateGroupIcon } from "@/utils/messenger/group-input-validation";

type ViewMode = "default" | "icon_editor";

type ActionTypes =
	| { type: "SET_VIEW_MODE"; payload: ViewMode }
	| { type: "SET_DIRECTION"; payload: number }
	| { type: "RESET" }
	| { type: "SET_GROUP_ICON"; payload: string }
	| { type: "SET_GROUP_ICON_DATA_URL"; payload: string }
	| { type: "SET_CROP_PIXELS"; payload: Area | null }
	| { type: "SET_ERROR"; payload: string };

// Initial state for the reducer
const initialState = {
	viewMode: "default" as ViewMode,
	direction: 0,
	groupIcon: null as string | null,
	groupIconDataUrl: "",
	cropPixels: null as Area | null,
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
		case "SET_GROUP_ICON":
			return { ...state, groupIcon: action.payload };
		case "SET_GROUP_ICON_DATA_URL":
			return { ...state, groupIconDataUrl: action.payload };
		case "SET_CROP_PIXELS":
			return { ...state, cropPixels: action.payload };
		case "SET_ERROR":
			return { ...state, error: action.payload };
		default:
			return state;
	}
};

const EditGroupIconDialog = () => {
	const { mutate, isPending, reset } = useUpdateGroupConversationDetails();

	const title = `Edit Group Icon`;

	const [state, dispatch] = useReducer(reducer, initialState); // State management using a reducer.
	const [pending, startTransition] = useTransition(); // Managing transitions and pending state.
	const isDesktop = useMediaQuery("(min-width: 768px)"); // Check if the viewport is desktop-sized.

	const {
		type,
		isOpen,
		data: { groupConversationToEdit },
		onClose,
	} = useMessengerDialogStore();
	const isDialogOpen = isOpen && type === "EDIT_GROUP_ICON";

	// Effect to set initial group icon when editing starts.
	useEffect(() => {
		if (groupConversationToEdit && groupConversationToEdit.icon) {
			dispatch({ type: "SET_GROUP_ICON", payload: groupConversationToEdit.icon });
		}
	}, [groupConversationToEdit]);

	// Animation variants for sliding the view.
	const slideAnimation = {
		initial: (dir: number) => ({ x: dir > 0 ? 300 : -300, opacity: 0 }),
		animate: { x: 0, opacity: 1, transition: { duration: 0.3 } },
		exit: (dir: number) => ({
			x: dir < 0 ? 300 : -300,
			opacity: 0,
			transition: { duration: 0.3 },
		}),
	};

	// Handle group icon change with validation
	const handleGroupIconChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		dispatch({ type: "SET_ERROR", payload: "" });

		const file = e.target.files?.[0];
		if (!file) return;

		const { isValid, error } = validateGroupIcon(file);

		if (!isValid && error) {
			dispatch({ type: "SET_ERROR", payload: error });
			return;
		}

		const iconDataUrl = await readFile(file);
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

	// Handle dialog close
	const handleClose = () => {
		if (pending || isPending) return;
		dispatch({ type: "RESET" });
		reset();
		onClose();
	};

	// Handles navigation back in the dialog/ drawer.
	const handleBack = () => {
		dispatch({ type: "SET_ERROR", payload: "" });
		dispatch({ type: "SET_DIRECTION", payload: -1 });

		if (state.viewMode === "icon_editor") {
			dispatch({ type: "SET_VIEW_MODE", payload: "default" });
			return;
		}

		handleClose();
	};

	// Handles form submission.
	const handleSubmit = async () => {
		dispatch({ type: "SET_ERROR", payload: "" });
		dispatch({ type: "SET_DIRECTION", payload: 1 });

		if (state.viewMode === "icon_editor") {
			await handleGroupIconCrop(state.cropPixels);
			dispatch({ type: "SET_VIEW_MODE", payload: "default" });
			return;
		}

		if (state.viewMode === "default") {
			if (state.groupIcon !== groupConversationToEdit?.icon) {
				const conversationId = groupConversationToEdit?.id;
				if (!conversationId || !state.groupIcon) return;
				mutate(
					{
						conversationId,
						groupIcon: state.groupIcon,
					},
					{
						onError: (error) => dispatch({ type: "SET_ERROR", payload: error.message }),
						onSuccess: handleClose,
					}
				);
			} else {
				handleClose();
			}
		}
	};

	// Renders the title of the dialog/ drawer.
	const renderTitle = () => (
		<div className="flex items-center space-x-3">
			{state.viewMode !== "default" && (
				<Button
					size="icon"
					variant="outline"
					disabled={pending || isPending}
					onClick={handleBack}
					className="size-max border-none bg-transparent hover:bg-transparent dark:bg-transparent"
				>
					<ArrowLeft size={20} />
					<span className="sr-only">Back</span>
				</Button>
			)}
			<span>{title}</span>
		</div>
	);

	// Renders the body content for dialog/ drawer.
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
						<div className="flex items-center justify-center py-5">
							<GroupIconPicker
								src={state.groupIcon}
								label="Edit Group Icon"
								onChange={handleGroupIconChange}
							/>
						</div>
					)}
					{state.viewMode === "icon_editor" && (
						<GroupIconEditor
							groupIconDataUrl={state.groupIconDataUrl}
							onCropComplete={(croppedAreaPixels) =>
								dispatch({ type: "SET_CROP_PIXELS", payload: croppedAreaPixels })
							}
						/>
					)}
				</motion.div>
			</AnimatePresence>
		</>
	);

	// Renders the footer with Save and Cancel buttons.
	const renderFooter = () => (
		<>
			<Button
				variant="outline"
				disabled={pending || isPending}
				onClick={handleClose}
				className="space-x-2 border-none bg-transparent hover:bg-transparent dark:bg-transparent"
			>
				<span>Cancel</span>
			</Button>
			<Button className="space-x-2" disabled={pending || isPending} onClick={handleSubmit}>
				{(pending || isPending) && <Loader2 size={18} className="animate-spin" />}
				<span>Save</span>
			</Button>
		</>
	);

	// Render dialog for desktop devices.
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

	// Render drawer for mobile devices.
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

export default EditGroupIconDialog;
