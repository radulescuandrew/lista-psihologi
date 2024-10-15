import React from 'react';

interface FilterDropdownProps {
  options: string[];
  selectedOption: string;
  onOptionChange: (option: string) => void;
  placeholder: string;
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({
  options,
  selectedOption,
  onOptionChange,
  placeholder,
}) => {
  return (
    <select
      value={selectedOption}
      onChange={(e) => onOptionChange(e.target.value)}
      className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
    >
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
};

export default FilterDropdown;