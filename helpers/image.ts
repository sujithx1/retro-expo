
  // Helper to format/retrieve product image URL
export  const getProductImage = (imageArray?: string[]) => {
    if (imageArray && imageArray.length > 0) {
      const img = imageArray[0];
      if (img.startsWith('http://') || img.startsWith('https://')) {
        return { uri: img };
      }

      const baseUrl = process.env.EXPO_PUBLIC_API_URL || 'http://10.5.51.221:3001';
      const cleanedBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
      
      // Ensure the path routes through the '/uploads' directory if it's a relative path
      let imagePath = img;
      if (!imagePath.startsWith('/uploads/') && !imagePath.startsWith('uploads/')) {
        imagePath = imagePath.startsWith('/') ? `/uploads${imagePath}` : `/uploads/${imagePath}`;
      } else {
        imagePath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
      }

      return { uri: `${cleanedBaseUrl}${imagePath}` };
    }
    return { uri: '' };
  };

