const resizeImageTo5To2 = async (imgUrl) => {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      const canvas = document.createElement('canvas');

      // Calculate dimensions for 5:2 aspect ratio
      let newWidth = img.width;
      let newHeight = img.width * (2 / 5); // Maintain 5:2 ratio

      if (newHeight > img.height) {
        newHeight = img.height;
        newWidth = img.height * (5 / 2);
      }

      canvas.width = newWidth;
      canvas.height = newHeight;

      const ctx = canvas.getContext('2d');

      // Draw the image, centering it within the canvas
      const offsetX = (newWidth - img.width) / 2;
      const offsetY = (newHeight - img.height) / 2;

      ctx.drawImage(img, offsetX, offsetY, img.width, img.height);

      // Convert canvas to data URL (JPEG, adjust as needed)
      const newImgUrl = canvas.toDataURL('image/jpeg');
      resolve(newImgUrl);
    };

    img.onerror = (error) => {
      reject(error);
    };

    img.src = imgUrl;
  });
};

export default resizeImageTo5To2;