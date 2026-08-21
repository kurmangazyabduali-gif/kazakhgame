# 3D Development Guide

How to create a new 3D National Game in ULY DALA.

## 1. Create Game Config
Implement the `ThreeGameConfig` interface to define camera modes and physics needs.

```ts
const config: ThreeGameConfig = {
  id: 'jamby-atu',
  slug: 'jamby-atu',
  cameraMode: 'first-person',
  physicsEnabled: true,
  shadowsEnabled: true
}
```

## 2. Create the Scene Component
Create your specific React component that uses R3F. Wrap interactive elements using the `useInteractable` hook.

```tsx
function Target() {
  const interact = useInteractable('target-1')
  return (
    <GamePhysicsBody colliders="cylinder">
      <mesh {...interact}>
         <cylinderGeometry args={[1, 1, 0.1]} />
         <meshStandardMaterial />
      </mesh>
    </GamePhysicsBody>
  )
}
```

## 3. Implement `ThreeGameInstance`
This class manages the logic and lifecycle, bridging your 3D Scene with the platform `GameSession`.

```ts
class JambyAtuInstance implements ThreeGameInstance {
  async initialize() {
     // Preload models using AssetLoader
  }
  start() {
     // Trigger UI to show game started
  }
  pause() {}
  resume() {}
  reset() {}
  dispose() {
     // Crucial: Clean up intervals, events, and manually cached assets
  }
}
```

## 4. Mount in Next.js Page
Create the `/games/[slug]/play/page.tsx` route using the shared `ThreeGameCanvas`.

```tsx
export default function JambyAtuPage() {
  return (
    <ThreeGameCanvas physicsEnabled>
       <Environment preset="steppe" />
       <CameraManager mode="first-person" />
       <JambyAtuScene />
    </ThreeGameCanvas>
  )
}
```

## Best Practices
- **Do not** use `useState` for positions/rotations updating every frame. Use Zustand `useStore.getState()` or React `useRef` and `useFrame` from R3F.
- **Always** wrap physics components in `<PhysicsAdapter>`.
- **Always** ensure your game can run on `LOW` quality without shadows or heavy post-processing for mobile devices.
