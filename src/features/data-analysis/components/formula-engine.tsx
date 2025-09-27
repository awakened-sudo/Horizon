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
    <div className='flex flex-1 flex-col space-y-6'>
      <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
        {/* Formula Input */}
        <Card className='@container/formula-input'>
          <CardHeader>
            <CardTitle>Formula Calculator</CardTitle>
            <CardDescription>
              Execute Excel-like formulas on your data
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
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
          </CardContent>
        </Card>

        {/* Formula Examples */}
        <Card className='@container/formula-examples'>
          <CardHeader>
            <CardTitle>Formula Examples</CardTitle>
            <CardDescription>
              Click to copy these example formulas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-1 gap-3 @[300px]/formula-examples:grid-cols-2'>
              {FORMULA_EXAMPLES.map((example) => (
                <div
                  key={example.name}
                  className='space-y-2 rounded-lg border p-3'
                >
                  <div className='flex items-center justify-between'>
                    <Badge variant='outline'>{example.name}</Badge>
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={() => copyFormula(example.formula)}
                    >
                      <IconCopy className='h-3 w-3' />
                    </Button>
                  </div>
                  <code className='bg-muted block rounded px-2 py-1 text-sm'>
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
      </div>

      {/* Formula Results */}
      {formulas.length > 0 && (
        <Card className='@container/formula-results'>
          <CardHeader>
            <CardTitle>Formula Results ({formulas.length})</CardTitle>
            <CardDescription>Your calculated results</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-1 gap-4 @[600px]/formula-results:grid-cols-2'>
              {formulas.map((formula) => (
                <div
                  key={formula.id}
                  className='flex items-center justify-between rounded-lg border p-4'
                >
                  <div className='min-w-0 flex-1 space-y-1'>
                    <div className='flex items-center space-x-2'>
                      <code className='bg-muted truncate rounded px-2 py-1 text-sm'>
                        {formula.formula}
                      </code>
                      {formula.column && (
                        <Badge
                          variant='secondary'
                          className='flex-shrink-0 text-xs'
                        >
                          {formula.column}
                        </Badge>
                      )}
                    </div>
                    <div className='text-primary text-2xl font-bold'>
                      {formatResult(formula.result)}
                    </div>
                  </div>
                  <div className='flex flex-shrink-0 items-center space-x-2'>
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
    </div>
  );
}
