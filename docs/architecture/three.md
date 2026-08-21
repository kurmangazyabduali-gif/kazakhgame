# 3D Engine Architecture

This document describes the architectural foundation for 3D games within the ULY DALA platform.

## Overview

The 3D engine is built on top of:
- **Three.js** (Core WebGL Rendering)
- **React Three Fiber (R3F)** (Declarative React bindings for Three.js)
- **Drei** (Useful helpers for R3F)
- **Rapier / `@react-three/rapier`** (Physics Engine)
- **Zustand** (Fast state management outside the React render loop)

## Core Principles

1. **Separation of Concerns:** The 3D Engine handles rendering, physics, input, and assets. The Platform Game Engine (`GameSession`, `EventDispatcher`) handles score, XP, and achievements.
2. **Memory Management:** Models and materials must be cached properly and disposed of when unmounting to prevent WebGL context leaks during Next.js client-side navigation.
3. **Performance First:** 60 FPS target on desktop, 30+ FPS on mobile. The `PerformanceManager` dictates quality scaling.

## Directory Structure (`src/three/`)

- `/engine`: Core orchestrator (`ThreeGameEngine`), Scene Management, and Performance Management.
- `/components`: R3F reusable UI/Scene components (`ThreeGameCanvas`, `Environment`, `DebugUI`).
- `/systems`: Abstracted logic (`PhysicsAdapter`, `CameraManager`, `InteractionSystem`).
- `/assets`: Loading and caching logic (`AssetLoader`, `AnimationSystem`).
- `/types`: Strict TypeScript contracts (`ThreeGameConfig`, `ThreeGameInstance`).

## Physics Abstraction

We use a `PhysicsAdapter` (currently wrapping Rapier). Game objects use `<GamePhysicsBody>` rather than importing Rapier directly. This allows us to swap the physics engine in the future if needed, without rewriting all game components.

## Memory Lifecycle

1. Navigate to 3D Game Route -> `ThreeGameCanvas` mounts.
2. `AssetLoader.preload()` fetches necessary GLTFs during Suspense.
3. Game plays. State is tracked in Zustand stores to avoid React re-renders.
4. Navigate away -> `ThreeGameCanvas` unmounts. R3F automatically calls `dispose()` on geometries and materials attached to the scene. Custom `ModelCache.clear()` can be called if memory gets too high.
