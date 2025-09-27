<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://user-images.githubusercontent.com/9113740/201498864-2a900c64-d88f-4ed4-b5cf-770bcb57e1f5.png">
  <source media="(prefers-color-scheme: light)" srcset="https://user-images.githubusercontent.com/9113740/201498152-b171abb8-9225-487a-821c-6ff49ee48579.png">
</picture>

<div align="center"><strong>Horizon - Advanced Financial Dashboard & Data Analysis Platform</strong></div>
<div align="center">Built with Next.js 15 App Router & Modern Financial Analytics</div>
<br />
<div align="center">
<a href="https://dub.sh/shadcn-dashboard">View Demo</a>
<span> • </span>
<a href="#features">Features</a>
<span> • </span>
<a href="#data-analysis">Data Analysis</a>
</div>

## Overview

**Horizon** is a comprehensive financial dashboard and data analysis platform that combines modern web technologies with powerful analytics capabilities. Built for financial professionals, analysts, and businesses who need to process, visualize, and analyze financial data efficiently.

### 🎯 **Key Capabilities**
- **📊 Advanced CSV Data Analysis** - Upload, process, and analyze financial datasets
- **📈 Interactive Visualizations** - Dynamic charts and forecasting tools  
- **🧮 Formula Engine** - Excel-like calculations and data processing
- **📋 Financial Goal Management** - Kanban-style task and goal tracking
- **💼 Investment Portfolio** - Track and manage investment products
- **🔍 Real-time Filtering & Search** - Advanced data table operations

## Tech Stack

This platform is built using the following modern stack:

- Framework - [Next.js 15](https://nextjs.org/13)
- Language - [TypeScript](https://www.typescriptlang.org)
- Auth - [Clerk](https://go.clerk.com/ILdYhn7)
- Error tracking - [<picture><img alt="Sentry" src="public/assets/sentry.svg">
        </picture>](https://sentry.io/for/nextjs/?utm_source=github&utm_medium=paid-community&utm_campaign=general-fy26q2-nextjs&utm_content=github-banner-project-tryfree)
- Styling - [Tailwind CSS v4](https://tailwindcss.com)
- Components - [Shadcn-ui](https://ui.shadcn.com)
- Schema Validations - [Zod](https://zod.dev)
- State Management - [Zustand](https://zustand-demo.pmnd.rs)
- Search params state manager - [Nuqs](https://nuqs.47ng.com/)
- Tables - [Tanstack Data Tables](https://ui.shadcn.com/docs/components/data-table) • [Dice table](https://www.diceui.com/docs/components/data-table)
- Forms - [React Hook Form](https://ui.shadcn.com/docs/components/form)
- Charts - [Recharts](https://recharts.org/) for data visualization
- Data Processing - CSV parsing and analysis capabilities
- Command+k interface - [kbar](https://kbar.vercel.app/)
- Linting - [ESLint](https://eslint.org)
- Pre-commit Hooks - [Husky](https://typicode.github.io/husky/)
- Formatting - [Prettier](https://prettier.io)

## Features

### 🏠 **Dashboard Overview**
- Real-time financial metrics and KPIs
- Interactive charts and graphs
- Recent activity and notifications
- Quick access to key features

### 📊 **Data Analysis Platform**
Our comprehensive CSV data analysis suite includes:

#### **📤 Data Upload & Processing**
- Drag & drop CSV file upload
- Support for XLS/XLSX formats  
- Automatic data type detection
- Sample financial datasets included
- Real-time parsing with progress tracking

#### **🔍 Advanced Data Viewer**
- Dynamic table generation from CSV headers
- Real-time filtering by any column
- Multi-column sorting with custom logic
- Data statistics (count, sum, average, min, max)
- Export functionality (CSV, JSON)
- Responsive design for all screen sizes

#### **📈 Interactive Chart Generator**
- **5 Chart Types**: Line, Bar, Area, Pie, Scatter
- Multi-series support for complex visualizations
- Interactive chart builder with column selection
- Responsive charts using Recharts
- Chart management (save, delete, show/hide)
- Real-time data binding

#### **🧮 Formula Engine**
- Excel-like functions: `SUM()`, `AVG()`, `COUNT()`, `MAX()`, `MIN()`
- Real-time calculation on filtered data
- Formula history and result management
- Column-aware suggestions and validation
- Error handling and debugging tools

#### **🔮 Forecasting & Trend Analysis**
- Linear regression forecasting
- Trend detection (up/down/stable indicators)
- Visual predictions with historical overlay
- Configurable forecast periods (1-20 ahead)
- Accuracy indicators and confidence metrics

### 💼 **Investment Management**
- Investment product catalog
- Portfolio tracking and analysis
- Performance metrics and reporting
- Risk assessment tools

### 📋 **Financial Goal Management**
- Kanban-style task board
- Drag & drop goal organization
- Progress tracking and milestones
- Team collaboration features

### 🔐 **Authentication & Security**
- Secure authentication with Clerk
- Multi-factor authentication support
- Role-based access control
- Session management
## Pages & Routes

| Route | Feature | Description |
|-------|---------|-------------|
| `/dashboard` | **Overview** | Financial KPIs, charts, and analytics dashboard with real-time data |
| `/dashboard/data-analysis` | **📊 Data Analysis** | Complete CSV analysis platform with 5 integrated tools |
| `/dashboard/kanban` | **📋 Financial Goals** | Drag & drop task management for financial objectives |
| `/dashboard/product` | **💼 Investments** | Investment product catalog with advanced filtering |
| `/dashboard/profile` | **👤 Profile** | User account management and settings |
| `/auth/sign-in` | **🔐 Authentication** | Secure login with multiple authentication methods |

### 📊 **Data Analysis Routes**

The `/dashboard/data-analysis` route provides a comprehensive analytics platform with 5 integrated tabs:

| Tab | Feature | Capabilities |
|-----|---------|-------------|
| **Upload** | Data Import | CSV/Excel upload, sample data, parsing validation |
| **Data Viewer** | Table Analysis | Advanced filtering, sorting, statistics, export |
| **Charts** | Visualization | 5 chart types, multi-series, interactive builder |
| **Formulas** | Calculations | Excel-like functions, real-time computation |
| **Forecast** | Predictions | Linear regression, trend analysis, projections |

## Project Structure

```plaintext
src/
├── app/ # Next.js App Router
│ ├── (auth)/ # Authentication routes
│ ├── (dashboard)/ # Dashboard routes
│ │ ├── data-analysis/ # 📊 CSV Analysis Platform
│ │ ├── kanban/ # 📋 Financial Goals
│ │ ├── product/ # 💼 Investment Management
│ │ └── overview/ # 🏠 Dashboard Home
│ └── api/ # API endpoints
│
├── components/ # Shared UI components
│ ├── ui/ # Shadcn-ui components
│ ├── layout/ # Layout components
│ └── charts/ # Chart components
│
├── features/ # Feature-based modules
│ ├── data-analysis/ # 📊 CSV Analysis Suite
│ │ ├── components/
│ │ │ ├── csv-uploader.tsx # File upload & parsing
│ │ │ ├── data-viewer.tsx # Advanced data table
│ │ │ ├── chart-generator.tsx # Interactive charts
│ │ │ ├── formula-engine.tsx # Excel-like calculations
│ │ │ └── forecasting-panel.tsx # Trend analysis
│ │ └── utils/
│ │   └── store.ts # Zustand data store
│ ├── kanban/ # Task management
│ ├── products/ # Investment products
│ └── auth/ # Authentication
│
├── lib/ # Core utilities
│ ├── auth/ # Clerk configuration
│ ├── utils/ # Shared utilities
│ └── data-table/ # Table utilities
│
├── hooks/ # Custom React hooks
│ └── use-data-table.ts # Table management
│
└── types/ # TypeScript definitions
  └── index.ts # Global types
```

## Quick Start Guide

1. **Clone the repository**
```bash
git clone https://github.com/Awakened-Sudo/horizon.git
cd horizon
```

2. **Install dependencies**
```bash
pnpm install
```
> **Note**: Using Next.js 15 with React 19. We have `legacy-peer-deps=true` in `.npmrc`

3. **Environment setup**
```bash
cp env.example.txt .env.local
```
Add your environment variables for authentication and error tracking.

4. **Start development server**
```bash
pnpm run dev
```

5. **Access the application**
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 📊 **Using the Data Analysis Platform**

1. **Navigate to Data Analysis**: `/dashboard/data-analysis`
2. **Upload Data**: Use the Upload tab to import CSV files or load sample data
3. **Explore Data**: Switch to Data Viewer for filtering and analysis
4. **Create Charts**: Use Charts tab to build visualizations
5. **Run Formulas**: Calculate metrics with the Formula Engine
6. **Generate Forecasts**: Predict trends with the Forecasting tool

### 🛠 **Development Commands**

```bash
pnpm run dev          # Start development server
pnpm run build        # Build for production
pnpm run start        # Start production server
pnpm run lint         # Run ESLint
pnpm run type-check   # TypeScript type checking
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- 📧 **Email**: [support@horizon-dashboard.com](mailto:support@horizon-dashboard.com)
- 🐛 **Issues**: [GitHub Issues](https://github.com/Awakened-Sudo/horizon/issues)
- 📖 **Documentation**: [Wiki](https://github.com/Awakened-Sudo/horizon/wiki)

---

**Built with ❤️ for the financial community**

> [!WARNING]
> After cloning or forking the repository, be cautious when pulling or syncing with the latest changes, as this may result in breaking conflicts.
