import * as React from "react"
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

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
  const [open, setOpen] = React.useState(false)

  const handleSelect = (option: string) => {
    if (selectedOptions.includes(option)) {
      onOptionsChange(selectedOptions.filter((item) => item !== option))
    } else {
      onOptionsChange([...selectedOptions, option])
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[400px] justify-between"
        >
         {selectedOptions.length > 0
            ? `${selectedOptions.length} selectii`
            : placeholder}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0">
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
                        selectedOptions.includes(option) ? "opacity-100" : "opacity-0"
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
  )
}

export default FilterDropdown;