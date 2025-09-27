'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { IconUpload, IconFile, IconX, IconCheck } from '@tabler/icons-react';
import { useDataAnalysisStore } from '../utils/store';

interface UploadedFile {
  file: File;
  id: string;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  progress: number;
  data?: any[];
  headers?: string[];
  error?: string;
}

export function CSVUploader() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const { setData, setHeaders } = useDataAnalysisStore();

  const processCSV = useCallback(
    async (file: File): Promise<{ data: any[]; headers: string[] }> => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const text = e.target?.result as string;
            const lines = text.split('\n').filter((line) => line.trim());

            if (lines.length === 0) {
              reject(new Error('Empty file'));
              return;
            }

            // Simple CSV parsing (we'll enhance this later with papaparse)
            const headers = lines[0]
              .split(',')
              .map((h) => h.trim().replace(/"/g, ''));
            const data = lines.slice(1).map((line, index) => {
              const values = line
                .split(',')
                .map((v) => v.trim().replace(/"/g, ''));
              const row: any = { _id: index };
              headers.forEach((header, i) => {
                const value = values[i] || '';
                // Try to parse as number
                const numValue = parseFloat(value);
                row[header] = isNaN(numValue) ? value : numValue;
              });
              return row;
            });

            resolve({ data, headers });
          } catch (error) {
            reject(error);
          }
        };
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsText(file);
      });
    },
    []
  );

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const newFiles: UploadedFile[] = acceptedFiles.map((file) => ({
        file,
        id: Math.random().toString(36).substr(2, 9),
        status: 'uploading',
        progress: 0
      }));

      setUploadedFiles((prev) => [...prev, ...newFiles]);

      // Process each file
      for (const fileObj of newFiles) {
        try {
          // Update progress
          setUploadedFiles((prev) =>
            prev.map((f) =>
              f.id === fileObj.id
                ? { ...f, status: 'processing', progress: 50 }
                : f
            )
          );

          const { data, headers } = await processCSV(fileObj.file);

          // Update with completed data
          setUploadedFiles((prev) =>
            prev.map((f) =>
              f.id === fileObj.id
                ? {
                    ...f,
                    status: 'completed',
                    progress: 100,
                    data,
                    headers
                  }
                : f
            )
          );

          // Set as active data in store
          setData(data);
          setHeaders(headers);
        } catch (error) {
          setUploadedFiles((prev) =>
            prev.map((f) =>
              f.id === fileObj.id
                ? {
                    ...f,
                    status: 'error',
                    progress: 0,
                    error:
                      error instanceof Error ? error.message : 'Unknown error'
                  }
                : f
            )
          );
        }
      }
    },
    [processCSV, setData, setHeaders]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [
        '.xlsx'
      ]
    },
    multiple: true
  });

  const removeFile = (id: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const loadSampleData = () => {
    const sampleData = [
      {
        Date: '2024-01-01',
        Income: 5000,
        Expenses: 3200,
        Category: 'Salary',
        Description: 'Monthly salary'
      },
      {
        Date: '2024-01-02',
        Income: 0,
        Expenses: 150,
        Category: 'Food',
        Description: 'Groceries'
      },
      {
        Date: '2024-01-03',
        Income: 200,
        Expenses: 0,
        Category: 'Freelance',
        Description: 'Side project'
      },
      {
        Date: '2024-01-04',
        Income: 0,
        Expenses: 80,
        Category: 'Transport',
        Description: 'Gas'
      },
      {
        Date: '2024-01-05',
        Income: 0,
        Expenses: 1200,
        Category: 'Housing',
        Description: 'Rent'
      },
      {
        Date: '2024-01-06',
        Income: 0,
        Expenses: 45,
        Category: 'Food',
        Description: 'Lunch'
      },
      {
        Date: '2024-01-07',
        Income: 100,
        Expenses: 0,
        Category: 'Investment',
        Description: 'Dividend'
      },
      {
        Date: '2024-01-08',
        Income: 0,
        Expenses: 200,
        Category: 'Utilities',
        Description: 'Electric bill'
      },
      {
        Date: '2024-01-09',
        Income: 0,
        Expenses: 75,
        Category: 'Entertainment',
        Description: 'Movie tickets'
      },
      {
        Date: '2024-01-10',
        Income: 0,
        Expenses: 300,
        Category: 'Healthcare',
        Description: 'Doctor visit'
      }
    ];

    const headers = ['Date', 'Income', 'Expenses', 'Category', 'Description'];
    setData(sampleData);
    setHeaders(headers);

    // Add to uploaded files list
    const sampleFile: UploadedFile = {
      file: new File([''], 'sample-financial-data.csv', { type: 'text/csv' }),
      id: 'sample-data',
      status: 'completed',
      progress: 100,
      data: sampleData,
      headers
    };

    setUploadedFiles((prev) => [
      sampleFile,
      ...prev.filter((f) => f.id !== 'sample-data')
    ]);
  };

  return (
    <div className='space-y-6'>
      <Card>
        <CardHeader>
          <CardTitle>Upload CSV Files</CardTitle>
          <CardDescription>
            Upload your financial data in CSV format for analysis and
            visualization
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div
            {...getRootProps()}
            className={`cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
              isDragActive
                ? 'border-primary bg-primary/5'
                : 'border-muted-foreground/25 hover:border-primary/50'
            }`}
          >
            <input {...getInputProps()} />
            <IconUpload className='text-muted-foreground mx-auto mb-4 h-12 w-12' />
            {isDragActive ? (
              <p className='text-lg font-medium'>Drop the files here...</p>
            ) : (
              <div>
                <p className='mb-2 text-lg font-medium'>
                  Drag & drop CSV files here, or click to select
                </p>
                <p className='text-muted-foreground text-sm'>
                  Supports CSV, XLS, and XLSX files
                </p>
              </div>
            )}
          </div>

          <div className='flex justify-center'>
            <Button variant='outline' onClick={loadSampleData}>
              Load Sample Financial Data
            </Button>
          </div>
        </CardContent>
      </Card>

      {uploadedFiles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Uploaded Files</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {uploadedFiles.map((fileObj) => (
                <div
                  key={fileObj.id}
                  className='flex items-center space-x-4 rounded-lg border p-4'
                >
                  <IconFile className='text-muted-foreground h-8 w-8' />
                  <div className='flex-1 space-y-2'>
                    <div className='flex items-center justify-between'>
                      <span className='font-medium'>{fileObj.file.name}</span>
                      <div className='flex items-center space-x-2'>
                        <Badge
                          variant={
                            fileObj.status === 'completed'
                              ? 'default'
                              : fileObj.status === 'error'
                                ? 'destructive'
                                : 'secondary'
                          }
                        >
                          {fileObj.status === 'completed' && (
                            <IconCheck className='mr-1 h-3 w-3' />
                          )}
                          {fileObj.status}
                        </Badge>
                        <Button
                          variant='ghost'
                          size='sm'
                          onClick={() => removeFile(fileObj.id)}
                        >
                          <IconX className='h-4 w-4' />
                        </Button>
                      </div>
                    </div>

                    {fileObj.status !== 'completed' && (
                      <Progress value={fileObj.progress} className='h-2' />
                    )}

                    {fileObj.status === 'completed' && fileObj.data && (
                      <p className='text-muted-foreground text-sm'>
                        {fileObj.data.length} rows, {fileObj.headers?.length}{' '}
                        columns
                      </p>
                    )}

                    {fileObj.status === 'error' && (
                      <p className='text-destructive text-sm'>
                        {fileObj.error}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
