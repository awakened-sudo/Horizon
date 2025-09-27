'use client';

import * as React from 'react';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';

export const description = 'Monthly Income vs Expenses';

const chartData = [
  { month: '2024-01', income: 8500, expenses: 6200 },
  { month: '2024-02', income: 8500, expenses: 5800 },
  { month: '2024-03', income: 8500, expenses: 6400 },
  { month: '2024-04', income: 8750, expenses: 6100 },
  { month: '2024-05', income: 8750, expenses: 6300 },
  { month: '2024-06', income: 9000, expenses: 6500 },
  { month: '2024-07', income: 9000, expenses: 6200 },
  { month: '2024-08', income: 9000, expenses: 6800 },
  { month: '2024-09', income: 9250, expenses: 6400 },
  { month: '2024-10', income: 9250, expenses: 6600 },
  { month: '2024-11', income: 9500, expenses: 6900 },
  { month: '2024-12', income: 9500, expenses: 7200 }
];

const chartConfig = {
  cashflow: {
    label: 'Cash Flow'
  },
  income: {
    label: 'Income',
    color: 'hsl(var(--chart-1))'
  },
  expenses: {
    label: 'Expenses',
    color: 'hsl(var(--chart-2))'
  },
  error: {
    label: 'Error',
    color: 'var(--primary)'
  }
} satisfies ChartConfig;

export function BarGraph() {
  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>('income');

  const total = React.useMemo(
    () => ({
      income: chartData.reduce((acc, curr) => acc + curr.income, 0),
      expenses: chartData.reduce((acc, curr) => acc + curr.expenses, 0)
    }),
    []
  );

  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  React.useEffect(() => {
    if (activeChart === 'error') {
      throw new Error('Mocking Error');
    }
  }, [activeChart]);

  if (!isClient) {
    return null;
  }

  return (
    <Card className='@container/card !pt-3'>
      <CardHeader className='flex flex-col items-stretch space-y-0 border-b !p-0 sm:flex-row'>
        <div className='flex flex-1 flex-col justify-center gap-1 px-6 !py-0'>
          <CardTitle>Income vs Expenses</CardTitle>
          <CardDescription>
            <span className='hidden @[540px]/card:block'>
              Monthly cash flow for 2024
            </span>
            <span className='@[540px]/card:hidden'>2024 Cash Flow</span>
          </CardDescription>
        </div>
        <div className='flex'>
          {['income', 'expenses'].map((key) => {
            const chart = key as keyof typeof chartConfig;
            if (!chart || total[key as keyof typeof total] === 0) return null;
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className='data-[active=true]:bg-primary/5 hover:bg-primary/5 relative flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left transition-colors duration-200 even:border-l sm:border-t-0 sm:border-l sm:px-8 sm:py-6'
                onClick={() => setActiveChart(chart)}
              >
                <span className='text-muted-foreground text-xs'>
                  {chartConfig[chart].label}
                </span>
                <span className='text-lg leading-none font-bold sm:text-3xl'>
                  ${total[key as keyof typeof total]?.toLocaleString()}
                </span>
              </button>
            );
          })}
        </div>
      </CardHeader>
      <CardContent className='px-2 pt-4 sm:px-6 sm:pt-6'>
        <ChartContainer
          config={chartConfig}
          className='aspect-auto h-[250px] w-full'
        >
          <BarChart
            data={chartData}
            margin={{
              left: 12,
              right: 12
            }}
          >
            <defs>
              <linearGradient id='fillBar' x1='0' y1='0' x2='0' y2='1'>
                <stop
                  offset='0%'
                  stopColor='var(--primary)'
                  stopOpacity={0.8}
                />
                <stop
                  offset='100%'
                  stopColor='var(--primary)'
                  stopOpacity={0.2}
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
              tickFormatter={(value) => {
                const [year, month] = value.split('-');
                return new Date(
                  parseInt(year),
                  parseInt(month) - 1
                ).toLocaleDateString('en-US', {
                  month: 'short'
                });
              }}
            />
            <ChartTooltip
              cursor={{ fill: 'var(--primary)', opacity: 0.1 }}
              content={
                <ChartTooltipContent
                  className='w-[150px]'
                  nameKey='cashflow'
                  labelFormatter={(value) => {
                    const [year, month] = value.split('-');
                    return new Date(
                      parseInt(year),
                      parseInt(month) - 1
                    ).toLocaleDateString('en-US', {
                      month: 'long',
                      year: 'numeric'
                    });
                  }}
                />
              }
            />
            <Bar
              dataKey={activeChart}
              fill='url(#fillBar)'
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
