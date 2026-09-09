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
      <div className="absolute left-3.5 sm:left-4 text-[#8a857b] pointer-events-none flex items-center">
        <Search className="w-4 h-4 sm:w-5 sm:h-5" />
      </div>

      <input
        type="text"
        value={internalValue}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full pl-10 sm:pl-12 pr-10 py-3 sm:py-3.5 rounded-2xl border border-[#ded7c8] bg-white text-sm sm:text-base text-[#24211d] placeholder-[#8a857b] focus:outline-none focus:ring-2 focus:ring-[#c86d51]/25 focus:border-[#c86d51] transition-all shadow-xs"
      />

      {internalValue && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3.5 p-1 rounded-full text-[#8a857b] hover:text-[#24211d] hover:bg-[#f1ede4] transition-colors"
          aria-label="Clear search input"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
