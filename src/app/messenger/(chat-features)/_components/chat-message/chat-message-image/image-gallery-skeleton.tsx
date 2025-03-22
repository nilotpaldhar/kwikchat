import Skeleton from "@/components/ui/skeleton";
import { cn } from "@/utils/general/cn";

const ImageGallerySkeleton = ({ count = 4 }: { count?: number }) => {
	const items = Array.from({ length: count }, (_, index) => index + 1);

	return (
		<div className={cn("grid w-full gap-2", count > 1 ? "grid-cols-2" : "grid-cols-1")}>
			{items.map((item) => (
				<Skeleton key={item} className="aspect-square rounded-xl" />
			))}
		</div>
	);
};

export default ImageGallerySkeleton;
