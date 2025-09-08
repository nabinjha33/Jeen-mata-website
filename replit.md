# Jeen Mata Impex Frontend Foundation

## Overview

Jeen Mata Impex Frontend Foundation is a React-based e-commerce platform built for an import/export business. The application serves as a product catalog and inquiry management system, allowing customers to browse products, brands, and submit product inquiries rather than direct purchases. The platform is designed with a focus on B2B interactions, featuring shipment tracking, multi-language support (English/Nepali), and a comprehensive component library based on shadcn/ui.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Framework
- **React 18.3.1** with **TypeScript** for type safety and modern development
- **Vite** as the build tool for fast development and optimized production builds
- **React Router DOM** for client-side routing and navigation

### UI Component System
- **shadcn/ui** component library built on top of **Radix UI** primitives
- **Tailwind CSS v4** for utility-first styling with custom design tokens
- **Lucide React** for consistent iconography
- **Class Variance Authority (CVA)** for component variant management

### State Management
- **Zustand** with persistence middleware for global application state
- Local React state with hooks for component-specific state
- Mock data fixtures for products, brands, categories, shipments, and inquiries

### Design System
- Custom color palette reflecting Jeen Mata Impex brand (deep red/brick primary, charcoal secondary, saffron accent)
- Responsive design with mobile-first approach
- Light/dark theme support using next-themes
- Typography scale with semantic naming (display, h1-h4, body, small, caption)

### Key Features Architecture
- **Inquiry Cart System**: Alternative to traditional e-commerce cart for B2B inquiries
- **Multi-language Support**: English/Nepali translations with i18n provider
- **Product Filtering**: Advanced filtering by category, price, brand, and availability
- **Shipment Tracking**: Status tracking for import/export shipments
- **Image Gallery**: Product image display with fallback handling

### Form Management
- **React Hook Form** for form state management and validation
- **Sonner** for toast notifications and user feedback
- Custom file upload components for document handling

### Navigation Structure
- Main layout with persistent navbar and footer
- Breadcrumb navigation for improved user orientation
- Responsive sidebar for admin functionality
- Search functionality with debounced input

### Performance Optimizations
- Lazy loading and code splitting ready infrastructure
- Optimized image handling with fallbacks
- Debounced search to reduce API calls
- Memoized computed values for filtering and sorting

## External Dependencies

### Core Framework Dependencies
- **React & React DOM** (18.3.1): Core framework
- **React Router DOM**: Client-side routing
- **TypeScript**: Type safety and development experience

### UI Component Libraries
- **@radix-ui/* packages**: Comprehensive set of unstyled, accessible UI primitives
- **Tailwind CSS**: Utility-first CSS framework with PostCSS processing
- **Lucide React**: Icon library for consistent iconography

### State and Form Management
- **Zustand**: Lightweight state management with persistence
- **React Hook Form**: Form state management and validation

### Development Tools
- **Vite**: Build tool and development server
- **@vitejs/plugin-react-swc**: Fast React refresh and compilation
- **Autoprefixer**: CSS vendor prefixing

### User Experience Enhancements
- **next-themes**: Theme switching (light/dark mode)
- **sonner**: Toast notification system
- **embla-carousel-react**: Carousel/slider functionality
- **react-day-picker**: Date picker component
- **input-otp**: OTP input handling
- **cmdk**: Command palette functionality

### Chart and Data Visualization
- **recharts**: Chart library for data visualization (likely for admin dashboards)

### Additional Utilities
- **class-variance-authority**: Component variant management
- **clsx & tailwind-merge**: Conditional class name utilities
- **react-resizable-panels**: Resizable layout panels

### Note on Database Integration
The application currently uses mock data fixtures but is structured to easily integrate with a backend API. The Zustand store provides a clean interface that can be extended to work with real API endpoints for products, categories, brands, inquiries, and shipments data.