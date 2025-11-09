# Puzzle Images

To use custom images for the puzzle game:

1. Add your images to this directory (jpg, png, webp formats supported)
2. Images should ideally be in a 2:3 aspect ratio (e.g., 600x900px) for best results
3. Update the `GAME_IMAGES` array in `/app/game/page.tsx` to reference your images

Example:
```typescript
const GAME_IMAGES: GameImage[] = [
  { name: 'My Custom Image', url: '/images/my-image.jpg' },
];
```

The game will automatically split any image into a 3x3 grid for the puzzle.

