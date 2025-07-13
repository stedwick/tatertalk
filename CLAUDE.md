# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Tatertalk is a speech-to-text application built with Tauri, React, and TypeScript. The application features a sophisticated punctuation system that transforms spoken dialogue into properly punctuated text using a functional programming approach.

## Development Commands

**Package Manager**: Use `bun` instead of npm for all package management and script execution.

```bash
# Development
bun run dev          # Start development server (Vite + Tauri)
bun run build        # Build for production (TypeScript compilation + Vite build)
bun run preview      # Preview production build
bun run tauri        # Run Tauri CLI commands

# Testing
bun test src/lang/punctuation.test.ts  # Run punctuation system tests
```

## Technology Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS v4 + DaisyUI components
- **State Management**: XState v5 (Stately)
- **Desktop Framework**: Tauri v2 (Rust backend)
- **Functional Programming**: Effect library (v3.16.11)

## Architecture

### Frontend Structure
- `src/App.tsx` - Main React application component
- `src/components/` - Reusable React components
- `src/lang/` - Core punctuation processing system
- `src/xstate/` - State machine definitions using XState

### Punctuation System (`src/lang/`)
The core feature is a pure TypeScript punctuation system that transforms spoken text:

- **Architecture**: Functional pipeline using pure functions and composition
- **Pipeline**: 15-step transformation process (trim → punctuation → capitalization → spacing)
- **Features**: Handles punctuation, capitalization, quotes, smileys, special cases
- **Testing**: Comprehensive test suite with `punctuation.test.ts`

Key transformations include:
- Spoken punctuation ("comma" → ",", "period" → ".")
- Smart capitalization and spacing
- Quote handling and apostrophes
- Emoticon processing ("smiley face" → ":)")

### Tauri Backend (`src-tauri/`)
- Minimal Rust backend using Tauri framework
- `src-tauri/src/main.rs` - Entry point
- `src-tauri/src/lib.rs` - Core application logic
- Cross-platform desktop application support

## Development Guidelines

### UI Components
- Use **Tailwind CSS v4** for styling
- Use **DaisyUI** components for React UI elements
- Example: `<button className="btn btn-primary">Click me</button>`

### State Management
- Use **XState v5** (Stately) for complex state management
- Store state machines in `src/xstate/` directory

### Code Style
- TypeScript with strict configuration
- React functional components with hooks
- Pure functional approach for data transformations
- No unused locals/parameters (enforced by tsconfig)

### Project-Specific Patterns
- Prefer functional composition over object-oriented patterns
- Use the `pipe` utility for transformation chains in the punctuation system
- Maintain immutability in data transformations
- Keep punctuation transformations as pure functions for testability

## Configuration Files

- `vite.config.ts` - Vite configuration with Tauri integration and Tailwind
- `tsconfig.json` - Strict TypeScript configuration
- `src-tauri/tauri.conf.json` - Tauri application configuration
- `.cursor/rules/` - Contains project-specific rules for bun, XState, and DaisyUI usage