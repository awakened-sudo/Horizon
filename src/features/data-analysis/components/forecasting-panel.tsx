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
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { IconTrendingUp, IconTrash, IconBrain } from '@tabler/icons-react';
import { useDataAnalysisStore } from '../utils/store';

export function ForecastingPanel() {
  const { data, headers, forecasts, generateForecast, deleteForecast } =
    useDataAnalysisStore();

  const [selectedColumn, setSelectedColumn] = useState('');
  const [forecastType, setForecastType] = useState<
    'linear' | 'polynomial' | 'exponential'
  >('linear');
  const [periods, setPeriods] = useState(5);

  const numericHeaders = headers.filter((header) => {
    const sampleValues = data.slice(0, 10).map((row) => row[header]);
    return sampleValues.some((val) => typeof val === 'number');
  });

  const handleGenerateForecast = () => {
    if (!selectedColumn) return;
    generateForecast(selectedColumn, forecastType, periods);
  };

  const createForecastChart = (column: string, predictions: number[]) => {
    const historicalData = data.map((row, index) => ({
      period: index + 1,
      actual: row[column],
      type: 'historical'
    }));

    const forecastData = predictions.map((value, index) => ({
      period: data.length + index + 1,
      forecast: value,
      type: 'forecast'
    }));

    const combinedData = [...historicalData, ...forecastData];

    return combinedData;
  };

  const calculateTrend = (
    values: number[]
  ): { trend: 'up' | 'down' | 'stable'; change: number } => {
    if (values.length < 2) return { trend: 'stable', change: 0 };

    const first = values[0];
    const last = values[values.length - 1];

    // Guard against division by zero or very small values
    const firstSafe = Math.abs(first) < 1e-8 ? 1e-8 : first;
    const change = ((last - firstSafe) / firstSafe) * 100;

    if (Math.abs(change) < 5) return { trend: 'stable', change };
    return { trend: change > 0 ? 'up' : 'down', change };
  };

  if (data.length === 0) {
    return (
      <Card>
        <CardContent className='flex flex-col items-center justify-center py-12'>
          <div className='space-y-2 text-center'>
            <IconBrain className='text-muted-foreground mx-auto h-12 w-12' />
            <h3 className='text-lg font-semibold'>No Data Available</h3>
            <p className='text-muted-foreground'>
              Upload data to start generating forecasts and predictions.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Forecast Generator */}
      <Card>
        <CardHeader>
          <CardTitle>Generate Forecast</CardTitle>
          <CardDescription>
            Create predictions based on historical data trends
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
            <div className='space-y-2'>
              <Label htmlFor='forecast-column'>Data Column</Label>
              <Select value={selectedColumn} onValueChange={setSelectedColumn}>
                <SelectTrigger>
                  <SelectValue placeholder='Select column to forecast' />
                </SelectTrigger>
                <SelectContent>
                  {numericHeaders.map((header) => (
                    <SelectItem key={header} value={header}>
                      {header}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='forecast-type'>Forecast Method</Label>
              <Select
                value={forecastType}
                onValueChange={(value: any) => setForecastType(value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='linear'>Linear Regression</SelectItem>
                  <SelectItem value='polynomial'>
                    Polynomial (Coming Soon)
                  </SelectItem>
                  <SelectItem value='exponential'>
                    Exponential (Coming Soon)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='forecast-periods'>Forecast Periods</Label>
              <Input
                id='forecast-periods'
                type='number'
                min='1'
                max='20'
                value={periods}
                onChange={(e) => setPeriods(parseInt(e.target.value) || 5)}
              />
            </div>
          </div>

          <Button onClick={handleGenerateForecast} className='w-full'>
            <IconTrendingUp className='mr-2 h-4 w-4' />
            Generate Forecast
          </Button>
        </CardContent>
      </Card>

      {/* Data Trends Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Data Trends</CardTitle>
          <CardDescription>
            Quick analysis of your numeric columns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
            {numericHeaders.map((header) => {
              const values = data.map((row) => Number(row[header]) || 0);
              const { trend, change } = calculateTrend(values);
              const avg =
                values.reduce((sum, val) => sum + val, 0) / values.length;

              return (
                <div key={header} className='space-y-2 rounded-lg border p-4'>
                  <div className='flex items-center justify-between'>
                    <h4 className='font-semibold'>{header}</h4>
                    <Badge
                      variant={
                        trend === 'up'
                          ? 'default'
                          : trend === 'down'
                            ? 'destructive'
                            : 'secondary'
                      }
                    >
                      {trend === 'up' && '↗'}
                      {trend === 'down' && '↘'}
                      {trend === 'stable' && '→'}
                      {Math.abs(change).toFixed(1)}%
                    </Badge>
                  </div>
                  <div className='text-muted-foreground text-sm'>
                    <div>Average: {avg.toFixed(2)}</div>
                    <div>Data points: {values.length}</div>
                    <div>Latest: {values[values.length - 1]}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Forecast Results */}
      {forecasts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Forecast Results</CardTitle>
            <CardDescription>Your generated predictions</CardDescription>
          </CardHeader>
          <CardContent className='space-y-6'>
            {forecasts.map((forecast) => {
              const chartData = createForecastChart(
                forecast.column,
                forecast.predictions
              );

              return (
                <div key={forecast.id} className='space-y-4'>
                  <div className='flex items-center justify-between'>
                    <div>
                      <h4 className='font-semibold'>
                        {forecast.column} Forecast
                      </h4>
                      <div className='mt-1 flex items-center space-x-2'>
                        <Badge variant='outline'>{forecast.type}</Badge>
                        <span className='text-muted-foreground text-sm'>
                          {forecast.predictions.length} periods ahead
                        </span>
                      </div>
                    </div>
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={() => deleteForecast(forecast.id)}
                    >
                      <IconTrash className='h-4 w-4' />
                    </Button>
                  </div>

                  <div className='h-64'>
                    <ResponsiveContainer width='100%' height='100%'>
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray='3 3' />
                        <XAxis dataKey='period' />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line
                          type='monotone'
                          dataKey='actual'
                          stroke='#8884d8'
                          strokeWidth={2}
                          name='Historical Data'
                          connectNulls={false}
                        />
                        <Line
                          type='monotone'
                          dataKey='forecast'
                          stroke='#82ca9d'
                          strokeWidth={2}
                          strokeDasharray='5 5'
                          name='Forecast'
                          connectNulls={false}
                        />
                        <ReferenceLine
                          x={data.length}
                          stroke='#ff7300'
                          strokeDasharray='2 2'
                          label='Forecast Start'
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  <div className='grid grid-cols-2 gap-4 text-sm md:grid-cols-4'>
                    <div>
                      <span className='text-muted-foreground'>
                        Next Period:
                      </span>
                      <div className='font-semibold'>
                        {forecast.predictions[0]?.toFixed(2)}
                      </div>
                    </div>
                    <div>
                      <span className='text-muted-foreground'>
                        Final Period:
                      </span>
                      <div className='font-semibold'>
                        {forecast.predictions[
                          forecast.predictions.length - 1
                        ]?.toFixed(2)}
                      </div>
                    </div>
                    <div>
                      <span className='text-muted-foreground'>
                        Avg Forecast:
                      </span>
                      <div className='font-semibold'>
                        {(
                          forecast.predictions.reduce(
                            (sum, val) => sum + val,
                            0
                          ) / forecast.predictions.length
                        ).toFixed(2)}
                      </div>
                    </div>
                    <div>
                      <span className='text-muted-foreground'>Trend:</span>
                      <div className='font-semibold'>
                        {forecast.predictions[0] <
                        forecast.predictions[forecast.predictions.length - 1]
                          ? '↗ Up'
                          : '↘ Down'}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Forecasting Guide */}
      <Card>
        <CardHeader>
          <CardTitle>Forecasting Guide</CardTitle>
          <CardDescription>
            Understanding forecast methods and accuracy
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              <div className='space-y-2'>
                <h4 className='font-semibold'>Linear Regression</h4>
                <p className='text-muted-foreground text-sm'>
                  Best for data with consistent trends. Assumes future values
                  will follow the same linear pattern as historical data.
                </p>
                <ul className='text-muted-foreground space-y-1 text-xs'>
                  <li>• Good for: Revenue growth, expense trends</li>
                  <li>• Accuracy: Moderate for short-term predictions</li>
                  <li>• Limitations: Cannot predict seasonal patterns</li>
                </ul>
              </div>

              <div className='space-y-2'>
                <h4 className='font-semibold'>Best Practices</h4>
                <ul className='text-muted-foreground space-y-1 text-sm'>
                  <li>• Use at least 10-20 data points for better accuracy</li>
                  <li>
                    • Consider external factors that might affect predictions
                  </li>
                  <li>
                    • Short-term forecasts (1-5 periods) are more reliable
                  </li>
                  <li>• Review and update forecasts regularly</li>
                </ul>
              </div>
            </div>

            <div className='bg-muted rounded-lg p-4'>
              <h4 className='mb-2 font-semibold'>Disclaimer</h4>
              <p className='text-muted-foreground text-sm'>
                Forecasts are statistical predictions based on historical data
                and should not be considered as guaranteed future outcomes.
                Always consider external factors and market conditions when
                making financial decisions.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
