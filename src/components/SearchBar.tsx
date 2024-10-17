import React from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
    searchTerm,
    onSearchChange,
}) => {
    const clearSearch = () => {
        onSearchChange("");
    };

    return (
        <div className="relative">
            <Input
                type="text"
                placeholder="Introdu numele specialistului..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 pr-10 bg-white text-sm"
            />
            <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
            />
            {searchTerm && (
                <button
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                    <X size={20} />
                </button>
            )}
        </div>
    );
};

export default SearchBar;
