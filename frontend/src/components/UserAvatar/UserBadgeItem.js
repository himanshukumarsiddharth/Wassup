// import { Badge } from "@chakra-ui/react";

// const UserBadgeItem = ({ user, handleFunction, admin }) => {
//   return (
//     <Badge px={2}
//     py={1}
//     borderRadius="lg"
//     m={1}
//     mb={2}
//     variant="solid"
//     fontSize={12}
//     colorPalette="purple"
//     cursor="pointer"
//     onClick={handleFunction}>
//         {user.name}
//         {admin === user._id && <span> (Admin)</span>}
//         <i class="fa-solid fa-xmark" ></i>
//       </Badge>
//   );
// };

// export default UserBadgeItem;


import { Badge } from "@chakra-ui/react";
import { useState, useEffect } from "react";

// Lightweight color extraction utility
const extractImageColor = (imageUrl) => {
  return new Promise((resolve) => {
    // Default gray for anonymous/placeholder images
    if (!imageUrl || 
        imageUrl.includes('anonymous-avatar-icon') || 
        imageUrl.includes('placeholder') || 
        imageUrl.includes('default')) {
      resolve('silver');
      return;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Small canvas for performance
        canvas.width = 50;
        canvas.height = 50;
        
        ctx.drawImage(img, 0, 0, 50, 50);
        const imageData = ctx.getImageData(0, 0, 50, 50);
        const data = imageData.data;
        
        let r = 0, g = 0, b = 0, count = 0;
        
        // Sample every 4th pixel for performance
        for (let i = 0; i < data.length; i += 16) {
          const alpha = data[i + 3];
          if (alpha > 128) { // Skip transparent pixels
            r += data[i];
            g += data[i + 1];
            b += data[i + 2];
            count++;
          }
        }
        
        if (count > 0) {
          r = Math.round(r / count);
          g = Math.round(g / count);
          b = Math.round(b / count);
          
          // Convert to Chakra UI color palette
          const chakraColor = rgbToChakraColor(r, g, b);
          resolve(chakraColor);
        } else {
          resolve('gray');
        }
      } catch (error) {
        resolve('gray'); // Fallback on CORS or other errors
      }
    };
    
    img.onerror = () => resolve('gray');
    img.src = imageUrl;
  });
};

// Convert RGB to closest Chakra UI color palette
const rgbToChakraColor = (r, g, b) => {
  const hsl = rgbToHsl(r, g, b);
  const hue = hsl[0];
  const saturation = hsl[1];
  const lightness = hsl[2];
  
  // If low saturation, return gray
  if (saturation < 0.3) return 'gray';
  
  // If very dark or very light, return gray
  if (lightness < 0.2 || lightness > 0.8) return 'gray';
  
  // Map hue to Chakra colors
  if (hue < 15 || hue >= 345) return 'red';
  if (hue < 45) return 'orange';
  if (hue < 75) return 'yellow';
  if (hue < 150) return 'green';
  if (hue < 200) return 'teal';
  if (hue < 260) return 'blue';
  if (hue < 290) return 'purple';
  if (hue < 320) return 'pink';
  return 'red';
};

// RGB to HSL conversion
const rgbToHsl = (r, g, b) => {
  r /= 255;
  g /= 255;
  b /= 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;
  
  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  
  return [Math.round(h * 360), s, l];
};

const UserBadgeItem = ({ user, handleFunction, admin }) => {
  const [badgeColor, setBadgeColor] = useState('purple');
  
  useEffect(() => {
    // Extract color from user avatar
    if (user?.pic) {
      extractImageColor(user.pic).then(color => {
        setBadgeColor(color);
      });
    }
  }, [user?.pic]);

  return (
    <Badge 
      px={2}
      py={1}
      borderRadius="lg"
      m={1}
      mb={2}
      variant="solid"
      fontSize={12}
      colorPalette={badgeColor}
      cursor="pointer"
      onClick={handleFunction}
    >
      {user.name}
      {admin?._id === user._id && <span style = {{color: "#25D366", fontSize:"15px"}}> * </span>}
      <i className="fa-solid fa-xmark"></i>
    </Badge>
  );
};

export default UserBadgeItem;