<div align="center">

# 🗞️ The Etheria Times

[![License](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)](https://github.com/etheriatimes/website/blob/main/LICENSE) [![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/) [![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/) [![React](https://img.shields.io/badge/React-19.2.1-blue?style=for-the-badge&logo=react)](https://react.dev/) [![Prisma](https://img.shields.io/badge/Prisma-7.4-2E5090?style=for-the-badge&logo=prisma)](https://www.prisma.io/) [![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/)

**🎯 Modern Daily News Platform - Full-Stack Multi-Language News Application**

A next-generation daily news website built with **Next.js 16**, **React 19**, **TypeScript**, and **Prisma** with **PostgreSQL**. Featuring **multi-language support**, **user authentication**, **article management**, **subscription system**, and **advertising capabilities**.

[🚀 Quick Start](#-quick-start) • [📋 Features](#-features) • [🛠️ Tech Stack](#️-tech-stack) • [📁 Architecture](#-architecture) • [🌍 Internationalization](#-internationalization) • [🤝 Contributing](#-contributing)

[![GitHub stars](https://img.shields.io/github/stars/etheriatimes/etheriatimes?style=social)](https://github.com/etheriatimes/etheriatimes/stargazers) [![GitHub forks](https://img.shields.io/github/forks/etheriatimes/etheriatimes?style=social)](https://github.com/etheriatimes/etheriatimes/network) [![GitHub issues](https://img.shields.io/github/issues/etheriatimes/etheriatimes)](https://github.com/etheriatimes/etheriatimes/issues)

</div>

---

## 🎯 What is The Etheria Times?

**The Etheria Times** is a comprehensive daily news platform that has **evolved significantly** from its initial concept. Originally a simple news aggregator, it has grown into a **complete ecosystem** featuring multi-language support, user authentication, subscription management, article publishing, and enterprise-ready capabilities.

### 🌟 Our Vision

- **🏗️ Full-Stack Modern Architecture** - Next.js 16 + React 19 + TypeScript 5 frontend + PostgreSQL database
- **🌍 Multi-Language Support** - 7 languages (French, English, Spanish, German, Belgian French, Belgian Dutch, Swiss French)
- **🔐 Complete Authentication System** - JWT-based system with login/register forms and React context
- **📰 Article Management System** - Full CRUD for articles with categories, comments, and bookmarks
- **💳 Subscription Management** - Essential and Premium plans with payment tracking
- **📊 Advertising Platform** - Campaign management, placements, and analytics
- **🔔 Notification System** - Real-time notifications for users
- **📧 Newsletter Campaigns** - Email campaign management with tracking
- **🔒 Security Features** - Session management, security activities, audit logs
- **🛠️ Developer-Friendly** - TypeScript strict mode, ESLint, Prettier, Husky

---

## 📋 Features

### 🎯 **Core Features**

- ✅ **Complete Authentication System** - JWT with login/register forms and React context
- ✅ **Multi-Language News Platform** - 7 supported languages with next-intl
- ✅ **Article Management** - Full CRUD with categories, comments, and bookmarks
- ✅ **User Profiles** - Custom profiles with preferences and reading history
- ✅ **Subscription System** - Essential and Premium plans with payment tracking
- ✅ **Comment System** - Threaded comments with moderation capabilities
- ✅ **Bookmarking** - Save articles for later reading
- ✅ **Reading History** - Track user reading activity

### 🏢 **Enterprise Features**

- ✅ **Advertising Management** - Campaign and placement management
- ✅ **Social Media Integration** - Connect and auto-post to social platforms
- ✅ **Scheduled Posts** - Schedule social media posts in advance
- ✅ **Newsletter Campaigns** - Create and track email campaigns
- ✅ **SEO Tools** - SEO audits and keyword tracking
- ✅ **API Keys** - Developer API access management
- ✅ **Audit Logging** - Complete activity tracking
- ✅ **System Settings** - Configurable site settings

### 🛠️ **Development Features**

- ✅ **TypeScript Strict Mode** - Full type safety
- ✅ **ESLint + Prettier** - Code quality and formatting
- ✅ **Husky Pre-commit** - Git hooks for quality control
- ✅ **Prisma ORM** - Type-safe database operations
- ✅ **Docker Support** - Containerized deployment
- ✅ **Hot Reload** - Fast development iteration

---

## 🚀 Quick Start

### 📋 Prerequisites

- **Node.js** 18.0.0 or higher
- **pnpm** 8.0.0 or higher (recommended package manager)
- **PostgreSQL** 14.0 or higher (for database)
- **Docker** (optional, for deployment)
- **Make** (for command shortcuts - included with most systems)

### 🔧 Installation & Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/etheriatimes/etheriatimes.git
   cd etheriatimes
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Environment setup**

   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

4. **Database initialization**

   ```bash
   pnpm db:generate
   pnpm db:migrate
   ```

5. **Start development servers**

   ```bash
   pnpm dev
   ```

### 🌐 Access Points

Once running, you can access:

- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **API Server**: [http://localhost:8080](http://localhost:8080) (if running)
- **Database Studio**: `pnpm db:studio`

### 🎯 **Make Commands**

```bash
# 🚀 Quick Start & Development
make dev                 # Start all services (frontend + backend)
make dev-frontend        # Frontend only (port 3000)
make dev-backend         # Backend only (port 8080)

# 🗄️ Database
make db-studio           # Open Prisma Studio
make db-migrate          # Run migrations
make db-seed             # Seed development data

# 🔧 Code Quality & Testing
make lint                # Lint all packages
make lint-fix            # Auto-fix linting issues
make typecheck           # TypeScript type checking
make test                # Run all tests

# 🏗️ Building & Production
make build               # Build all packages
make build-frontend      # Frontend production build
make start               # Start production servers

# 🐳 Docker
make docker-build        # Build Docker image
make docker-run         # Run with Docker Compose
make docker-stop        # Stop Docker services
```

---

## 🛠️ Tech Stack

### 🎨 **Frontend Layer**

```
Next.js 16 + React 19.2.1 + TypeScript 5
├── 🎨 Tailwind CSS v4 + shadcn/ui (Styling & Components)
├── 🔐 JWT Authentication (Complete Implementation)
├── 🛣️ Next.js App Router (Routing)
├── 🌐 next-intl (Internationalization - 7 languages)
├── 📝 TypeScript Strict Mode (Type Safety)
├── 🔄 React Context (State Management)
└── 🔧 ESLint + Prettier + Husky (Code Quality)
```

### ⚙️ **Backend Layer**

```
Go 1.21+ + Gin Framework
├── 🗄️ Prisma ORM + PostgreSQL (Database Layer)
├── 🔐 JWT Authentication (Complete Implementation)
├── 🛡️ Middleware (Security, CORS, Logging)
├── 🌐 HTTP Router (Gin Router)
├── 📦 JSON Serialization (Native Go)
└── 📊 Structured Logging (Zerolog)
```

### 🗄️ **Data Layer**

```
PostgreSQL + Prisma ORM
├── 🏗️ Schema Management (Auto-migration)
├── 🔍 Type-Safe Queries (Prisma Client)
├── 🔄 Connection Pooling (Performance)
├── 👤 User Models (Complete Implementation)
└── 📈 Seed Scripts (Development Data)
```

### 🏗️ **Monorepo Infrastructure**

```
pnpm Workspaces + TypeScript
├── 📦 app/ (Next.js Frontend - TypeScript)
├── ⚙️ server/ (Go Backend - Go)
├── 🛠️ tools/ (Development Utilities - TypeScript)
├── 📦 package/ (Package Ecosystem)
│   ├── node/ (Node.js SDK)
│   ├── vscode/ (VS Code Extension)
│   ├── extension/ (Browser Extension)
│   └── snap/ (Snap Package)
├── 🗂️ messages/ (Internationalization)
├── 📚 tests/ (Test Suites)
└── 🐳 docker/ (Container Configuration)
```

---

## 📁 Architecture

### 🏗️ **Project Structure**

```
website/
├── app/                     # Next.js 16 Frontend Application (TypeScript)
│   ├── app/                # Next.js App Router pages
│   │   ├── (auth)/        # Authentication pages (login, register)
│   │   ├── (public)/      # Public pages
│   │   │   └── [locale]/  # Localized pages
│   │   │       ├── article/    # Article pages
│   │   │       ├── politique/  # Category pages
│   │   │       ├── economie/   # Economy section
│   │   │       ├── monde/     # World news
│   │   │       ├── culture/   # Culture section
│   │   │       ├── sport/     # Sports section
│   │   │       ├── informatique/ # Tech section
│   │   │       ├── video-game/ # Gaming section
│   │   │       ├── espace/    # Space section
│   │   │       └── environnement/ # Environment
│   │   ├── newsletter/    # Newsletter pages
│   │   ├── abonnement/     # Subscription pages
│   │   └── pgp/           # PGP key pages
│   ├── components/        # React components
│   ├── context/           # React contexts (Auth, Locale, License)
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utilities and API clients
│   │   ├── api/          # API client functions
│   │   └── auth/         # Authentication utilities
│   └── public/           # Static assets
├── server/                 # Go Backend Server (Future)
│   └── prisma/           # Database schema and migrations
├── package/                # Package Ecosystem
│   ├── node/             # Node.js SDK
│   ├── vscode/           # VS Code Extension
│   ├── extension/        # Browser Extension
│   └── snap/             # Snap Package
├── messages/              # Internationalization files
│   ├── fr.json           # French
│   ├── en.json           # English
│   ├── es.json           # Spanish
│   ├── de.json           # German
│   ├── be_fr.json        # Belgian French
│   ├── be_nl.json        # Belgian Dutch
│   └── ch_fr.json        # Swiss French
├── docker/                # Docker Configuration
├── tests/                 # Test Suites
├── tools/                 # Development Utilities
├── prisma.config.ts       # Prisma configuration
├── package.json          # Root package.json with workspaces
└── Makefile              # Build commands
```

### 🔄 **Data Flow Architecture**

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Next.js App   │    │   Prisma ORM     │    │   PostgreSQL    │
│   (Frontend)    │◄──►│   (Type-Safe)    │◄──►│   (Database)    │
│  Port 3000      │    │                  │    │  Port 5432     │
│  TypeScript     │    │                  │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
        │                       │                       │
        ▼                       ▼                       ▼
  React Context            TypeScript              User Data
  JWT Tokens              Prisma Client           Articles/Categories
  shadcn/ui Components    Migrations              Comments/Bookmarks
        │                       │
        ▼                       ▼
┌─────────────────┐    ┌──────────────────┐
│   User Auth     │    │   Notifications  │
│   Login/Register│    │   System         │
│   Sessions      │    │   Real-time      │
└─────────────────┘    └──────────────────┘
```

---

## 🌍 Internationalization

### 🌐 **Supported Languages**

| Code  | Language | Region      |
| ----- | -------- | ----------- |
| fr    | French   | France      |
| en    | English  | -           |
| es    | Spanish  | -           |
| de    | German   | -           |
| be_fr | French   | Belgium     |
| be_nl | Dutch    | Belgium     |
| ch_fr | French   | Switzerland |

### 📁 **Translation Files**

Translations are stored in `messages/` directory:

- `fr.json` - French (default)
- `en.json` - English
- `es.json` - Spanish
- `de.json` - German
- `be_fr.json` - Belgian French
- `be_nl.json` - Belgian Dutch
- `ch_fr.json` - Swiss French

### 🔧 **Using Translations**

```typescript
import { useTranslations } from "next-intl";

// In a Next.js component
const t = useTranslations("Common");
return <h1>{t("welcome")}</h1>;
```

---

## 📊 Database Schema

### 🏗️ **Core Models**

| Model              | Description                                    |
| ------------------ | ---------------------------------------------- |
| **User**           | User accounts with roles (USER, EDITOR, ADMIN) |
| **UserProfile**    | User preferences, language, timezone           |
| **Subscription**   | Subscription plans (ESSENTIAL, PREMIUM)        |
| **Article**        | News articles with content, categories, status |
| **Category**       | Article categories with hierarchy              |
| **Comment**        | Article comments with threading                |
| **Bookmark**       | User article bookmarks                         |
| **ReadingHistory** | User reading activity                          |
| **Notification**   | User notifications                             |
| **Media**          | Uploaded images and files                      |

### 🏢 **Enterprise Models**

| Model                  | Description                     |
| ---------------------- | ------------------------------- |
| **SocialAccount**      | Connected social media accounts |
| **AdCampaign**         | Advertising campaigns           |
| **AdPlacement**        | Ad placement zones              |
| **ScheduledPost**      | Scheduled social media posts    |
| **NewsletterCampaign** | Email newsletter campaigns      |
| **ApiKey**             | Developer API keys              |
| **AuditLog**           | System activity logs            |
| **SystemLog**          | Application logs                |
| **SeoAudit**           | SEO audit results               |
| **Keyword**            | Tracked keywords                |

---

## 🔐 Authentication System

### 🎯 **Complete Implementation**

The authentication system is fully implemented:

- **JWT Tokens** - Secure token-based authentication
- **Login/Register Forms** - Complete user authentication flow
- **Auth Context** - Global authentication state in React
- **Session Management** - Database-backed sessions
- **Security Activities** - Track login attempts and security events
- **Password Security** - bcrypt hashing for secure storage
- **Role-Based Access** - USER, EDITOR, ADMIN roles

### 🔄 **Authentication Flow**

```
1. User submits registration → API validation
2. Password hashing with bcrypt → Database storage
3. JWT tokens generated → Client receives tokens
4. Auth context updates → User logged in

1. User submits credentials → API validation
2. Password verification → JWT token generation
3. Session created in database → Client stores tokens
4. Protected route access → Auth context verified
```

---

## 💻 Development

### 📋 **Development Workflow**

```bash
# New developer setup
pnpm install
cp .env.example .env
pnpm db:generate
pnpm db:migrate
pnpm dev

# Daily development
pnpm dev                 # Start working
pnpm lint-fix           # Fix code issues
pnpm typecheck          # Verify types

# Before committing
pnpm lint               # Check code quality
pnpm typecheck          # Verify types

# Database changes
pnpm db:migrate         # Apply migrations
pnpm db:studio          # Browse database

# Production deployment
pnpm build              # Build everything
pnpm docker:build       # Create Docker image
pnpm docker:run         # Deploy
```

### 🎯 **Project Scripts**

```bash
# Development
pnpm dev                # Start all services
pnpm dev:frontend      # Frontend only
pnpm dev:backend       # Backend only

# Database
pnpm db:generate       # Generate Prisma client
pnpm db:migrate        # Run migrations
pnpm db:studio         # Open Prisma Studio
pnpm db:seed           # Seed data

# Code Quality
pnpm lint              # Lint all packages
pnpm lint:fix          # Fix linting issues
pnpm typecheck         # Type check all packages

# Build
pnpm build             # Build all packages
pnpm build:frontend    # Build frontend
pnpm build:backend     # Build backend

# Docker
pnpm docker:build      # Build Docker image
pnpm docker:run        # Run containers
pnpm docker:stop       # Stop containers
```

---

## 🤝 Contributing

We're looking for contributors to help build this comprehensive news platform! Whether you're experienced with TypeScript, Next.js, PostgreSQL, or web development in general, there's a place for you.

### 🎯 **How to Get Started**

1. **Fork the repository** and create a feature branch
2. **Check the issues** for tasks that need help
3. **Join discussions** about architecture and features
4. **Start small** - Documentation, tests, or minor features
5. **Follow our code standards** and commit guidelines

### 🏗️ **Areas Needing Help**

- **Frontend Development** - React components, UI/UX design
- **Backend Development** - API endpoints, business logic
- **Database Design** - Schema development, migrations, optimization
- **Internationalization** - Translation improvements
- **DevOps Engineers** - Docker, deployment, CI/CD
- **Security Specialists** - Authentication, encryption
- **Documentation** - API docs, user guides, tutorials
- **Testing** - Unit and integration tests

### 📝 **Contribution Process**

1. **Choose an area** - Frontend, backend, or documentation
2. **Read the docs** - Understand project conventions
3. **Create a branch** with a descriptive name
4. **Implement your changes** following guidelines
5. **Test thoroughly** in all relevant environments
6. **Submit a pull request** with clear description
7. **Address feedback** from maintainers

---

## 📞 Support & Community

### 💬 **Get Help**

- 📖 **[Documentation](http://localhost:3000/docs)** - Comprehensive guides
- 🐛 **[GitHub Issues](https://github.com/etheriatimes/etheriatimes/issues)** - Bug reports
- 💡 **[GitHub Discussions](https://github.com/etheriatimes/etheriatimes/discussions)** - Questions
- 📧 **Email** - developer@etheriatimes.com

### 🐛 **Reporting Issues**

When reporting bugs, please include:

- Clear description of the problem
- Steps to reproduce
- Environment information (Node.js version, OS, etc.)
- Error logs or screenshots
- Expected vs actual behavior

---

## 📊 Project Status

| Component                 | Status         | Technology            | Notes                           |
| ------------------------- | -------------- | --------------------- | ------------------------------- |
| **Frontend Framework**    | ✅ Working     | Next.js 16 + React 19 | Full-featured news platform     |
| **Authentication System** | ✅ Working     | JWT (TypeScript)      | Full implementation with forms  |
| **Database Layer**        | ✅ Working     | Prisma + PostgreSQL   | Complete schema with 25+ models |
| **Internationalization**  | ✅ Working     | next-intl             | 7 languages supported           |
| **Article Management**    | ✅ Working     | TypeScript + Prisma   | Full CRUD with categories       |
| **User Management**       | ✅ Working     | TypeScript + Prisma   | Profiles, subscriptions         |
| **Comment System**        | ✅ Working     | TypeScript + Prisma   | Threaded comments               |
| **Bookmark System**       | ✅ Working     | TypeScript + Prisma   | User bookmarks                  |
| **Notification System**   | ✅ Working     | TypeScript + Prisma   | Real-time notifications         |
| **Advertising System**    | ✅ Working     | TypeScript + Prisma   | Campaign management             |
| **Social Integration**    | ✅ Working     | TypeScript + Prisma   | Social accounts and scheduling  |
| **Newsletter System**     | ✅ Working     | TypeScript + Prisma   | Campaign management             |
| **API System**            | ✅ Working     | TypeScript + Prisma   | API keys and access             |
| **Backend API**           | 🔄 Planned     | Go + Gin              | High-performance API server     |
| **Testing Suite**         | 📋 Planned     | TypeScript            | Unit and integration tests      |
| **SEO Tools**             | 🔄 In Progress | TypeScript + Prisma   | Audit and keyword tracking      |

---

## 🏆 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2025 The Etheria Times

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

---

## 🙏 Acknowledgments

- **Next.js Team** - Excellent React framework
- **React Team** - Modern UI library
- **Prisma Team** - Modern database toolkit
- **Tailwind CSS Team** - Utility-first CSS framework
- **shadcn/ui** - Beautiful component library
- **pnpm** - Fast, disk space efficient package manager
- **Open Source Community** - Tools, libraries, and inspiration

---

<div align="center">

### 🗞️ **Join Us in Building the Future of Digital News!**

[⭐ Star This Repo](https://github.com/etheriatimes/etheriatimes) • [🐛 Report Issues](https://github.com/etheriatimes/etheriatimes/issues) • [💡 Start a Discussion](https://github.com/etheriatimes/etheriatimes/discussions)

---

**🗞️ The Etheria Times - Your Trusted Daily News Source**

**Made with ❤️ by [The Etheria Times](https://etheriatimes.com) team**

_Building a modern multi-language news platform with Next.js, React, and PostgreSQL_

</div>
