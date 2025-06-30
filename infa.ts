      const canvas = document.createElement('canvas');
      const originalWidth = img.width;

      // Calculate the new height to maintain the 5:2 aspect ratio
      const newHeight = originalWidth * (2 / 5);

      canvas.width = originalWidth;  // Keep original width
      canvas.height = newHeight;        // Adjust height

      const ctx = canvas.getContext('2d');

      // Draw the image, stretching it to fill the canvas
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);