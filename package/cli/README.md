<div align="center">

# 🚀 Etheria Times CLI

[![License](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)](https://github.com/etheriatimes/etheriatimes/blob/main/LICENSE) [![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/) [![Node.js](https://img.shields.io/badge/Node.js-18+-green?style=for-the-badge&logo=node.js)](https://nodejs.org/) [![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)

**✨ Modern CLI for Etheria Times - Article Management & Publishing**

A powerful command-line interface for creating, previewing, and publishing articles on the Etheria Times platform.

[🚀 Quick Start](#-quick-start) • [📋 Commands](#-commands) • [🛠️ Tech Stack](#️-tech-stack) • [📁 Architecture](#-architecture) • [🤝 Contributing](#-contributing)

</div>

---

## 🌟 What is Etheria Times CLI?

**Etheria Times CLI** is a modern command-line tool designed to streamline article management for the Etheria Times platform. It provides a complete workflow for creating, previewing, and publishing content directly from your terminal.

### 🎯 Key Features

- **📝 Article Management** - Create and manage articles with ease
- **👁️ Live Preview** - Preview articles before publishing
- **⚙️ Configuration Management** - Configure API endpoints and settings
- **🔗 API Integration** - Seamless integration with Etheria Times backend
- **🎨 Rich Editor Support** - Built-in editor utilities for content creation
- **🚀 TypeScript Native** - Built with TypeScript for type safety

---

## 🚀 Quick Start

### 📋 Prerequisites

- **Node.js** 18.0.0 or higher
- **pnpm** 9.0.0 or higher (recommended)

### 🔧 Installation

```bash
# Clone the repository
git clone https://github.com/etheriatimes/etheriatimes.git
cd etheriatimes

# Install dependencies
cd package/cli
pnpm install

# Build the CLI
pnpm build

# Link globally (optional)
pnpm link
```

### 💡 Usage

```bash
# After linking
etheriatimes --help

# Or directly with pnpm
pnpm exec etheriatimes --help
```

---

## 📋 Commands

### 📝 Article Commands

```bash
# Create a new article
etheriatimes article create

# Preview an article
etheriatimes article preview

# List articles
etheriatimes article list
```

### ⚙️ Configuration Commands

```bash
# View current configuration
etheriatimes config show

# Set API endpoint
etheriatimes config set api-url <url>

# Set API key
etheriatimes config set api-key <key>
```

### 📖 Help

```bash
# Get help for any command
etheriatimes --help
etheriatimes article --help
etheriatimes config --help
```

---

## 🛠️ Tech Stack

```
TypeScript 5 + Node.js
├── 📦 Commander.js (CLI Framework)
├── 🔐 Type Safety (TypeScript Strict Mode)
├── 🔄 ESM Modules (Modern JavaScript)
└── 🎨 Inquirer (Interactive prompts)
```

---

## 📁 Architecture

```
package/cli/
├── src/
│   ├── commands/
│   │   ├── article.ts    # Article management commands
│   │   └── config.ts     # Configuration commands
│   ├── utils/
│   │   ├── api.ts        # API client utilities
│   │   ├── config.ts     # Configuration management
│   │   ├── editor.ts     # Editor utilities
│   │   └── preview.ts    # Preview utilities
│   └── index.ts          # CLI entry point
├── dist/                 # Compiled JavaScript
├── package.json
└── tsconfig.json
```

---

## 🔐 Configuration

The CLI uses a configuration file to store API settings. You can configure:

- **API URL** - The backend API endpoint
- **API Key** - Your authentication key
- **Editor** - Preferred editor for content creation

Configuration is stored in `~/.etheriatimes/config.json`.

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