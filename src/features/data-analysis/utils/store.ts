import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface DataRow {
  [key: string]: any;
  _id?: number;
}

export interface ChartConfig {
  id: string;
  type: 'line' | 'bar' | 'area' | 'pie' | 'scatter';
  title: string;
  xAxis: string;
  yAxis: string[];
  data: DataRow[];
}

export interface FormulaResult {
  id: string;
  formula: string;
  result: any;
  column?: string;
  error?: string;
}

export interface ForecastResult {
  id: string;
  type: 'linear' | 'polynomial' | 'exponential';
  column: string;
  predictions: number[];
  accuracy?: number;
  parameters?: any;
}

export interface DataAnalysisState {
  // Data management
  data: DataRow[];
  headers: string[];
  filteredData: DataRow[];

  // Charts
  charts: ChartConfig[];
  activeChart: string | null;

  // Formulas
  formulas: FormulaResult[];

  // Forecasting
  forecasts: ForecastResult[];

  // UI state
  selectedColumns: string[];
  filters: Record<string, any>;
  sortConfig: { column: string; direction: 'asc' | 'desc' } | null;
}

export interface DataAnalysisActions {
  // Data actions
  setData: (data: DataRow[]) => void;
  setHeaders: (headers: string[]) => void;
  updateData: (rowIndex: number, updates: Partial<DataRow>) => void;
  addRow: (row: DataRow) => void;
  deleteRow: (index: number) => void;

  // Filtering and sorting
  setFilters: (filters: Record<string, any>) => void;
  setSortConfig: (
    config: { column: string; direction: 'asc' | 'desc' } | null
  ) => void;
  applyFiltersAndSort: () => void;

  // Chart actions
  addChart: (chart: ChartConfig) => void;
  updateChart: (id: string, updates: Partial<ChartConfig>) => void;
  deleteChart: (id: string) => void;
  setActiveChart: (id: string | null) => void;

  // Formula actions
  addFormula: (formula: FormulaResult) => void;
  updateFormula: (id: string, updates: Partial<FormulaResult>) => void;
  deleteFormula: (id: string) => void;
  executeFormula: (formula: string, column?: string) => void;

  // Forecasting actions
  addForecast: (forecast: ForecastResult) => void;
  deleteForecast: (id: string) => void;
  generateForecast: (
    column: string,
    type: 'linear' | 'polynomial' | 'exponential',
    periods: number
  ) => void;

  // Column selection
  setSelectedColumns: (columns: string[]) => void;
  toggleColumnSelection: (column: string) => void;

  // Utility actions
  clearAll: () => void;
  exportData: (format: 'csv' | 'json') => void;
}

const initialState: DataAnalysisState = {
  data: [],
  headers: [],
  filteredData: [],
  charts: [],
  activeChart: null,
  formulas: [],
  forecasts: [],
  selectedColumns: [],
  filters: {},
  sortConfig: null
};

// Helper functions
const applyFilters = (
  data: DataRow[],
  filters: Record<string, any>
): DataRow[] => {
  return data.filter((row) => {
    return Object.entries(filters).every(([column, filterValue]) => {
      if (!filterValue) return true;

      const cellValue = row[column];
      if (typeof cellValue === 'string') {
        return cellValue.toLowerCase().includes(filterValue.toLowerCase());
      }
      if (typeof cellValue === 'number') {
        return cellValue.toString().includes(filterValue.toString());
      }
      return true;
    });
  });
};

const applySorting = (
  data: DataRow[],
  sortConfig: { column: string; direction: 'asc' | 'desc' } | null
): DataRow[] => {
  if (!sortConfig) return data;

  return [...data].sort((a, b) => {
    const aValue = a[sortConfig.column];
    const bValue = b[sortConfig.column];

    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
    }

    const aStr = String(aValue).toLowerCase();
    const bStr = String(bValue).toLowerCase();

    if (sortConfig.direction === 'asc') {
      return aStr.localeCompare(bStr);
    } else {
      return bStr.localeCompare(aStr);
    }
  });
};

// Simple formula evaluation (we'll enhance this later)
const evaluateFormula = (formula: string, data: DataRow[]): any => {
  try {
    // Basic formula support
    if (formula.startsWith('SUM(') && formula.endsWith(')')) {
      const columnName = formula.slice(4, -1);
      const values = data.map((row) => Number(row[columnName]) || 0);
      return values.reduce((sum, val) => sum + val, 0);
    }

    if (formula.startsWith('AVG(') && formula.endsWith(')')) {
      const columnName = formula.slice(4, -1);
      const values = data.map((row) => Number(row[columnName]) || 0);
      return values.reduce((sum, val) => sum + val, 0) / values.length;
    }

    if (formula.startsWith('COUNT(') && formula.endsWith(')')) {
      const columnName = formula.slice(6, -1);
      return data.filter(
        (row) => row[columnName] != null && row[columnName] !== ''
      ).length;
    }

    if (formula.startsWith('MAX(') && formula.endsWith(')')) {
      const columnName = formula.slice(4, -1);
      const values = data.map((row) => Number(row[columnName]) || 0);
      return Math.max(...values);
    }

    if (formula.startsWith('MIN(') && formula.endsWith(')')) {
      const columnName = formula.slice(4, -1);
      const values = data.map((row) => Number(row[columnName]) || 0);
      return Math.min(...values);
    }

    return 'Unsupported formula';
  } catch (error) {
    return 'Error in formula';
  }
};

// Simple linear regression for forecasting
const linearRegression = (
  data: number[],
  periods: number = 5
): { slope: number; intercept: number; predictions: number[] } => {
  const n = data.length;

  // Guard against insufficient data
  if (n < 2) {
    const fallbackValue = n > 0 ? data[0] : 0;
    return {
      slope: 0,
      intercept: fallbackValue,
      predictions: Array.from({ length: periods }, () => fallbackValue)
    };
  }

  const x = Array.from({ length: n }, (_, i) => i);

  const sumX = x.reduce((sum, val) => sum + val, 0);
  const sumY = data.reduce((sum, val) => sum + val, 0);
  const sumXY = x.reduce((sum, val, i) => sum + val * data[i], 0);
  const sumXX = x.reduce((sum, val) => sum + val * val, 0);

  const denominator = n * sumXX - sumX * sumX;

  // Guard against division by zero
  if (Math.abs(denominator) < 1e-8) {
    const fallbackValue = sumY / n; // Use mean as fallback
    return {
      slope: 0,
      intercept: fallbackValue,
      predictions: Array.from({ length: periods }, () => fallbackValue)
    };
  }

  const slope = (n * sumXY - sumX * sumY) / denominator;
  const intercept = (sumY - slope * sumX) / n;

  const predictions = Array.from(
    { length: periods },
    (_, i) => slope * (n + i) + intercept
  );

  return { slope, intercept, predictions };
};

export const useDataAnalysisStore = create<
  DataAnalysisState & DataAnalysisActions
>()(
  persist(
    (set, get) => ({
      ...initialState,

      // Data actions
      setData: (data) =>
        set((state) => {
          const newState = { ...state, data };
          return {
            ...newState,
            filteredData: applyFilters(data, state.filters)
          };
        }),

      setHeaders: (headers) => set({ headers }),

      updateData: (rowIndex, updates) =>
        set((state) => {
          const newData = [...state.data];
          newData[rowIndex] = { ...newData[rowIndex], ...updates };
          return {
            data: newData,
            filteredData: applyFilters(newData, state.filters)
          };
        }),

      addRow: (row) =>
        set((state) => {
          const newData = [...state.data, { ...row, _id: state.data.length }];
          return {
            data: newData,
            filteredData: applyFilters(newData, state.filters)
          };
        }),

      deleteRow: (index) =>
        set((state) => {
          const newData = state.data.filter((_, i) => i !== index);
          return {
            data: newData,
            filteredData: applyFilters(newData, state.filters)
          };
        }),

      // Filtering and sorting
      setFilters: (filters) =>
        set((state) => ({
          filters,
          filteredData: applySorting(
            applyFilters(state.data, filters),
            state.sortConfig
          )
        })),

      setSortConfig: (sortConfig) =>
        set((state) => ({
          sortConfig,
          filteredData: applySorting(
            applyFilters(state.data, state.filters),
            sortConfig
          )
        })),

      applyFiltersAndSort: () =>
        set((state) => ({
          filteredData: applySorting(
            applyFilters(state.data, state.filters),
            state.sortConfig
          )
        })),

      // Chart actions
      addChart: (chart) =>
        set((state) => ({
          charts: [...state.charts, chart]
        })),

      updateChart: (id, updates) =>
        set((state) => ({
          charts: state.charts.map((chart) =>
            chart.id === id ? { ...chart, ...updates } : chart
          )
        })),

      deleteChart: (id) =>
        set((state) => ({
          charts: state.charts.filter((chart) => chart.id !== id),
          activeChart: state.activeChart === id ? null : state.activeChart
        })),

      setActiveChart: (id) => set({ activeChart: id }),

      // Formula actions
      addFormula: (formula) =>
        set((state) => ({
          formulas: [...state.formulas, formula]
        })),

      updateFormula: (id, updates) =>
        set((state) => ({
          formulas: state.formulas.map((formula) =>
            formula.id === id ? { ...formula, ...updates } : formula
          )
        })),

      deleteFormula: (id) =>
        set((state) => ({
          formulas: state.formulas.filter((formula) => formula.id !== id)
        })),

      executeFormula: (formula, column) => {
        const state = get();
        // Use filtered data if filters are active, otherwise use full dataset
        const hasActiveFilters = Object.keys(state.filters).length > 0;
        const dataToUse = hasActiveFilters ? state.filteredData : state.data;
        const result = evaluateFormula(formula, dataToUse);
        const formulaResult: FormulaResult = {
          id: Math.random().toString(36).substr(2, 9),
          formula,
          result,
          column
        };

        set((state) => ({
          formulas: [...state.formulas, formulaResult]
        }));
      },

      // Forecasting actions
      addForecast: (forecast) =>
        set((state) => ({
          forecasts: [...state.forecasts, forecast]
        })),

      deleteForecast: (id) =>
        set((state) => ({
          forecasts: state.forecasts.filter((forecast) => forecast.id !== id)
        })),

      generateForecast: (column, type, periods) => {
        const state = get();
        const values = state.data.map((row) => Number(row[column]) || 0);

        if (type === 'linear') {
          const { predictions } = linearRegression(values, periods);
          const forecast: ForecastResult = {
            id: Math.random().toString(36).substr(2, 9),
            type,
            column,
            predictions
          };

          set((state) => ({
            forecasts: [...state.forecasts, forecast]
          }));
        }
      },

      // Column selection
      setSelectedColumns: (columns) => set({ selectedColumns: columns }),

      toggleColumnSelection: (column) =>
        set((state) => ({
          selectedColumns: state.selectedColumns.includes(column)
            ? state.selectedColumns.filter((col) => col !== column)
            : [...state.selectedColumns, column]
        })),

      // Utility actions
      clearAll: () => set(initialState),

      exportData: (format) => {
        const state = get();
        const dataToExport =
          state.filteredData.length > 0 ? state.filteredData : state.data;

        if (format === 'csv') {
          const csvContent = [
            state.headers.join(','),
            ...dataToExport.map((row) =>
              state.headers.map((header) => String(row[header] ?? '')).join(',')
            )
          ].join('\n');

          const blob = new Blob([csvContent], { type: 'text/csv' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'exported-data.csv';
          a.click();
          URL.revokeObjectURL(url);
        } else if (format === 'json') {
          const jsonContent = JSON.stringify(dataToExport, null, 2);
          const blob = new Blob([jsonContent], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'exported-data.json';
          a.click();
          URL.revokeObjectURL(url);
        }
      }
    }),
    {
      name: 'data-analysis-store',
      skipHydration: true
    }
  )
);
