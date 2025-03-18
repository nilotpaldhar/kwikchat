import {
	FileDefault,
	FilePdf,
	FileTxt,
	FileDoc,
	FileDocx,
} from "@/components/messenger/document-icon/icons";
import { SUPPORTED_DOCUMENT_FILE_MESSAGE_TYPES } from "@/constants/chat-input";

type FileType = (typeof SUPPORTED_DOCUMENT_FILE_MESSAGE_TYPES)[number];

const IconMap: Record<FileType, React.ElementType> = {
	PDF: FilePdf,
	TXT: FileTxt,
	DOC: FileDoc,
	DOCX: FileDocx,
};

interface DocumentIconProps {
	fileType?: string | null;
	size?: number;
	className?: string;
}

const DocumentIcon = ({ fileType, size, className }: DocumentIconProps) => {
	const upperFileType = fileType?.toUpperCase();
	const isValidFileType = SUPPORTED_DOCUMENT_FILE_MESSAGE_TYPES.includes(upperFileType as FileType);
	const IconComponent = isValidFileType ? IconMap[upperFileType as FileType] : FileDefault;

	return <IconComponent size={size} className={className} />;
};

export default DocumentIcon;
