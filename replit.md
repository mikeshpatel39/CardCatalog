# Overview

This is a full-stack web application for managing cards with metadata including regions, sectors, authors, and version tracking. The application features a modern React frontend with a Node.js/Express backend, using PostgreSQL for data persistence and a comprehensive UI component library for consistent styling.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React with TypeScript and Vite for fast development and building
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management and caching
- **UI Components**: Shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming support
- **Forms**: React Hook Form with Zod validation for type-safe form handling

## Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API with structured error handling and request logging
- **Validation**: Zod schemas for runtime type validation
- **Development**: Hot reload with tsx for TypeScript execution

## Data Storage
- **Database**: PostgreSQL configured through Drizzle ORM
- **Schema Management**: Drizzle Kit for migrations and schema synchronization
- **Connection**: Neon Database serverless PostgreSQL adapter
- **Fallback Storage**: In-memory storage implementation for development/testing

## Database Schema
- **Cards Table**: Stores card information with fields for name, text content, region, sector, author, image URL, base/plain English flags, versions array, and timestamps
- **Schema Validation**: Shared Zod schemas between frontend and backend for consistent validation

## Development Tools
- **Build System**: Vite with React plugin for frontend, esbuild for backend bundling
- **Type Checking**: TypeScript with strict configuration and path mapping
- **Code Quality**: ESLint integration through Vite
- **Development Experience**: Replit-specific plugins for error overlay and debugging

## File Organization
- **Monorepo Structure**: Separate client, server, and shared directories
- **Shared Code**: Common schemas and types in shared directory
- **Component Architecture**: Modular UI components with separation of concerns
- **Asset Management**: Configured aliases for clean import paths

# External Dependencies

## Database Services
- **Neon Database**: Serverless PostgreSQL hosting platform
- **Drizzle ORM**: Type-safe database toolkit for schema management and queries

## UI and Styling
- **Radix UI**: Unstyled, accessible UI primitives for complex components
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Shadcn/ui**: Pre-built component library with consistent design system
- **Lucide React**: Icon library for consistent iconography

## Development and Build Tools
- **Vite**: Frontend build tool with hot module replacement
- **TypeScript**: Static type checking and enhanced developer experience
- **React Hook Form**: Performant forms with easy validation
- **TanStack Query**: Powerful data synchronization for React applications

## Utility Libraries
- **date-fns**: Modern JavaScript date utility library
- **clsx**: Utility for constructing className strings conditionally
- **class-variance-authority**: Type-safe variant API for component styling
- **zod**: TypeScript-first schema validation with static type inference

## Replit Integration
- **Development Banner**: Replit-specific development environment indicators
- **Error Overlay**: Enhanced error reporting in development mode
- **Cartographer**: Replit's code analysis and navigation tool integration