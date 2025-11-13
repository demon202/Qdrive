'use client';

import React, { useEffect, useState, use } from 'react';
import { getFiles } from '@/lib/actions/file.actions';
import { Models } from 'node-appwrite';
import { ChevronUp, ChevronDown } from 'lucide-react';
import Thumbnail from '@/components/Thumbnail';
import ActionDropdown from '@/components/ActionDropdown';
import { convertFileSize, getFileTypesParams, fetchTotalSpace } from '@/lib/utils';
import Link from 'next/link';

interface FileDocument extends Models.Document {
  url?: string;
  extension?: string;
  fullName?: string;
  $updatedAt: string;
  size?: number;
  sizeOriginal?: number;
  type?: string;
}

type SortField = 'fullName' | '$updatedAt' | 'size';
type SortOrder = 'asc' | 'desc';

// Format file sizes
const formatFileSize = (bytes: number): string => {
  if (!bytes) return '0 B';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(0)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(0)} GB`;
};

// Format last modified date
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  };
  return date.toLocaleString('en-US', options).replace(',', '.');
};

const Page = ({ searchParams, params }: any) => {
  const unwrappedParams = use(params);
  const unwrappedSearch = use(searchParams);

  const type = unwrappedParams?.type || '';
  const searchText = unwrappedSearch?.query || '';
  const initialSort = unwrappedSearch?.sort || '$updatedAt-desc';

  const [files, setFiles] = useState<FileDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalSpace, setTotalSpace] = useState<number>(0);

  // Parse initial sort
  const [field, order] = initialSort.split('-');
  const [sortField, setSortField] = useState<SortField>((field as SortField) || '$updatedAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>((order as SortOrder) || 'desc');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const types = getFileTypesParams(type) as string[];
        const sortValue = `${sortField}-${sortOrder}`;
        const result = await getFiles({ types, searchText, sort: sortValue });
        setFiles(result?.documents || []);

        const space = await fetchTotalSpace();
        setTotalSpace(space?.used || 0);
      } catch (err) {
        console.error('Error fetching files:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [type, searchText, sortField, sortOrder]);

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
      <div className="min-h-screen bg-bg-grey text-white p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-semibold mb-8 capitalize tracking-wide">
            {type || 'Files'}
          </h1>
          <p className="text-gray-400">Loading files...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-grey text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <h1 className="text-3xl font-semibold capitalize tracking-wide">{type || 'Files'}</h1>
          <div className="flex flex-wrap items-center gap-4 mt-4 sm:mt-0">
            <p className="text-gray-400">
              Total Used: <span className="text-white">{convertFileSize(totalSpace)}</span>
            </p>
          </div>
        </div>

        {/* Table */}
        <div className="bg-bg-grey rounded-lg overflow-hidden">
          {/* Table Header with Sorting */}
          <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-light-400 text-xs text-text-grey uppercase tracking-wider">
            <button
              onClick={() => handleSort('fullName')}
              className="col-span-5 text-left hover:text-white transition-colors flex items-center "
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
              <div className="px-6 py-8 text-center text-gray-400">No files uploaded</div>
            ) : (
              files.map((file, index) => {
                const size = file.size || file.sizeOriginal || 0;

                return (
                  <div
                    key={file.$id}
                    className={`grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-light-400/10 transition-colors ${
                      index !== files.length - 1 ? 'border-b border-light-400' : ''
                    }`}
                  >
                    <div className="col-span-5 text-light-100 font-light">
                      <Link href={file.url || '#'} target="_blank" className="flex items-center gap-3 hover:text-white transition-colors">
                        <Thumbnail
                          type={file.type || ''}
                          extension={file.extension || ''}
                          url={file.url}
                        />
                        <span className='overflow-hidden'>{file.fullName}</span>
                      </Link>
                    </div>

                    <div className="col-span-5 text-text-grey font-light">
                      {formatDate(file.$updatedAt)}
                    </div>

                    <div className="col-span-1 text-text-grey font-light">
                      {formatFileSize(size)}
                    </div>

                    <div className="col-span-1 flex justify-end">
                      <ActionDropdown file={file} />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;