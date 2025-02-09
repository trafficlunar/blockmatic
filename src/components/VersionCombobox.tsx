import { useContext, useEffect, useState } from "react";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

import { cn } from "@/lib/utils";
import { numberToVersion, versionToNumber } from "@/utils/version";
import { HistoryContext } from "@/context/History";

const versions = [
	"1.21.4",
	"1.21",
	"1.20",
	"1.19",
	"1.18",
	"1.17",
	"1.16",
	"1.15",
	"1.14",
	"1.13",
	"1.12",
	"1.11",
	"1.10",
	"1.9",
	"1.8",
	"1.7.2",
	"1.6.1",
];

interface Props {
	version: number;
	setVersion: React.Dispatch<React.SetStateAction<number>>;
	// If both variables above are from the context
	isContext?: boolean;
}

function VersionCombobox({ version, setVersion, isContext }: Props) {
	const { addHistory } = useContext(HistoryContext);

	const [comboboxOpen, setComboboxOpen] = useState(false);
	const [comboboxValue, setComboboxValue] = useState(numberToVersion(version));

	useEffect(() => {
		setVersion((prev) => {
			if (isContext) {
				const oldVersion = prev;
				addHistory(
					"Set Version",
					() => setVersion(versionToNumber(comboboxValue)),
					() => setVersion(oldVersion)
				);
			}

			return versionToNumber(comboboxValue);
		});
	}, [comboboxValue]);

	return (
		<Popover open={comboboxOpen} onOpenChange={setComboboxOpen}>
			<PopoverTrigger asChild>
				<Button variant="outline" role="combobox" aria-expanded={comboboxOpen} className="w-[200px] justify-between">
					{comboboxValue ? versions.find((version) => version === comboboxValue) : "Select version..."}

					<ChevronsUpDownIcon className="opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-[200px] p-0 pointer-events-auto">
				<Command>
					<CommandInput placeholder="Search version..." />
					<CommandList>
						<CommandEmpty>No version found.</CommandEmpty>
						<CommandGroup>
							{versions.map((version) => (
								<CommandItem
									key={version}
									value={version}
									onSelect={(currentValue) => {
										setComboboxValue(currentValue === comboboxValue ? versions[0] : currentValue);
										setComboboxOpen(false);
									}}
								>
									{version}
									<CheckIcon className={cn("ml-auto", comboboxValue === version ? "opacity-100" : "opacity-0")} />
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}

export default VersionCombobox;
