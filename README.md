# 🏙️ NYC 311 Complaints Dashboard

A modern, real-time data visualization dashboard for NYC 311 service requests built with Next.js 15, featuring interactive maps, analytics, and comprehensive filtering capabilities.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Installation](#installation)
- [Usage](#usage)
- [Components](#components)
- [API Integration](#api-integration)
- [State Management](#state-management)
- [Styling & Design](#styling--design)
- [Performance](#performance)
- [Development](#development)
- [Deployment](#deployment)
- [Contributing](#contributing)

## 🎯 Overview

The NYC 311 Complaints Dashboard is a comprehensive data visualization platform that provides real-time insights into New York City's 311 service requests. Built with modern web technologies, it offers an intuitive interface for exploring complaint data through interactive maps, charts, and analytics.

### Key Highlights

- **Real-time Data**: Live integration with NYC Open Data API
- **Interactive Maps**: Beautiful Leaflet-based maps with custom markers
- **Advanced Analytics**: Comprehensive charts and statistics
- **Smart Filtering**: Multi-dimensional filtering with loading states
- **Responsive Design**: Optimized for all device sizes
- **Modern UI**: Dark theme with glassmorphism effects

## ✨ Features

### 🗺️ Interactive Mapping
- **Real-time Markers**: Color-coded markers based on complaint status
- **Custom Markers**: Beautiful gradient markers with status indicators
- **Map Filtering**: Dynamic marker updates based on applied filters
- **Popup Details**: Rich complaint information on marker click
- **Search Integration**: Map search with sleek modal interface

### 📊 Data Visualization
- **Comprehensive Charts**: Bar charts, doughnut charts, and analytics
- **Real-time Statistics**: Live complaint counts and status breakdowns
- **Borough Analytics**: Detailed borough-wise complaint analysis
- **Performance Metrics**: Agency response times and resolution rates

### 🔍 Advanced Filtering
- **Multi-dimensional Filters**: Type, borough, status, and search
- **Real-time Updates**: Instant data refresh on filter changes
- **Loading States**: Beautiful loading indicators during data fetch
- **Filter Persistence**: Maintains filter state across components

### 🎨 User Experience
- **Sleek Search Modal**: Modern search interface with suggestions
- **Loading Animations**: Smooth loading states with glassmorphism
- **Responsive Design**: Optimized for desktop, tablet, and mobile
- **Dark Theme**: Professional dark UI with accent colors

## 🛠️ Tech Stack

### Frontend
- **Next.js 15**: React framework with App Router
- **React 19**: Latest React with concurrent features
- **TypeScript**: Full type safety and development experience
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Beautiful icon library

### State Management
- **Redux Toolkit**: Modern Redux with RTK Query
- **RTK Query**: Powerful data fetching and caching
- **React Redux**: React bindings for Redux

### Data Visualization
- **Chart.js**: Comprehensive charting library
- **React Chart.js 2**: React wrapper for Chart.js
- **Leaflet**: Interactive maps
- **React Leaflet**: React components for Leaflet

### Development Tools
- **ESLint**: Code linting and formatting
- **TypeScript**: Static type checking
- **Turbopack**: Fast bundling and development

## 🏗️ Architecture

### Project Structure
```
v1/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API routes
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx          # Main page
│   ├── components/            # React components
│   │   ├── DataDashboard.tsx  # Main dashboard
│   │   ├── WorkingMap.tsx     # Interactive map
│   │   ├── EnhancedCharts.tsx # Data visualization
│   │   ├── SearchModal.tsx    # Search interface
│   │   └── ...               # Other components
│   ├── lib/                   # Utilities and configurations
│   │   └── redux/            # Redux store and API
│   └── store/                # Legacy store (compatibility)
├── public/                    # Static assets
└── package.json              # Dependencies and scripts
```

### Component Architecture

#### Core Components
- **DataDashboard**: Main container orchestrating all components
- **WorkingMap**: Interactive map with filtering and search
- **EnhancedCharts**: Data visualization with multiple chart types
- **SearchModal**: Sleek search interface with suggestions
- **AnalyticsDashboard**: Performance metrics and statistics
- **ComplaintsTable**: Sortable and filterable data table

#### Layout Components
- **SplineBackground**: 3D animated background
- **SlimSidebar**: Navigation sidebar
- **Header**: Top navigation and controls

## 🚀 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Setup
```bash
# Clone the repository
git clone <repository-url>
cd v1

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Start development server
npm run dev
```

### Environment Variables
```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

## 📖 Usage

### Development
```bash
# Start development server with Turbopack
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

### Key Functionality

#### 1. Data Exploration
- Navigate through complaint data using interactive filters
- View real-time statistics in the overview cards
- Explore data through multiple visualization types

#### 2. Map Interaction
- Click on markers to view complaint details
- Use the search modal to find specific complaints
- Apply filters to focus on specific data subsets

#### 3. Analytics
- Review performance metrics in the analytics dashboard
- Analyze complaint trends through interactive charts
- Compare data across different boroughs and time periods

## 🧩 Components

### DataDashboard
Main dashboard component that orchestrates all data visualization components.

**Features:**
- Real-time statistics overview
- Advanced filtering system
- Loading state management
- Component coordination

**Props:**
- None (manages internal state)

### WorkingMap
Interactive map component with filtering and search capabilities.

**Features:**
- Real-time marker rendering
- Custom status-colored markers
- Search modal integration
- Filter-based marker updates

**Props:**
```typescript
interface WorkingMapProps {
  filters: FilterObject;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  isLoading?: boolean;
}
```

### EnhancedCharts
Data visualization component.

**Features:**
- Multiple chart types (Bar, Doughnut)
- Real-time data updates
- Responsive design
- Loading overlays

**Props:**
```typescript
interface EnhancedChartsProps {
  filters: FilterObject;
  isLoading?: boolean;
}
```

### SearchModal
Sleek search interface with modern UX.

**Features:**
- Glassmorphism design
- Quick search suggestions
- Keyboard navigation
- Auto-focus functionality

**Props:**
```typescript
interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (term: string) => void;
  currentSearch?: string;
}
```

## 🔌 API Integration

### NYC Open Data API
The application integrates with NYC's official 311 complaints API through a custom Next.js API route.

**Endpoint:** `/api/nyc-complaints`

**Features:**
- Real-time data fetching
- Query parameter handling
- Error handling and fallbacks
- Response caching

**Query Parameters:**
- `limit`: Number of records to fetch
- `complaint_type`: Filter by complaint type
- `borough`: Filter by borough
- `status`: Filter by status
- `$where`: Custom Socrata query

### RTK Query Integration
Uses Redux Toolkit Query for efficient data management:

```typescript
// API slice configuration
export const nycOpenDataApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getNYCComplaints: builder.query<NYCComplaint[], ComplaintsFilters>({
      query: (filters) => ({
        url: '/nyc-complaints',
        params: filters,
      }),
    }),
    // ... other endpoints
  }),
});
```

## 🗃️ State Management

### Redux Store Configuration
```typescript
export const makeStore = () => {
  return configureStore({
    reducer: {
      [baseApi.reducerPath]: baseApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(baseApi.middleware),
    devTools: process.env.NODE_ENV !== 'production',
  });
};
```

### Data Flow
1. **User Interaction** → Filter changes trigger API calls
2. **RTK Query** → Manages caching and data fetching
3. **Component Updates** → Real-time UI updates with loading states
4. **State Persistence** → Filter state maintained across components

### Caching Strategy
- **Automatic Caching**: RTK Query handles intelligent caching
- **Cache Invalidation**: Smart cache updates on data changes
- **Background Refetching**: Automatic data refresh strategies

## 🎨 Styling & Design

### Design System
- **Color Palette**: Dark theme with emerald and sky accents
- **Typography**: Geist font family for modern readability
- **Spacing**: Consistent spacing using Tailwind utilities
- **Components**: Reusable component library with consistent styling

### Key Design Features
- **Glassmorphism**: Frosted glass effects for modern UI
- **Gradients**: Subtle gradients for depth and visual interest
- **Animations**: Smooth transitions and loading states
- **Responsive**: Mobile-first responsive design

### CSS Architecture
```css
/* Global styles with custom properties */
:root {
  --font-geist-sans: 'Geist', sans-serif;
  --font-geist-mono: 'Geist Mono', monospace;
}

/* Component-specific styles */
.custom-marker {
  /* Leaflet marker customization */
}
```

## ⚡ Performance

### Optimization Strategies
- **Code Splitting**: Dynamic imports for heavy components
- **Image Optimization**: Next.js automatic image optimization
- **Bundle Analysis**: Turbopack for fast development builds
- **Caching**: RTK Query intelligent caching

### Performance Metrics
- **First Load JS**: ~221 kB (optimized)
- **Build Time**: Fast builds with Turbopack
- **Runtime Performance**: Smooth 60fps animations
- **Memory Usage**: Efficient state management

### Loading States
- **Skeleton Loading**: Placeholder content during data fetch
- **Progressive Loading**: Staged component loading
- **Error Boundaries**: Graceful error handling

## 🛠️ Development

### Development Workflow
1. **Feature Development**: Create feature branches
2. **Component Testing**: Test individual components
3. **Integration Testing**: Test component interactions
4. **Performance Testing**: Monitor bundle size and runtime

### Code Quality
- **TypeScript**: Full type safety
- **ESLint**: Code linting and formatting
- **Component Architecture**: Modular, reusable components
- **Error Handling**: Comprehensive error boundaries

### Testing Strategy
- **Component Testing**: Individual component validation
- **Integration Testing**: Component interaction testing
- **Performance Testing**: Bundle size and runtime monitoring

## 🚀 Deployment

### Build Process
```bash
# Production build
npm run build

# Build analysis
npm run analyze
```

### Deployment Options
- **Vercel**: Recommended for Next.js applications
- **Netlify**: Alternative deployment platform
- **Docker**: Containerized deployment
- **Self-hosted**: Custom server deployment

### Environment Configuration
```env
# Production environment
NEXT_PUBLIC_API_URL=https://your-domain.com/api
NODE_ENV=production
```

## 🤝 Contributing

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### Code Standards
- **TypeScript**: Use strict typing
- **Components**: Follow React best practices
- **Styling**: Use Tailwind CSS utilities
- **Documentation**: Document complex logic

### Pull Request Process
1. **Description**: Clear description of changes
2. **Testing**: Include test results
3. **Documentation**: Update relevant documentation
4. **Review**: Address review feedback

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **NYC Open Data**: For providing the 311 complaints dataset
- **Next.js Team**: For the excellent React framework
- **Redux Team**: For the powerful state management solution
- **Leaflet Community**: For the mapping library
- **Chart.js Team**: For the visualization library

## 📞 Support

For support and questions:
- **Issues**: Create an issue on GitHub
- **Discussions**: Use GitHub Discussions
- **Documentation**: Check the project documentation

---

**Built with ❤️ for NYC data transparency and civic engagement.**