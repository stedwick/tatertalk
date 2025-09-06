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

# Code Quality
bun run check        # Run Biome linter/formatter with auto-fix
bun run check:ci     # Run Biome check without auto-fix (CI mode)

# Storybook
bun run storybook    # Start Storybook development server
bun run build-storybook  # Build Storybook for production
bun run test-storybook   # Run Storybook tests with Vitest
```

## Technology Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS v4 + DaisyUI components
- **State Management**: XState v5 (Stately) + Jotai
- **Desktop Framework**: Tauri v2 (Rust backend)
- **Speech Recognition**: AssemblyAI, Azure Cognitive Services, Web Speech API
- **Testing**: Bun test runner, Vitest (for Storybook)
- **Linting/Formatting**: Biome
- **Functional Programming**: Effect library (v3.16.11)

## Architecture

### Frontend Structure
- `src/App.tsx` - Main React application component
- `src/components/` - Atomic Design pattern (atoms → molecules → organisms → pages → templates)
- `src/lang/` - Core punctuation processing system and speech recognition logic
- `src/lib/` - Utility libraries (auth, settings, textarea management)
- `src/atoms/` - Jotai atoms for global state management
- `src/stories/` - Storybook stories for component documentation

### Punctuation System (`src/lang/`)
The core feature is a pure TypeScript punctuation system that transforms spoken text:

- **Architecture**: Functional pipeline using pure functions and composition
- **Pipeline**: 15-step transformation process (trim → punctuation → capitalization → spacing)
- **Features**: Handles spoken punctuation conversion, smart capitalization, quote handling, emoticons
- **Testing**: Comprehensive test suite with `punctuation.test.ts` using Bun test runner

Key transformations include:
- Spoken punctuation ("comma" → ",", "period" → ".")
- Smart capitalization and spacing
- Quote handling and apostrophes
- Emoticon processing ("smiley face" → ":)")

### Speech Recognition (`src/lang/speechLogic.ts`)
- State machine implementation using XState v5
- Multiple provider support (AssemblyAI, Azure, Web Speech API)
- Provider machines in `src/lang/providers/`

### Tauri Backend (`src-tauri/`)
- Minimal Rust backend using Tauri framework
- `src-tauri/src/main.rs` - Entry point
- `src-tauri/src/lib.rs` - Core application logic
- Cross-platform desktop application support

## Development Guidelines

### Component Development
- Follow Atomic Design pattern in `src/components/` directory structure
- Check for existing components before creating new ones
- Use native DaisyUI components (no need to create wrappers for buttons, inputs, etc.)
- Write default Storybook stories for each component

### UI Components
- Use **Tailwind CSS v4** for styling (imported via `@import "tailwindcss"`)
- Use **DaisyUI** components for React UI elements
- Use **Heroicons** for icons (`@heroicons/react`)
- Use **clsx** for conditional class names
- Example: `<button className="btn btn-primary">Click me</button>`

### State Management
- Use **XState v5** (Stately) for complex state machines
- Use **Jotai** for global state with atoms in `src/atoms/`
- Use **Immer** if needed for immutable state updates

### Forms
- Use **React Hook Form** for form handling
- Use **Zod** for schema validation

### Authentication
- Use `src/atoms/authAtoms.ts` for auth state
- Use `src/lib/auth.ts` for auth operations

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