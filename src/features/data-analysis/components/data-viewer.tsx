'use client';

import { useState, useMemo } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/ui/table/data-table';
import { DataTableToolbar } from '@/components/ui/table/data-table-toolbar';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import { useDataTable } from '@/hooks/use-data-table';
import { ColumnDef } from '@tanstack/react-table';
import { IconDownload, IconFilter, IconX } from '@tabler/icons-react';
import { useDataAnalysisStore, DataRow } from '../utils/store';

export function DataViewer() {
  const { data, headers, filteredData, filters, setFilters, exportData } =
    useDataAnalysisStore();

  const [localFilters, setLocalFilters] = useState<Record<string, string>>({});

  // Create dynamic columns based on headers
  const columns: ColumnDef<DataRow>[] = useMemo(() => {
    return headers.map((header) => ({
      accessorKey: header,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={header} />
      ),
      cell: ({ getValue }) => {
        const value = getValue();

        // Format numbers
        if (typeof value === 'number') {
          if (
            header.toLowerCase().includes('amount') ||
            header.toLowerCase().includes('price') ||
            header.toLowerCase().includes('income') ||
            header.toLowerCase().includes('expense')
          ) {
            return <span className='font-mono'>${value.toLocaleString()}</span>;
          }
          return <span className='font-mono'>{value.toLocaleString()}</span>;
        }

        // Format dates
        if (
          header.toLowerCase().includes('date') &&
          typeof value === 'string'
        ) {
          try {
            const date = new Date(value);
            if (!isNaN(date.getTime())) {
              return (
                <span className='text-muted-foreground'>
                  {date.toLocaleDateString()}
                </span>
              );
            }
          } catch (e) {
            // Not a valid date, return as is
          }
        }

        return <span>{String(value)}</span>;
      },
      enableSorting: true,
      enableColumnFilter: true,
      // Custom sorting function for dates
      sortingFn: header.toLowerCase().includes('date')
        ? (rowA, rowB, columnId) => {
            const dateA = new Date(rowA.getValue(columnId) as string);
            const dateB = new Date(rowB.getValue(columnId) as string);
            return dateA.getTime() - dateB.getTime();
          }
        : 'auto'
    }));
  }, [headers]);

  // Check if any filters are active
  const hasActiveFilters = Object.keys(filters).length > 0;
  const displayData = hasActiveFilters ? filteredData : data;

  const { table } = useDataTable({
    data: displayData,
    columns,
    pageCount: Math.ceil(displayData.length / 10),
    shallow: false,
    debounceMs: 500,
    initialState: {
      sorting: [],
      columnFilters: [],
      pagination: { pageIndex: 0, pageSize: 10 }
    }
  });

  const applyFilters = () => {
    const activeFilters = Object.fromEntries(
      Object.entries(localFilters).filter(([, value]) => value.trim() !== '')
    );
    setFilters(activeFilters);
  };

  const clearFilters = () => {
    setLocalFilters({});
    setFilters({});
  };

  if (data.length === 0) {
    return (
      <Card>
        <CardContent className='flex flex-col items-center justify-center py-12'>
          <div className='space-y-2 text-center'>
            <h3 className='text-lg font-semibold'>No Data Available</h3>
            <p className='text-muted-foreground'>
              Upload a CSV file to start viewing and analyzing your data.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Data Summary */}
      <div className='grid grid-cols-1 gap-4 md:grid-cols-4'>
        <Card>
          <CardContent className='p-4'>
            <div className='text-2xl font-bold'>
              {data.length.toLocaleString()}
            </div>
            <p className='text-muted-foreground text-sm'>Total Rows</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className='p-4'>
            <div className='text-2xl font-bold'>{headers.length}</div>
            <p className='text-muted-foreground text-sm'>Columns</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className='p-4'>
            <div className='text-2xl font-bold'>
              {displayData.length.toLocaleString()}
            </div>
            <p className='text-muted-foreground text-sm'>Filtered Rows</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className='p-4'>
            <div className='text-2xl font-bold'>
              {Object.keys(filters).length}
            </div>
            <p className='text-muted-foreground text-sm'>Active Filters</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <div>
              <CardTitle>Filters</CardTitle>
              <CardDescription>Filter data by column values</CardDescription>
            </div>
            <div className='flex items-center space-x-2'>
              <Button variant='outline' size='sm' onClick={applyFilters}>
                <IconFilter className='mr-2 h-4 w-4' />
                Apply Filters
              </Button>
              <Button variant='outline' size='sm' onClick={clearFilters}>
                <IconX className='mr-2 h-4 w-4' />
                Clear All
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4'>
            {headers.map((header) => (
              <div key={header} className='space-y-2'>
                <label className='text-sm font-medium'>{header}</label>
                <Input
                  placeholder={`Filter by ${header}...`}
                  value={localFilters[header] || ''}
                  onChange={(e) =>
                    setLocalFilters((prev) => ({
                      ...prev,
                      [header]: e.target.value
                    }))
                  }
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      applyFilters();
                    }
                  }}
                />
              </div>
            ))}
          </div>

          {Object.keys(filters).length > 0 && (
            <div className='mt-4 flex flex-wrap gap-2'>
              <span className='text-sm font-medium'>Active filters:</span>
              {Object.entries(filters).map(([column, value]) => (
                <Badge
                  key={column}
                  variant='secondary'
                  className='flex items-center gap-1'
                >
                  {column}: {value}
                  <IconX
                    className='h-3 w-3 cursor-pointer'
                    onClick={() => {
                      const newFilters = { ...filters };
                      delete newFilters[column];
                      setFilters(newFilters);
                      setLocalFilters((prev) => {
                        const newLocal = { ...prev };
                        delete newLocal[column];
                        return newLocal;
                      });
                    }}
                  />
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <div>
              <CardTitle>Data Table</CardTitle>
              <CardDescription>
                Showing {displayData.length} of {data.length} rows
              </CardDescription>
            </div>
            <div className='flex items-center space-x-2'>
              <Button
                variant='outline'
                size='sm'
                onClick={() => exportData('csv')}
              >
                <IconDownload className='mr-2 h-4 w-4' />
                Export CSV
              </Button>
              <Button
                variant='outline'
                size='sm'
                onClick={() => exportData('json')}
              >
                <IconDownload className='mr-2 h-4 w-4' />
                Export JSON
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {displayData.length > 0 ? (
            <div className='flex h-[600px] flex-col'>
              <DataTable table={table}>
                <DataTableToolbar table={table} />
              </DataTable>
            </div>
          ) : (
            <div className='py-8 text-center'>
              <p className='text-muted-foreground'>
                No data matches the current filters.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Column Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Column Statistics</CardTitle>
          <CardDescription>
            Basic statistics for numeric columns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
            {headers.map((header) => {
              const values = displayData
                .map((row) => row[header])
                .filter((val) => typeof val === 'number');

              if (values.length === 0) return null;

              const sum = values.reduce((acc, val) => acc + val, 0);
              const avg = sum / values.length;
              const min = Math.min(...values);
              const max = Math.max(...values);

              return (
                <div key={header} className='space-y-2 rounded-lg border p-4'>
                  <h4 className='font-semibold'>{header}</h4>
                  <div className='grid grid-cols-2 gap-2 text-sm'>
                    <div>
                      <span className='text-muted-foreground'>Count:</span>
                      <span className='ml-2 font-mono'>{values.length}</span>
                    </div>
                    <div>
                      <span className='text-muted-foreground'>Sum:</span>
                      <span className='ml-2 font-mono'>
                        {sum.toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className='text-muted-foreground'>Average:</span>
                      <span className='ml-2 font-mono'>{avg.toFixed(2)}</span>
                    </div>
                    <div>
                      <span className='text-muted-foreground'>Min:</span>
                      <span className='ml-2 font-mono'>
                        {min.toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className='text-muted-foreground'>Max:</span>
                      <span className='ml-2 font-mono'>
                        {max.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
