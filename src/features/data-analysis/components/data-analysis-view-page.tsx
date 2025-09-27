import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CSVUploader } from './csv-uploader';
import { DataViewer } from './data-viewer';
import { ChartGenerator } from './chart-generator';
import { FormulaEngine } from './formula-engine';
import { ForecastingPanel } from './forecasting-panel';

export default function DataAnalysisViewPage() {
  return (
    <PageContainer>
      <div className='space-y-4'>
        <div className='flex items-start justify-between'>
          <Heading
            title='Data Analysis'
            description='Upload, analyze, and visualize your financial data with advanced tools'
          />
        </div>

        <Tabs defaultValue='upload' className='space-y-4'>
          <TabsList className='grid w-full grid-cols-5'>
            <TabsTrigger value='upload'>Upload</TabsTrigger>
            <TabsTrigger value='viewer'>Data Viewer</TabsTrigger>
            <TabsTrigger value='charts'>Charts</TabsTrigger>
            <TabsTrigger value='formulas'>Formulas</TabsTrigger>
            <TabsTrigger value='forecast'>Forecast</TabsTrigger>
          </TabsList>

          <TabsContent value='upload' className='space-y-4'>
            <CSVUploader />
          </TabsContent>

          <TabsContent value='viewer' className='space-y-4'>
            <DataViewer />
          </TabsContent>

          <TabsContent value='charts' className='space-y-4'>
            <ChartGenerator />
          </TabsContent>

          <TabsContent value='formulas' className='space-y-4'>
            <FormulaEngine />
          </TabsContent>

          <TabsContent value='forecast' className='space-y-4'>
            <ForecastingPanel />
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
}
