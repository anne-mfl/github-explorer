'use client'

import { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';

interface FilterDropdownProps {
  label: string;
  selectedLabel?: string;
  options: { label: string; value: string; count?: number }[];
  selectedValue: string;
  onSelect: (value: string) => void;
  showCount?: boolean;
}

const FilterDropdown = ({ label, selectedLabel, options, selectedValue, onSelect, showCount = false }: FilterDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = options.filter(opt =>
    opt.label.toLowerCase().includes(search.toLowerCase())
  );

  // Display label: show selected value if it's not the default
  // const displayLabel = selectedValue !== options[0]?.value
  //   ? `${label}: ${selectedLabel || selectedValue}`
  //   : label;

  return (
    <div ref={dropdownRef} className='relative'>
      <button
        className={`grey_button flex items-center gap-2`}
        onClick={() => {
          setIsOpen(!isOpen);
          setSearch('');
        }}
      >
        {label}
        <FontAwesomeIcon icon={faCaretDown} className='ml-1 w-2' />
      </button>

      {isOpen && (
        <div className='absolute top-full left-0 mt-1 w-64 bg-white border border-custom_border_grey rounded-md shadow-lg z-50'>
          {/* Header */}
          <div className='flex items-center justify-between pl-4 pr-2 py-2'>
            <span className='text-xs font-semibold'>
              {label === 'Sort' ? 'Select order' : `Select ${label.toLowerCase()}`}
            </span>
            <button onClick={() => setIsOpen(false)} className='text-custom_grey hover:text-black text-xs'>✕</button>
          </div>

          {/* Options list */}
          <ul className='max-h-48 overflow-y-auto border-t border-custom_border_grey'>
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, index) => (
                <li key={option.value}>
                  <button
                    className={`w-full text-left px-4 py-2 text-xs flex justify-between items-center hover:bg-navbar_background ${
                      index < filteredOptions.length - 1 ? 'border-b border-custom_border_grey' : ''
                    } `}
                    onClick={() => {
                      onSelect(option.value);
                      setIsOpen(false);
                    }}
                  >
                    <span className='flex items-center gap-2'>
                      {selectedValue === option.value && <span>✓</span>}
                      <span className={selectedValue === option.value ? 'ml-0' : 'ml-4'}>{option.label}</span>
                    </span>
                    {showCount && option.count !== undefined && (
                      <span className='text-custom_grey'>{option.count}</span>
                    )}
                  </button>
                </li>
              ))
            ) : (
              <li className='px-4 py-2 text-xs text-custom_grey'>No results found</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FilterDropdown;