'use client'

import { useMemo } from 'react';
import FilterDropdown from '@/components/FilterDropdown';

interface RepoSearchBarProps {
  repos: {
    primaryLanguage: { name: string; color: string | null } | null;
    isFork: boolean;
    isArchived: boolean;
  }[];
  searchTerm: string;
  selectedType: string;
  selectedLanguage: string;
  selectedSort: string;
  onSearchChange: (value: string) => void;
  onTypeChange: (value: string) => void;
  onLanguageChange: (value: string) => void;
  onSortChange: (value: string) => void;
}

const TYPE_OPTIONS = [
  { label: 'All', value: 'all' },
  { label: 'Sources', value: 'sources' },
  { label: 'Forks', value: 'forks' },
  { label: 'Archived', value: 'archived' },
  { label: 'Mirrors', value: 'mirrors' },
];

const SORT_OPTIONS = [
  { label: 'Last updated', value: 'last-updated' },
  { label: 'Name', value: 'name' },
  { label: 'Stars', value: 'stars' },
];

const RepoSearchBar = ({
  repos,
  searchTerm,
  selectedType,
  selectedLanguage,
  selectedSort,
  onSearchChange,
  onTypeChange,
  onLanguageChange,
  onSortChange,
}: RepoSearchBarProps) => {

  // Dynamically build language options from repos
  const languageOptions = useMemo(() => {
    const langMap = new Map<string, number>();

    repos.forEach(repo => {
      if (repo.primaryLanguage?.name) {
        langMap.set(repo.primaryLanguage.name, (langMap.get(repo.primaryLanguage.name) || 0) + 1);
      }
    });

    const sorted = Array.from(langMap.entries())
      .sort((a, b) => b[1] - a[1]); // Sort by count descending

    return [
      { label: 'All', value: 'all', count: repos.length },
      ...sorted.map(([name, count]) => ({ label: name, value: name, count })),
    ];
  }, [repos]);

  return (
    <div>
      <div className='flex py-4 border-b border-custom_light_grey'>
        <input
          type='text'
          placeholder='Find a repository...'
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className='h-8 border border-custom_light_grey rounded-lg w-96 pl-4 pr-10 mr-2'
        />
        <div className='flex gap-2'>
          <FilterDropdown
            label='Type'
            options={TYPE_OPTIONS}
            selectedValue={selectedType}
            onSelect={onTypeChange}
          />
          <FilterDropdown
            label='Language'
            options={languageOptions}
            selectedValue={selectedLanguage}
            onSelect={onLanguageChange}
            showCount
          />
          <FilterDropdown
            label='Sort'
            options={SORT_OPTIONS}
            selectedValue={selectedSort}
            onSelect={onSortChange}
          />
        </div>
      </div>

      {(selectedType !== 'all' || selectedLanguage !== 'all') && (
        <div className='border-b border-custom_light_grey py-4'>
          {selectedType !== 'all' && (
            <span className='text-sm text-custom_grey mr-4'>Type: {selectedType}</span>
          )}
          {selectedLanguage !== 'all' && (
            <span className='text-sm text-custom_grey'>Language: {selectedLanguage}</span>
          )}
          {selectedSort && (
            <span className='text-sm text-custom_grey ml-4'>Sort: {selectedSort}</span>
          )}
        </div>
      )}
    </div>
  );
};

export default RepoSearchBar;