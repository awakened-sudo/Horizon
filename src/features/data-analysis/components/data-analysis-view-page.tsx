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
      <div className='flex flex-1 flex-col space-y-4'>
        <div className='flex items-center justify-between space-y-2'>
          <Heading
            title='Data Analysis '
            description='Upload, analyze, and visualize your financial data with advanced tools'
          />
        </div>

        <Tabs defaultValue='upload' className='flex flex-1 flex-col space-y-4'>
          <TabsList className='grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-5'>
            <TabsTrigger value='upload' className='flex-1'>
              📤 Upload
            </TabsTrigger>
            <TabsTrigger value='viewer' className='flex-1'>
              🔍 Data Viewer
            </TabsTrigger>
            <TabsTrigger value='charts' className='flex-1'>
              📈 Charts
            </TabsTrigger>
            <TabsTrigger value='formulas' className='flex-1'>
              🧮 Formulas
            </TabsTrigger>
            <TabsTrigger value='forecast' className='flex-1'>
              🔮 Forecast
            </TabsTrigger>
          </TabsList>

          <div className='flex flex-1 flex-col'>
            <TabsContent
              value='upload'
              className='flex-1 space-y-4 data-[state=active]:flex data-[state=active]:flex-col'
            >
              <CSVUploader />
            </TabsContent>

            <TabsContent
              value='viewer'
              className='flex-1 space-y-4 data-[state=active]:flex data-[state=active]:flex-col'
            >
              <DataViewer />
            </TabsContent>

            <TabsContent
              value='charts'
              className='flex-1 space-y-4 data-[state=active]:flex data-[state=active]:flex-col'
            >
              <ChartGenerator />
            </TabsContent>

            <TabsContent
              value='formulas'
              className='flex-1 space-y-4 data-[state=active]:flex data-[state=active]:flex-col'
            >
              <FormulaEngine />
            </TabsContent>

            <TabsContent
              value='forecast'
              className='flex-1 space-y-4 data-[state=active]:flex data-[state=active]:flex-col'
            >
              <ForecastingPanel />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </PageContainer>
  );
}
