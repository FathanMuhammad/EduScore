import React, { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import Input from './Input';

export default function Table({
  columns = [], // Array of { key, label, sortable }
  data = [], // Array of objects
  searchPlaceholder = 'Cari data...',
  searchKeys = [], // Keys to search by, e.g. ['nama', 'nis']
  renderRow, // Function: (item, index) => ReactNode
  itemsPerPage = 10,
  emptyMessage = 'Tidak ada data ditemukan.'
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: '', direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);

  // Handle Sort Click
  const handleSort = (key, sortable) => {
    if (!sortable) return;
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
    setCurrentPage(1);
  };

  // Filter Data
  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return data;

    const term = searchTerm.toLowerCase().trim();
    return data.filter(item => {
      // If specific search keys are provided
      if (searchKeys.length > 0) {
        return searchKeys.some(key => {
          const val = item[key];
          return val ? String(val).toLowerCase().includes(term) : false;
        });
      }
      // Otherwise, search all values
      return Object.values(item).some(val => 
        val ? String(val).toLowerCase().includes(term) : false
      );
    });
  }, [data, searchTerm, searchKeys]);

  // Sort Data
  const sortedData = useMemo(() => {
    const sortableItems = [...filteredData];
    if (sortConfig.key !== '') {
      sortableItems.sort((a, b) => {
        const valA = a[sortConfig.key];
        const valB = b[sortConfig.key];

        if (valA === undefined || valA === null) return 1;
        if (valB === undefined || valB === null) return -1;

        const comparison = String(valA).localeCompare(String(valB), undefined, { numeric: true });
        return sortConfig.direction === 'asc' ? comparison : -comparison;
      });
    }
    return sortableItems;
  }, [filteredData, sortConfig]);

  // Paginated Data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedData.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedData, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(sortedData.length / itemsPerPage) || 1;

  // Change Page
  const goToPage = (page) => {
    const pageNumber = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(pageNumber);
  };

  return (
    <div className="bg-white rounded-xl border border-navy-100 overflow-hidden shadow-sm">
      {/* Table Toolbar */}
      {searchKeys.length > 0 && (
        <div className="p-4 border-b border-navy-50 bg-navy-50/20 flex items-center justify-between">
          <div className="relative w-full max-w-xs">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-navy-400" />
            </div>
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-navy-200 focus:outline-none focus:border-navy-500 focus:ring-1 focus:ring-navy-500 bg-white"
            />
          </div>
          <span className="text-xs text-navy-500 font-medium">
            Total: {sortedData.length} baris
          </span>
        </div>
      )}

      {/* Table Element */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-navy-800 text-white select-none">
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key, col.sortable)}
                  className={`
                    px-6 py-3.5 text-xs font-bold uppercase tracking-wider
                    ${col.sortable ? 'cursor-pointer hover:bg-navy-900 transition-colors' : ''}
                  `}
                >
                  <div className="flex items-center space-x-1">
                    <span>{col.label}</span>
                    {col.sortable && sortConfig.key === col.key && (
                      sortConfig.direction === 'asc' ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />
                    )}
                    {col.sortable && sortConfig.key !== col.key && (
                      <ChevronDown className="w-3.5 h-3.5 opacity-30 group-hover:opacity-100" />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-navy-50">
            {paginatedData.length > 0 ? (
              paginatedData.map((item, index) => renderRow(item, (currentPage - 1) * itemsPerPage + index))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center text-sm font-medium text-navy-500 bg-navy-50/10">
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="px-6 py-4 bg-navy-50/20 border-t border-navy-50 flex items-center justify-between">
          <div className="text-xs font-semibold text-navy-600">
            Halaman {currentPage} dari {totalPages}
          </div>
          <div className="flex items-center space-x-1.5">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className={`
                p-1.5 rounded-lg border border-navy-200 transition-colors bg-white
                ${currentPage === 1 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-navy-50 text-navy-800'}
              `}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
              // Only render adjacent pages if there are many pages
              if (
                totalPages > 6 &&
                page !== 1 &&
                page !== totalPages &&
                Math.abs(page - currentPage) > 1
              ) {
                if (page === 2 || page === totalPages - 1) {
                  return <span key={page} className="px-1.5 text-navy-400">...</span>;
                }
                return null;
              }

              return (
                <button
                  key={page}
                  onClick={() => goToPage(page)}
                  className={`
                    px-3 py-1.5 text-xs font-bold rounded-lg border transition-colors
                    ${currentPage === page
                      ? 'bg-navy-800 border-navy-800 text-white'
                      : 'border-navy-200 bg-white text-navy-700 hover:bg-navy-50'}
                  `}
                >
                  {page}
                </button>
              );
            })}

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`
                p-1.5 rounded-lg border border-navy-200 transition-colors bg-white
                ${currentPage === totalPages ? 'opacity-40 cursor-not-allowed' : 'hover:bg-navy-50 text-navy-800'}
              `}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
