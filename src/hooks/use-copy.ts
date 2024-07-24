import { useState, useRef, useEffect, useCallback, Dispatch, SetStateAction } from "react";
import copyTextToClipboard from "@/utils/general/copy-text-to-clipboard";

type UseCopyReturnType = [() => void, boolean, Dispatch<SetStateAction<boolean>>];

const useCopy = (str: string): UseCopyReturnType => {
	const copyableString = useRef(str);
	const [copied, setCopied] = useState(false);

	const handleCopy = useCallback(() => {
		copyTextToClipboard(copyableString.current).then((copiedString) => setCopied(copiedString));
	}, [copyableString]);

	useEffect(() => {
		copyableString.current = str;
	}, [str]);

	return [handleCopy, copied, setCopied];
};

export default useCopy;
