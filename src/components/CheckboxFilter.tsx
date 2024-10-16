import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface CheckboxFilterProps {
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
}

const CheckboxFilter: React.FC<CheckboxFilterProps> = ({
    label,
    checked,
    onChange,
}) => {
    return (
        <div className="flex items-center space-x-2">
            <Checkbox
                id={`checkbox-${label}`}
                checked={checked}
                onCheckedChange={onChange}
                className="w-5 h-5" // Increased size of the checkbox
            />
            <Label
                htmlFor={`checkbox-${label}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
                {label}
            </Label>
        </div>
    );
};

export default CheckboxFilter;
