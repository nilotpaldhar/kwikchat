import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";

import Container from "@/app/(marketing)/_components/container";
import {
	SectionHeader,
	SectionBadge,
	SectionTitle,
	SectionDescription,
} from "@/app/(marketing)/_components/section-header";

import { FAQS } from "@/constants/marketing";
import { cn } from "@/utils/general/cn";

const FAQSection = () => (
	<div>
		<Container>
			<SectionHeader>
				<SectionBadge>FAQs</SectionBadge>
				<SectionTitle>Frequently Asked Questions</SectionTitle>
				<SectionDescription>
					Uncover everything you need to know about this project, from features to technology and
					beyond!
				</SectionDescription>
			</SectionHeader>
			<div className="flex justify-center pt-12 md:pt-20">
				<div className="w-full max-w-xl lg:max-w-3xl">
					{FAQS.map(({ id, question, answer }, idx) => (
						<Accordion key={id} type="single" collapsible>
							<AccordionItem
								value={id}
								className={cn(
									idx + 1 === FAQS.length ? "border-transparent" : "border-neutral-200"
								)}
							>
								<AccordionTrigger className="rounded py-6 text-base font-semibold text-neutral-900 outline-none ring-offset-surface-light-100 hover:no-underline focus-visible:ring-2 focus-visible:ring-neutral-300 md:text-lg">
									{question}
								</AccordionTrigger>
								<AccordionContent className="pb-6 text-sm text-neutral-700 md:text-base">
									{answer}
								</AccordionContent>
							</AccordionItem>
						</Accordion>
					))}
				</div>
			</div>
		</Container>
	</div>
);

export default FAQSection;
