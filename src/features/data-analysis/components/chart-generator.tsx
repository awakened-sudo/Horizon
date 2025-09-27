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
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { IconPlus, IconTrash, IconChartBar } from '@tabler/icons-react';
import { useDataAnalysisStore, ChartConfig } from '../utils/store';

const CHART_COLORS = [
  '#8884d8',
  '#82ca9d',
  '#ffc658',
  '#ff7300',
  '#00ff00',
  '#0088fe',
  '#00c49f',
  '#ffbb28',
  '#ff8042',
  '#8dd1e1'
];

export function ChartGenerator() {
  const {
    data,
    headers,
    charts,
    activeChart,
    addChart,
    deleteChart,
    setActiveChart
  } = useDataAnalysisStore();

  const [newChart, setNewChart] = useState<Partial<ChartConfig>>({
    type: 'line',
    title: '',
    xAxis: '',
    yAxis: []
  });

  const numericHeaders = headers.filter((header) => {
    const sampleValues = data.slice(0, 10).map((row) => row[header]);
    return sampleValues.some((val) => typeof val === 'number');
  });

  const createChart = () => {
    if (!newChart.title || !newChart.xAxis || !newChart.yAxis?.length) {
      return;
    }

    const chartData = data.map((row) => {
      const point: any = { [newChart.xAxis!]: row[newChart.xAxis!] };
      newChart.yAxis!.forEach((col) => {
        point[col] = row[col];
      });
      return point;
    });

    const chart: ChartConfig = {
      id: Math.random().toString(36).substr(2, 9),
      type: newChart.type as ChartConfig['type'],
      title: newChart.title,
      xAxis: newChart.xAxis,
      yAxis: newChart.yAxis,
      data: chartData
    };

    addChart(chart);
    setActiveChart(chart.id);

    // Reset form
    setNewChart({
      type: 'line',
      title: '',
      xAxis: '',
      yAxis: []
    });
  };

  const renderChart = (chart: ChartConfig) => {
    const commonProps = {
      data: chart.data,
      margin: { top: 5, right: 30, left: 20, bottom: 5 }
    };

    switch (chart.type) {
      case 'line':
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey={chart.xAxis} />
            <YAxis />
            <Tooltip />
            <Legend />
            {chart.yAxis.map((col, index) => (
              <Line
                key={col}
                type='monotone'
                dataKey={col}
                stroke={CHART_COLORS[index % CHART_COLORS.length]}
                strokeWidth={2}
              />
            ))}
          </LineChart>
        );

      case 'bar':
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey={chart.xAxis} />
            <YAxis />
            <Tooltip />
            <Legend />
            {chart.yAxis.map((col, index) => (
              <Bar
                key={col}
                dataKey={col}
                fill={CHART_COLORS[index % CHART_COLORS.length]}
              />
            ))}
          </BarChart>
        );

      case 'area':
        return (
          <AreaChart {...commonProps}>
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey={chart.xAxis} />
            <YAxis />
            <Tooltip />
            <Legend />
            {chart.yAxis.map((col, index) => (
              <Area
                key={col}
                type='monotone'
                dataKey={col}
                stackId='1'
                stroke={CHART_COLORS[index % CHART_COLORS.length]}
                fill={CHART_COLORS[index % CHART_COLORS.length]}
              />
            ))}
          </AreaChart>
        );

      case 'pie': {
        const pieData = chart.data.map((item) => ({
          name: item[chart.xAxis],
          value: item[chart.yAxis[0]]
        }));

        return (
          <PieChart {...commonProps}>
            <Pie
              data={pieData}
              cx='50%'
              cy='50%'
              labelLine={false}
              label={({ name, percent }) =>
                `${name} ${(percent * 100).toFixed(0)}%`
              }
              outerRadius={80}
              fill='#8884d8'
              dataKey='value'
            >
              {pieData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={CHART_COLORS[index % CHART_COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        );
      }

      case 'scatter':
        return (
          <ScatterChart {...commonProps}>
            <CartesianGrid />
            <XAxis dataKey={chart.xAxis} />
            <YAxis dataKey={chart.yAxis[0]} />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
            <Legend />
            {chart.yAxis.map((col, index) => (
              <Scatter
                key={col}
                name={col}
                data={chart.data}
                dataKey={col}
                fill={CHART_COLORS[index % CHART_COLORS.length]}
              />
            ))}
          </ScatterChart>
        );

      default:
        return <div>Unsupported chart type</div>;
    }
  };

  if (data.length === 0) {
    return (
      <Card>
        <CardContent className='flex flex-col items-center justify-center py-12'>
          <div className='space-y-2 text-center'>
            <IconChartBar className='text-muted-foreground mx-auto h-12 w-12' />
            <h3 className='text-lg font-semibold'>No Data Available</h3>
            <p className='text-muted-foreground'>
              Upload data to start creating charts and visualizations.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Chart Creation Form */}
      <Card>
        <CardHeader>
          <CardTitle>Create New Chart</CardTitle>
          <CardDescription>
            Generate visualizations from your data
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <div className='space-y-2'>
              <Label htmlFor='chart-title'>Chart Title</Label>
              <Input
                id='chart-title'
                placeholder='Enter chart title...'
                value={newChart.title || ''}
                onChange={(e) =>
                  setNewChart((prev) => ({ ...prev, title: e.target.value }))
                }
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='chart-type'>Chart Type</Label>
              <Select
                value={newChart.type}
                onValueChange={(value) =>
                  setNewChart((prev) => ({
                    ...prev,
                    type: value as ChartConfig['type']
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder='Select chart type' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='line'>Line Chart</SelectItem>
                  <SelectItem value='bar'>Bar Chart</SelectItem>
                  <SelectItem value='area'>Area Chart</SelectItem>
                  <SelectItem value='pie'>Pie Chart</SelectItem>
                  <SelectItem value='scatter'>Scatter Plot</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <div className='space-y-2'>
              <Label htmlFor='x-axis'>X-Axis Column</Label>
              <Select
                value={newChart.xAxis}
                onValueChange={(value) =>
                  setNewChart((prev) => ({ ...prev, xAxis: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder='Select X-axis column' />
                </SelectTrigger>
                <SelectContent>
                  {headers.map((header) => (
                    <SelectItem key={header} value={header}>
                      {header}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className='space-y-2'>
              <Label>Y-Axis Columns</Label>
              <div className='max-h-32 overflow-y-auto rounded-md border p-3'>
                {numericHeaders.map((header) => (
                  <div
                    key={header}
                    className='flex items-center space-x-2 py-1'
                  >
                    <Checkbox
                      id={`y-${header}`}
                      checked={newChart.yAxis?.includes(header) || false}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setNewChart((prev) => ({
                            ...prev,
                            yAxis: [...(prev.yAxis || []), header]
                          }));
                        } else {
                          setNewChart((prev) => ({
                            ...prev,
                            yAxis: (prev.yAxis || []).filter(
                              (col) => col !== header
                            )
                          }));
                        }
                      }}
                    />
                    <Label htmlFor={`y-${header}`} className='text-sm'>
                      {header}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <Button onClick={createChart} className='w-full'>
            <IconPlus className='mr-2 h-4 w-4' />
            Create Chart
          </Button>
        </CardContent>
      </Card>

      {/* Chart List */}
      {charts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Your Charts</CardTitle>
            <CardDescription>
              Manage and view your created charts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
              {charts.map((chart) => (
                <div key={chart.id} className='space-y-2 rounded-lg border p-4'>
                  <div className='flex items-center justify-between'>
                    <h4 className='font-semibold'>{chart.title}</h4>
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={() => deleteChart(chart.id)}
                    >
                      <IconTrash className='h-4 w-4' />
                    </Button>
                  </div>
                  <div className='flex flex-wrap gap-1'>
                    <Badge variant='outline'>{chart.type}</Badge>
                    <Badge variant='secondary'>{chart.xAxis}</Badge>
                    {chart.yAxis.map((col) => (
                      <Badge key={col} variant='secondary'>
                        {col}
                      </Badge>
                    ))}
                  </div>
                  <Button
                    variant='outline'
                    size='sm'
                    className='w-full'
                    onClick={() =>
                      setActiveChart(chart.id === activeChart ? null : chart.id)
                    }
                  >
                    {chart.id === activeChart ? 'Hide Chart' : 'Show Chart'}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Active Chart Display */}
      {activeChart && charts.find((c) => c.id === activeChart) && (
        <Card>
          <CardHeader>
            <CardTitle>
              {charts.find((c) => c.id === activeChart)?.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='h-96'>
              <ResponsiveContainer width='100%' height='100%'>
                {renderChart(charts.find((c) => c.id === activeChart)!)}
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
