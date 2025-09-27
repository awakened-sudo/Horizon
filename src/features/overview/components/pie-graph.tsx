'use client';

import * as React from 'react';
import { IconTrendingUp } from '@tabler/icons-react';
import { Label, Pie, PieChart } from 'recharts';

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
  { category: 'stocks', value: 78500, fill: 'var(--primary)' },
  { category: 'bonds', value: 32000, fill: 'var(--primary-light)' },
  { category: 'real_estate', value: 45000, fill: 'var(--primary-lighter)' },
  { category: 'cash', value: 18200, fill: 'var(--primary-dark)' },
  { category: 'crypto', value: 11500, fill: 'var(--primary-darker)' }
];

const chartConfig = {
  value: {
    label: 'Value'
  },
  stocks: {
    label: 'Stocks',
    color: 'hsl(var(--chart-1))'
  },
  bonds: {
    label: 'Bonds',
    color: 'hsl(var(--chart-2))'
  },
  real_estate: {
    label: 'Real Estate',
    color: 'hsl(var(--chart-3))'
  },
  cash: {
    label: 'Cash',
    color: 'hsl(var(--chart-4))'
  },
  crypto: {
    label: 'Cryptocurrency',
    color: 'hsl(var(--chart-5))'
  }
} satisfies ChartConfig;

export function PieGraph() {
  const totalValue = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.value, 0);
  }, []);

  return (
    <Card className='@container/card'>
      <CardHeader>
        <CardTitle>Asset Allocation</CardTitle>
        <CardDescription>
          <span className='hidden @[540px]/card:block'>
            Portfolio distribution by asset class
          </span>
          <span className='@[540px]/card:hidden'>Asset breakdown</span>
        </CardDescription>
      </CardHeader>
      <CardContent className='px-2 pt-4 sm:px-6 sm:pt-6'>
        <ChartContainer
          config={chartConfig}
          className='mx-auto aspect-square h-[250px]'
        >
          <PieChart>
            <defs>
              {['stocks', 'bonds', 'real_estate', 'cash', 'crypto'].map(
                (category, index) => (
                  <linearGradient
                    key={category}
                    id={`fill${category}`}
                    x1='0'
                    y1='0'
                    x2='0'
                    y2='1'
                  >
                    <stop
                      offset='0%'
                      stopColor={`hsl(var(--chart-${index + 1}))`}
                      stopOpacity={0.8}
                    />
                    <stop
                      offset='100%'
                      stopColor={`hsl(var(--chart-${index + 1}))`}
                      stopOpacity={0.3}
                    />
                  </linearGradient>
                )
              )}
            </defs>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData.map((item) => ({
                ...item,
                fill: `url(#fill${item.category})`
              }))}
              dataKey='value'
              nameKey='category'
              innerRadius={60}
              strokeWidth={2}
              stroke='var(--background)'
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor='middle'
                        dominantBaseline='middle'
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className='fill-foreground text-3xl font-bold'
                        >
                          ${totalValue.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className='fill-muted-foreground text-sm'
                        >
                          Total Assets
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className='flex-col gap-2 text-sm'>
        <div className='flex items-center gap-2 leading-none font-medium'>
          Stocks lead with{' '}
          {((chartData[0].value / totalValue) * 100).toFixed(1)}%{' '}
          <IconTrendingUp className='h-4 w-4' />
        </div>
        <div className='text-muted-foreground leading-none'>
          Well-diversified portfolio allocation
        </div>
      </CardFooter>
    </Card>
  );
}
