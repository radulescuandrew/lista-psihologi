import * as React from "react";

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
    const [searchTerm, setSearchTerm] = React.useState("");
    const dropdownRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSelect = (option: string) => {
        const normalizedOption = option;

        if (selectedOptions.includes(normalizedOption)) {
            onOptionsChange(
                selectedOptions.filter((item) => item !== normalizedOption)
            );
        } else {
            onOptionsChange([...selectedOptions, normalizedOption]);
        }
    };

    const filteredOptions = options.filter(option =>
        option.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="relative font-sans text-sm" ref={dropdownRef}>
            <button
                type="button"
                onClick={() => setOpen(!open)}
                className="w-full sm:w-[400px] px-4 py-2 text-leftborder rounded-md flex justify-between items-center bg-white"
                role="combobox"
                aria-expanded={open}
            >
                <span>
                    {selectedOptions.length > 0
                        ? selectedOptions.length === 1 
                            ? "O selectie"
                            : `${selectedOptions.length} selectii`
                        : placeholder}
                </span>
                <span className="ml-2 opacity-50">▼</span>
            </button>

            {open && (
                <div className="absolute z-10 w-full sm:w-[400px] mt-1 bg-white border rounded-md shadow-lg">
                    <div className="p-2 border-b bg-white relative">
                        <svg 
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                            xmlns="http://www.w3.org/2000/svg" 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                        >
                            <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={2} 
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                            />
                        </svg>
                        <input
                            type="text"
                            className="w-full pl-10 pr-2 py-1 bg-white font-sans outline-none"
                            placeholder="Cauta..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>
                    <div className="p-1 bg-white">
                        {filteredOptions.length === 0 ? (
                            <div className="px-2 py-1 text-gray-500 bg-white font-sans">
                                Niciun rezultat gasit.
                            </div>
                        ) : (
                            <div className="max-h-60 overflow-auto bg-white">
                                {filteredOptions.map((option) => (
                                    <button
                                        key={option}
                                        className="w-full px-2 py-1 text-left hover:bg-gray-100 flex items-center bg-white font-sans"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleSelect(option);
                                        }}
                                    >
                                        <span className="mr-2 w-4 h-4 inline-flex items-center justify-center">
                                            {selectedOptions.includes(option) && "✓"}
                                        </span>
                                        {option}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default FilterDropdown;
