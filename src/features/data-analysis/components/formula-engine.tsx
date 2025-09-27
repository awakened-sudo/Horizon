'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  IconCalculator,
  IconTrash,
  IconPlayerPlay,
  IconCopy
} from '@tabler/icons-react';
import { useDataAnalysisStore } from '../utils/store';

const FORMULA_EXAMPLES = [
  {
    name: 'SUM',
    formula: 'SUM(Income)',
    description: 'Sum all values in Income column'
  },
  {
    name: 'AVG',
    formula: 'AVG(Expenses)',
    description: 'Average of all values in Expenses column'
  },
  {
    name: 'COUNT',
    formula: 'COUNT(Category)',
    description: 'Count non-empty values in Category column'
  },
  {
    name: 'MAX',
    formula: 'MAX(Income)',
    description: 'Maximum value in Income column'
  },
  {
    name: 'MIN',
    formula: 'MIN(Expenses)',
    description: 'Minimum value in Expenses column'
  }
];

export function FormulaEngine() {
  const { data, headers, formulas, executeFormula, deleteFormula } =
    useDataAnalysisStore();

  const [currentFormula, setCurrentFormula] = useState('');
  const [selectedColumn, setSelectedColumn] = useState('none');

  const handleExecuteFormula = () => {
    if (!currentFormula.trim()) return;
    executeFormula(
      currentFormula,
      selectedColumn === 'none' ? undefined : selectedColumn
    );
    setCurrentFormula('');
  };

  const copyFormula = (formula: string) => {
    setCurrentFormula(formula);
  };

  const formatResult = (result: any): string => {
    if (typeof result === 'number') {
      return result.toLocaleString();
    }
    return String(result);
  };

  if (data.length === 0) {
    return (
      <Card>
        <CardContent className='flex flex-col items-center justify-center py-12'>
          <div className='space-y-2 text-center'>
            <IconCalculator className='text-muted-foreground mx-auto h-12 w-12' />
            <h3 className='text-lg font-semibold'>No Data Available</h3>
            <p className='text-muted-foreground'>
              Upload data to start using formulas and calculations.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Formula Input */}
      <Card>
        <CardHeader>
          <CardTitle>Formula Calculator</CardTitle>
          <CardDescription>
            Execute formulas on your data columns. Supports SUM, AVG, COUNT,
            MAX, MIN functions.
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <div className='space-y-2'>
              <Label htmlFor='formula-input'>Formula</Label>
              <div className='flex space-x-2'>
                <Input
                  id='formula-input'
                  placeholder='e.g., SUM(Income) or AVG(Expenses)'
                  value={currentFormula}
                  onChange={(e) => setCurrentFormula(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleExecuteFormula();
                    }
                  }}
                />
                <Button onClick={handleExecuteFormula}>
                  <IconPlayerPlay className='h-4 w-4' />
                </Button>
              </div>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='column-select'>Target Column (Optional)</Label>
              <Select value={selectedColumn} onValueChange={setSelectedColumn}>
                <SelectTrigger>
                  <SelectValue placeholder='Select column for context' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='none'>None</SelectItem>
                  {headers.map((header) => (
                    <SelectItem key={header} value={header}>
                      {header}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Formula Examples */}
      <Card>
        <CardHeader>
          <CardTitle>Formula Examples</CardTitle>
          <CardDescription>
            Click to copy these example formulas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
            {FORMULA_EXAMPLES.map((example) => (
              <div
                key={example.name}
                className='space-y-2 rounded-lg border p-4'
              >
                <div className='flex items-center justify-between'>
                  <Badge variant='outline'>{example.name}</Badge>
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={() => copyFormula(example.formula)}
                  >
                    <IconCopy className='h-4 w-4' />
                  </Button>
                </div>
                <code className='bg-muted block rounded p-2 text-sm'>
                  {example.formula}
                </code>
                <p className='text-muted-foreground text-xs'>
                  {example.description}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Available Columns */}
      <Card>
        <CardHeader>
          <CardTitle>Available Columns</CardTitle>
          <CardDescription>
            Use these column names in your formulas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='flex flex-wrap gap-2'>
            {headers.map((header) => {
              const sampleValues = data.slice(0, 5).map((row) => row[header]);
              const isNumeric = sampleValues.some(
                (val) => typeof val === 'number'
              );

              return (
                <Badge
                  key={header}
                  variant={isNumeric ? 'default' : 'secondary'}
                  className='cursor-pointer'
                  onClick={() => setCurrentFormula((prev) => prev + header)}
                >
                  {header}
                  {isNumeric && <span className='ml-1 text-xs'>(#)</span>}
                </Badge>
              );
            })}
          </div>
          <p className='text-muted-foreground mt-2 text-xs'>
            Columns marked with (#) contain numeric data and work with
            mathematical functions.
          </p>
        </CardContent>
      </Card>

      {/* Formula Results */}
      {formulas.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Formula Results</CardTitle>
            <CardDescription>Your calculated results</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {formulas.map((formula) => (
                <div
                  key={formula.id}
                  className='flex items-center justify-between rounded-lg border p-4'
                >
                  <div className='space-y-1'>
                    <div className='flex items-center space-x-2'>
                      <code className='bg-muted rounded px-2 py-1 text-sm'>
                        {formula.formula}
                      </code>
                      {formula.column && (
                        <Badge variant='outline' className='text-xs'>
                          {formula.column}
                        </Badge>
                      )}
                    </div>
                    <div className='text-2xl font-bold'>
                      {formula.error ? (
                        <span className='text-destructive text-sm'>
                          {formula.error}
                        </span>
                      ) : (
                        formatResult(formula.result)
                      )}
                    </div>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={() => copyFormula(formula.formula)}
                    >
                      <IconCopy className='h-4 w-4' />
                    </Button>
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={() => deleteFormula(formula.id)}
                    >
                      <IconTrash className='h-4 w-4' />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Formula Documentation */}
      <Card>
        <CardHeader>
          <CardTitle>Supported Functions</CardTitle>
          <CardDescription>
            Complete list of available formula functions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              <div className='space-y-2'>
                <h4 className='font-semibold'>Mathematical Functions</h4>
                <ul className='text-muted-foreground space-y-1 text-sm'>
                  <li>
                    <code>SUM(column)</code> - Sum all numeric values
                  </li>
                  <li>
                    <code>AVG(column)</code> - Calculate average
                  </li>
                  <li>
                    <code>MAX(column)</code> - Find maximum value
                  </li>
                  <li>
                    <code>MIN(column)</code> - Find minimum value
                  </li>
                </ul>
              </div>

              <div className='space-y-2'>
                <h4 className='font-semibold'>Statistical Functions</h4>
                <ul className='text-muted-foreground space-y-1 text-sm'>
                  <li>
                    <code>COUNT(column)</code> - Count non-empty values
                  </li>
                  <li>More functions coming soon...</li>
                </ul>
              </div>
            </div>

            <div className='bg-muted rounded-lg p-4'>
              <h4 className='mb-2 font-semibold'>Usage Tips</h4>
              <ul className='text-muted-foreground space-y-1 text-sm'>
                <li>• Column names are case-sensitive</li>
                <li>
                  • Use exact column names as shown in the Available Columns
                  section
                </li>
                <li>• Functions work best with numeric columns</li>
                <li>
                  • Results are calculated based on the current filtered data
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
