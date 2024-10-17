import * as React from "react";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

interface FilterDropdownProps {
    options: string[];
    selectedOptions: string[];
    onOptionsChange: (options: string[]) => void;
    placeholder: string;
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({
    options,
    selectedOptions,
    onOptionsChange,
    placeholder,
}) => {
    const [open, setOpen] = React.useState(false);

    const handleSelect = (option: string) => {
        // This line normalizes the option string:
        // 1. Convert to lowercase
        // 2. Normalize Unicode characters (NFD: Normalization Form Decomposition)
        // 3. Remove diacritical marks (accents)
        // This ensures consistent comparison regardless of case or accents
        const normalizedOption = option;
        // .toLowerCase()
        // .normalize("NFD")
        // .replace(/[\u0300-\u036f]/g, "")
        // .replace(
        //     /[\u0102\u0103\u00C2\u00E2\u00CE\u00EE\u0218\u0219\u015E\u015F\u021A\u021B]/g,
        //     (match) => {
        //         const replacements = {
        //             "\u0102": "A",
        //             "\u0103": "a",
        //             "\u00C2": "A",
        //             "\u00E2": "a",
        //             "\u00CE": "I",
        //             "\u00EE": "i",
        //             "\u0218": "S",
        //             "\u0219": "s",
        //             "\u015E": "S",
        //             "\u015F": "s",
        //             "\u021A": "T",
        //             "\u021B": "t",
        //         };
        //         return (
        //             replacements[match as keyof typeof replacements] ||
        //             match
        //         );
        //     }
        // );

        if (selectedOptions.includes(normalizedOption)) {
            onOptionsChange(
                selectedOptions.filter((item) => item !== normalizedOption)
            );
        } else {
            onOptionsChange([...selectedOptions, normalizedOption]);
        }
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full sm:w-[400px] justify-between"
                >
                    {selectedOptions.length > 0
                        ? `${selectedOptions.length} selectii`
                        : placeholder}
                    <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            {/* <PopoverContent className="w-full sm:w-[400px] p-0"> */}
            <PopoverContent className="w-[--radix-popover-trigger-width] sm:w-[400px] p-0">
                <Command>
                    <CommandInput placeholder="Cauta..." className="h-9" />
                    <CommandList>
                        <CommandEmpty>Niciun rezultat gasit.</CommandEmpty>
                        <CommandGroup>
                            {options.map((option) => (
                                <CommandItem
                                    key={option}
                                    onSelect={() => handleSelect(option)}
                                >
                                    <div className="flex items-center">
                                        <CheckIcon
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                selectedOptions.includes(option)
                                                    ? "opacity-100"
                                                    : "opacity-0"
                                            )}
                                        />
                                        {option}
                                    </div>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
};

export default FilterDropdown;
