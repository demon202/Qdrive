'use client'
import React, { useEffect, useState } from 'react';
import { getFiles } from '@/lib/actions/file.actions';
import { ChevronUp, ChevronDown } from 'lucide-react';
import ActionDropdown from './ActionDropdown';
import Thumbnail from './Thumbnail';
import Link from 'next/link';

interface FileDocument {
  url: string | undefined;
  extension: string | undefined;
  $id: string;
  fullName: string;
  $updatedAt: string;
  size: number;
  type: string;
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(0)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(0)} GB`;
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  };
  
  return date.toLocaleString('en-US', options).replace(',', '.');
};

type SortField = 'fullName' | '$updatedAt' | 'size';
type SortOrder = 'asc' | 'desc';

interface AllFilesProps {
  filterTypes?: string[];
  searchText?: string;
  initialSort?: string;
}

export default function AllFiles({ 
  filterTypes = [], 
  searchText = "", 
  initialSort = "$updatedAt-desc" 
}: AllFilesProps) {
  const [files, setFiles] = useState<FileDocument[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Parse initial sort
  const [field, order] = initialSort.split('-');
  const [sortField, setSortField] = useState<SortField>((field as SortField) || '$updatedAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>((order as SortOrder) || 'desc');

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const sortValue = `${sortField}-${sortOrder}`;
        const result = await getFiles({ 
          types: filterTypes,
          searchText: searchText,
          sort: sortValue 
        });
        setFiles(result?.documents || []);
      } catch (error) {
        console.error('Error fetching files:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, [sortField, sortOrder, filterTypes, searchText]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortOrder === 'asc' ? (
      <ChevronUp size={16} className="inline ml-1" />
    ) : (
      <ChevronDown size={16} className="inline ml-1" />
    );
  };

  if (loading) {
    return (
      <div className="px-6 py-8 text-center text-light-100">
        Loading files...
      </div>
    );
  }

  return (
    <div className="bg-bg-grey rounded-lg overflow-hidden mt-6">
      {/* Table Header */}
      <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-light-400 text-xs text-text-grey uppercase tracking-wider">
        <button
          onClick={() => handleSort('fullName')}
          className="col-span-5 text-left hover:text-white transition-colors flex items-center"
        >
          Names
          <SortIcon field="fullName" />
        </button>
        <button
          onClick={() => handleSort('$updatedAt')}
          className="col-span-5 text-left hover:text-white transition-colors flex items-center"
        >
          Last Modified
          <SortIcon field="$updatedAt" />
        </button>
        <button
          onClick={() => handleSort('size')}
          className="col-span-2 text-left hover:text-white transition-colors flex items-center"
        >
          Size
          <SortIcon field="size" />
        </button>
      </div>

      {/* Table Body */}
      <div>
        {files.length === 0 ? (
          <div className="px-6 py-8 text-center text-light-100">
            No files uploaded
          </div>
        ) : (
          files.map((file, index) => (
            <div
              key={file.$id}
              className={`grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-light-400/10 transition-colors ${
                index !== files.length - 1 ? 'border-b border-light-400' : ''
              }`}
            >
              <div className="col-span-5 text-light-100 font-light">
                <Link
                  href={file.url || '#'}
                  target="_blank"
                  className="flex items-center gap-3 hover:text-white transition-colors"
                >
                  <Thumbnail
                    type={file.type}
                    extension={file.extension}
                    url={file.url}
                  />
                  <span className="truncate block max-w-[180px] sm:max-w-[250px] md:max-w-full" title={file.fullName}>
                  {file.fullName}
                </span>
                </Link>
              </div>
              <div className="col-span-5 text-text-grey font-light">
                {formatDate(file.$updatedAt)}
              </div>
              <div className="col-span-1 text-text-grey font-light">
                {formatFileSize(file.size)}
              </div>
              <div className="col-span-1 flex justify-end flex-shrink-0 min-w-[40px]">
                <ActionDropdown file={file} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}