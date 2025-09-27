'use client';

import { IconTrendingUp } from '@tabler/icons-react';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';

const chartData = [
  { month: 'January', netWorth: 98500, assets: 152000, liabilities: 53500 },
  { month: 'February', netWorth: 102300, assets: 156800, liabilities: 54500 },
  { month: 'March', netWorth: 105200, assets: 160200, liabilities: 55000 },
  { month: 'April', netWorth: 108900, assets: 164400, liabilities: 55500 },
  { month: 'May', netWorth: 112800, assets: 169300, liabilities: 56500 },
  { month: 'June', netWorth: 116200, assets: 173700, liabilities: 57500 },
  { month: 'July', netWorth: 119500, assets: 177200, liabilities: 57700 },
  { month: 'August', netWorth: 122100, assets: 180800, liabilities: 58700 },
  { month: 'September', netWorth: 125450, assets: 185200, liabilities: 59750 }
];

const chartConfig = {
  netWorth: {
    label: 'Net Worth',
    color: 'hsl(var(--chart-1))'
  },
  assets: {
    label: 'Assets',
    color: 'hsl(var(--chart-2))'
  },
  liabilities: {
    label: 'Liabilities',
    color: 'hsl(var(--chart-3))'
  }
} satisfies ChartConfig;

export function AreaGraph() {
  return (
    <Card className='@container/card'>
      <CardHeader>
        <CardTitle>Net Worth Trend</CardTitle>
        <CardDescription>
          Net worth growth over the past 9 months
        </CardDescription>
      </CardHeader>
      <CardContent className='px-2 pt-4 sm:px-6 sm:pt-6'>
        <ChartContainer
          config={chartConfig}
          className='aspect-auto h-[250px] w-full'
        >
          <AreaChart
            data={chartData}
            margin={{
              left: 12,
              right: 12
            }}
          >
            <defs>
              <linearGradient id='fillNetWorth' x1='0' y1='0' x2='0' y2='1'>
                <stop
                  offset='5%'
                  stopColor='var(--color-netWorth)'
                  stopOpacity={0.8}
                />
                <stop
                  offset='95%'
                  stopColor='var(--color-netWorth)'
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey='month'
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator='dot' />}
            />
            <Area
              dataKey='netWorth'
              type='natural'
              fill='url(#fillNetWorth)'
              stroke='var(--color-netWorth)'
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className='flex w-full items-start gap-2 text-sm'>
          <div className='grid gap-2'>
            <div className='flex items-center gap-2 leading-none font-medium'>
              Net worth increased by 27.4% this year{' '}
              <IconTrendingUp className='h-4 w-4' />
            </div>
            <div className='text-muted-foreground flex items-center gap-2 leading-none'>
              January - September 2024
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
