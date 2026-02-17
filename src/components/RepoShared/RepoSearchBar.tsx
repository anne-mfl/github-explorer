'use client'

import { useMemo } from 'react';
import FilterDropdown from '@/components/FilterDropdown';

interface RepoSearchBarProps {
  repos: {
    primaryLanguage: { name: string; color: string | null } | null;
    isFork?: boolean;
    isArchived?: boolean;
  }[];
  searchTerm: string;
  selectedType: string;
  selectedLanguage: string;
  selectedSort: string;
  onSearchChange: (value: string) => void;
  onTypeChange: (value: string) => void;
  onLanguageChange: (value: string) => void;
  onSortChange: (value: string) => void;
  // showTypeFilter?: boolean;
  placeholder?: string;
  sortOptions: { label: string; value: string }[];
}

const TYPE_OPTIONS = [
  { label: 'All', value: 'all' },
  { label: 'Sources', value: 'sources' },
  { label: 'Forks', value: 'forks' },
  { label: 'Archived', value: 'archived' },
  { label: 'Mirrors', value: 'mirrors' },
];

export const REPO_SORT_OPTIONS = [
  { label: 'Last updated', value: 'last-updated' },
  { label: 'Name', value: 'name' },
  { label: 'Stars', value: 'stars' },
];

export const STARS_SORT_OPTIONS = [
  { label: 'Recently starred', value: 'recently-starred' },
  { label: 'Recently active', value: 'last-updated' },
  { label: 'Most stars', value: 'stars' },
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
  placeholder = 'Find a repository...',
  sortOptions,
}: RepoSearchBarProps) => {

  const languageOptions = useMemo(() => {
    const langMap = new Map<string, number>();

    repos.forEach(repo => {
      if (repo.primaryLanguage?.name) {
        langMap.set(repo.primaryLanguage.name, (langMap.get(repo.primaryLanguage.name) || 0) + 1);
      }
    });

    const sorted = Array.from(langMap.entries()).sort((a, b) => b[1] - a[1]);

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
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className='h-8 border border-custom_light_grey rounded-lg w-96 pl-4 pr-10 mr-2'
        />
        <div className='flex gap-2'>
          {/* {showTypeFilter && ( */}
            <FilterDropdown
              label='Type'
              options={TYPE_OPTIONS}
              selectedValue={selectedType}
              onSelect={onTypeChange}
            />
          {/* )} */}
          <FilterDropdown
            label='Language'
            options={languageOptions}
            selectedValue={selectedLanguage}
            onSelect={onLanguageChange}
            showCount
          />
          <FilterDropdown
            label='Sort'
            options={sortOptions}
            selectedValue={selectedSort}
            onSelect={onSortChange}
          />
        </div>
      </div>
    </div>
  );
};

export default RepoSearchBar;