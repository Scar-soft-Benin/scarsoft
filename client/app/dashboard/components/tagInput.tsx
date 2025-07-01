// ~/components/TagInput.tsx
import { useState, useRef } from "react";
import { FiX } from "react-icons/fi";

interface TagInputProps {
    value: string[];
    onChange: (value: string[]) => void;
    placeholder?: string;
    name: string;
    error?: string;
}

export default function TagInput({
    value,
    onChange,
    placeholder,
    error
}: TagInputProps) {
    const [inputValue, setInputValue] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    const addTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && inputValue.trim()) {
            e.preventDefault();
            if (!value.includes(inputValue.trim())) {
                onChange([...value, inputValue.trim()]);
            }
            setInputValue("");
            inputRef.current?.focus();
        }
    };

    const removeTag = (tag: string) => {
        onChange(value.filter((t) => t !== tag));
    };

    return (
        <div className="flex flex-col">
            <div
                className={`border rounded-md p-2 flex flex-wrap gap-2 ${
                    error
                        ? "border-danger"
                        : "border-neutral-light-border dark:border-neutral-dark-border"
                } bg-neutral-light-surface dark:bg-neutral-dark-surface`}
            >
                {value.map((tag) => (
                    <span
                        key={tag}
                        className="bg-neutral-light-bg dark:bg-neutral-dark-bg text-neutral-light-text dark:text-neutral-dark-text px-2 py-1 rounded-md flex items-center gap-1"
                    >
                        {tag}
                        <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="text-neutral-light-secondary dark:text-neutral-dark-secondary hover:text-danger"
                            aria-label={`Supprimer ${tag}`}
                        >
                            <FiX className="w-4 h-4" />
                        </button>
                    </span>
                ))}
                <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={addTag}
                    placeholder={placeholder}
                    className="flex-1 bg-transparent outline-none text-neutral-light-text dark:text-neutral-dark-text focus:ring-primary focus:border-primary"
                    aria-label={placeholder}
                />
            </div>
            {error && <small className="text-danger mt-1">{error}</small>}
        </div>
    );
}
