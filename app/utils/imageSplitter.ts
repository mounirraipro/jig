export async function splitImage(imageUrl: string): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }

      // Set canvas dimensions to match puzzle aspect ratio (3x3 grid)
      const pieceWidth = 200;
      const pieceHeight = 280;
      canvas.width = pieceWidth;
      canvas.height = pieceHeight;

      const pieces: string[] = [];
      const cols = 3;
      const rows = 3;

      // Calculate source dimensions
      const sourceWidth = img.width / cols;
      const sourceHeight = img.height / rows;

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          
          // Draw the piece
          ctx.drawImage(
            img,
            col * sourceWidth,
            row * sourceHeight,
            sourceWidth,
            sourceHeight,
            0,
            0,
            pieceWidth,
            pieceHeight
          );

          // Convert to data URL
          pieces.push(canvas.toDataURL('image/jpeg', 0.9));
        }
      }

      resolve(pieces);
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };

    img.src = imageUrl;
  });
}

export function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

