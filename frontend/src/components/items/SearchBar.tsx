import React, { useState, useEffect } from 'react';
import { Search, X, Sparkles } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = 'Search tools by name, brand, or purpose (e.g., Karcher, lawnmower, drill)...',
  className = '',
}) => {
  const [internalValue, setInternalValue] = useState(value);

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextVal = e.target.value;
    setInternalValue(nextVal);
    onChange(nextVal);
  };

  const handleClear = () => {
    setInternalValue('');
    onChange('');
  };

  return (
    <div className={`relative flex items-center w-full ${className}`}>
      <div className="absolute left-3.5 sm:left-4 text-black pointer-events-none flex items-center">
        <Search className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
      </div>

      <input
        type="text"
        value={internalValue}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full pl-10 sm:pl-12 pr-10 py-3 sm:py-3.5 rounded-2xl border-2 border-black bg-white text-sm sm:text-base font-bold text-black placeholder-[#777] shadow-[3.5px_3.5px_0px_#000] focus:shadow-[5.5px_5.5px_0px_#000] focus:outline-none transition-all"
      />

      {internalValue && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3.5 p-1 rounded-lg bg-[#faf9f6] border border-black text-black hover:bg-[#ff90e8] transition-colors cursor-pointer"
          aria-label="Clear search input"
        >
          <X className="w-4 h-4 stroke-[2.5]" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
