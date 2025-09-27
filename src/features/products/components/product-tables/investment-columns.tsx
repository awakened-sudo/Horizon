'use client';
import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import { Investment } from '@/constants/data';
import { Column, ColumnDef } from '@tanstack/react-table';
import { TrendingDown, TrendingUp, Text } from 'lucide-react';
// import { CellAction } from './cell-action';
import { INVESTMENT_TYPE_OPTIONS } from './investment-options';

export const investmentColumns: ColumnDef<Investment>[] = [
  {
    id: 'symbol',
    accessorKey: 'symbol',
    header: ({ column }: { column: Column<Investment, unknown> }) => (
      <DataTableColumnHeader column={column} title='Symbol' />
    ),
    cell: ({ cell }) => (
      <div className='text-lg font-bold'>
        {cell.getValue<Investment['symbol']>()}
      </div>
    ),
    meta: {
      label: 'Symbol',
      placeholder: 'Search symbols...',
      variant: 'text',
      icon: Text
    },
    enableColumnFilter: true
  },
  {
    id: 'name',
    accessorKey: 'name',
    header: ({ column }: { column: Column<Investment, unknown> }) => (
      <DataTableColumnHeader column={column} title='Name' />
    ),
    cell: ({ cell }) => <div>{cell.getValue<Investment['name']>()}</div>,
    meta: {
      label: 'Name',
      placeholder: 'Search investments...',
      variant: 'text',
      icon: Text
    },
    enableColumnFilter: true
  },
  {
    id: 'type',
    accessorKey: 'type',
    header: ({ column }: { column: Column<Investment, unknown> }) => (
      <DataTableColumnHeader column={column} title='Type' />
    ),
    cell: ({ cell }) => {
      const type = cell.getValue<Investment['type']>();
      return (
        <Badge variant='outline' className='capitalize'>
          {type}
        </Badge>
      );
    },
    enableColumnFilter: true,
    meta: {
      label: 'types',
      variant: 'multiSelect',
      options: INVESTMENT_TYPE_OPTIONS
    }
  },
  {
    accessorKey: 'quantity',
    header: 'Quantity',
    cell: ({ cell }) => {
      const quantity = cell.getValue<Investment['quantity']>();
      return <div className='text-right'>{quantity}</div>;
    }
  },
  {
    accessorKey: 'current_price',
    header: 'Current Price',
    cell: ({ cell }) => {
      const price = cell.getValue<Investment['current_price']>();
      return <div className='text-right'>${price.toFixed(2)}</div>;
    }
  },
  {
    accessorKey: 'market_value',
    header: 'Market Value',
    cell: ({ cell }) => {
      const value = cell.getValue<Investment['market_value']>();
      return (
        <div className='text-right font-semibold'>
          ${value.toLocaleString()}
        </div>
      );
    }
  },
  {
    accessorKey: 'gain_loss_percentage',
    header: 'Gain/Loss %',
    cell: ({ cell }) => {
      const percentage = cell.getValue<Investment['gain_loss_percentage']>();
      const isPositive = percentage >= 0;
      const Icon = isPositive ? TrendingUp : TrendingDown;

      return (
        <div
          className={`flex items-center gap-1 ${
            isPositive ? 'text-green-600' : 'text-red-600'
          }`}
        >
          <Icon className='h-4 w-4' />
          {isPositive ? '+' : ''}
          {percentage.toFixed(2)}%
        </div>
      );
    }
  },
  {
    accessorKey: 'gain_loss',
    header: 'Gain/Loss $',
    cell: ({ cell }) => {
      const gainLoss = cell.getValue<Investment['gain_loss']>();
      const isPositive = gainLoss >= 0;

      return (
        <div
          className={`text-right font-medium ${
            isPositive ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {isPositive ? '+' : ''}${gainLoss.toLocaleString()}
        </div>
      );
    }
  }
  // Actions column temporarily disabled
  // {
  //   id: 'actions',
  //   cell: ({ row }) => <CellAction data={row.original} />
  // }
];
