import QRCodeStyling from 'qr-code-styling';

export interface AdvancedQROptions {
  text: string;
  size: number;
  foregroundColor: string;
  backgroundColor: string;
  transparentBackground: boolean;
  errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H';
  margin: number;
  frameStyle: string;
  patternStyle: string;
  cornerDotStyle: string;
  cornerFrameStyle: string;
  // New color options
  patternColor: string;
  cornerFrameColor: string;
  cornerDotColor: string;
  // Gradient options
  usePatternGradient: boolean;
  useCornerFrameGradient: boolean;
  useCornerDotGradient: boolean;
  patternGradientColors: [string, string, string];
  cornerFrameGradientColors: [string, string, string];
  cornerDotGradientColors: [string, string, string];
}

export const frameStyles = [
  { id: 'none', name: 'No Frame', preview: '⬜' },
  { id: 'square', name: 'Square Frame', preview: '🔲' },
  { id: 'rounded', name: 'Rounded Frame', preview: '🔘' },
  { id: 'circle', name: 'Circle Frame', preview: '⭕' },
  { id: 'diamond', name: 'Diamond Frame', preview: '💎' },
  { id: 'hexagon', name: 'Hexagon Frame', preview: '⬡' },
  { id: 'star', name: 'Star Frame', preview: '⭐' },
  { id: 'heart', name: 'Heart Frame', preview: '💖' },
  { id: 'leaf', name: 'Leaf Frame', preview: '🍃' },
  { id: 'flower', name: 'Flower Frame', preview: '🌸' },
  { id: 'tech', name: 'Tech Frame', preview: '⚡' },
  { id: 'vintage', name: 'Vintage Frame', preview: '🎭' }
];

export const patternStyles = [
  { id: 'square', name: 'Square', preview: '■' },
  { id: 'rounded', name: 'Rounded', preview: '●' },
  { id: 'dots', name: 'Dots', preview: '⚫' },
  { id: 'classy', name: 'Classy', preview: '◆' },
  { id: 'classy-rounded', name: 'Classy Rounded', preview: '◉' },
  { id: 'extra-rounded', name: 'Extra Rounded', preview: '⬤' }
];

export const cornerDotStyles = [
  { id: 'square', name: 'Square', preview: '■' },
  { id: 'dot', name: 'Dot', preview: '●' },
  { id: 'classy', name: 'Classy', preview: '◆' },
  { id: 'classy-rounded', name: 'Classy Rounded', preview: '◉' },
  { id: 'extra-rounded', name: 'Extra Rounded', preview: '⬤' }
];

export const cornerFrameStyles = [
  { id: 'square', name: 'Square', preview: '⬜' },
  { id: 'dot', name: 'Dot', preview: '⚪' },
  { id: 'classy', name: 'Classy', preview: '◇' },
  { id: 'classy-rounded', name: 'Classy Rounded', preview: '◎' },
  { id: 'extra-rounded', name: 'Extra Rounded', preview: '⭕' }
];

type DotsType = 'rounded' | 'dots' | 'classy' | 'classy-rounded' | 'square' | 'extra-rounded';
type CornerSquareType = 'dot' | 'square' | 'extra-rounded' | 'classy' | 'classy-rounded';
type CornerDotType = 'dot' | 'square' | 'extra-rounded' | 'classy' | 'classy-rounded';

interface GradientOptions {
  type: string;
  rotation: number;
  colorStops: Array<{
    offset: number;
    color: string;
  }>;
}

const createGradient = (colors: [string, string, string]): GradientOptions => {
  return {
    type: 'linear',
    rotation: 0,
    colorStops: [
      { offset: 0, color: colors[0] },
      { offset: 0.5, color: colors[1] },
      { offset: 1, color: colors[2] }
    ]
  };
};

export const generateAdvancedQRCode = async (options: AdvancedQROptions): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      // Determine colors for each component
      const patternColor = options.usePatternGradient 
        ? createGradient(options.patternGradientColors)
        : options.patternColor;
      
      const cornerFrameColor = options.useCornerFrameGradient
        ? createGradient(options.cornerFrameGradientColors)
        : options.cornerFrameColor;
      
      const cornerDotColor = options.useCornerDotGradient
        ? createGradient(options.cornerDotGradientColors)
        : options.cornerDotColor;

      // Handle transparent background
      const backgroundColor = options.transparentBackground ? 'transparent' : options.backgroundColor;

      const qrCode = new QRCodeStyling({
        width: options.size,
        height: options.size,
        type: "canvas",
        data: options.text,
        margin: options.margin,
        qrOptions: {
          typeNumber: 0,
          mode: "Byte",
          errorCorrectionLevel: options.errorCorrectionLevel
        },
        imageOptions: {
          hideBackgroundDots: true,
          imageSize: 0.4,
          margin: 0,
          crossOrigin: "anonymous",
        },
        dotsOptions: {
          color: patternColor,
          type: options.patternStyle as DotsType
        },
        backgroundOptions: {
          color: backgroundColor,
        },
        cornersSquareOptions: {
          color: cornerFrameColor,
          type: options.cornerFrameStyle as CornerSquareType,
        },
        cornersDotOptions: {
          color: cornerDotColor,
          type: options.cornerDotStyle as CornerDotType,
        }
      });

      const canvas = document.createElement('canvas');
      qrCode.append(canvas);
      
      qrCode.getRawData("png").then((blob) => {
        if (blob) {
          const reader = new FileReader();
          reader.onload = () => {
            const result = reader.result as string;
            if (options.frameStyle !== 'none') {
              // Apply frame styling
              applyFrameToQRCode(result, options.frameStyle, options.size, options.transparentBackground).then(resolve).catch(reject);
            } else {
              resolve(result);
            }
          };
          reader.onerror = () => reject(new Error('Failed to read QR code'));
          reader.readAsDataURL(blob);
        } else {
          reject(new Error('Failed to generate QR code'));
        }
      }).catch(reject);

    } catch (error) {
      reject(error);
    }
  });
};

const applyFrameToQRCode = async (qrDataUrl: string, frameStyle: string, size: number, transparentBackground: boolean): Promise<string> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    const frameSize = size + 60; // Add padding for frame
    
    canvas.width = frameSize;
    canvas.height = frameSize;
    
    const img = new Image();
    img.onload = () => {
      // Clear canvas with background
      if (!transparentBackground) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, frameSize, frameSize);
      }
      
      // Draw frame based on style
      drawFrame(ctx, frameStyle, frameSize);
      
      // Draw QR code in center
      const qrX = (frameSize - size) / 2;
      const qrY = (frameSize - size) / 2;
      ctx.drawImage(img, qrX, qrY, size, size);
      
      resolve(canvas.toDataURL('image/png'));
    };
    img.src = qrDataUrl;
  });
};

const drawFrame = (ctx: CanvasRenderingContext2D, frameStyle: string, size: number) => {
  const centerX = size / 2;
  const centerY = size / 2;
  const radius = size / 2 - 10;
  
  ctx.strokeStyle = '#333333';
  ctx.lineWidth = 4;
  ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
  
  switch (frameStyle) {
    case 'square':
      ctx.strokeRect(5, 5, size - 10, size - 10);
      break;
    case 'rounded':
      drawRoundedRect(ctx, 5, 5, size - 10, size - 10, 20);
      ctx.stroke();
      break;
    case 'circle':
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      ctx.stroke();
      break;
    case 'diamond':
      ctx.beginPath();
      ctx.moveTo(centerX, 10);
      ctx.lineTo(size - 10, centerY);
      ctx.lineTo(centerX, size - 10);
      ctx.lineTo(10, centerY);
      ctx.closePath();
      ctx.stroke();
      break;
    case 'hexagon':
      drawPolygon(ctx, centerX, centerY, 6, radius);
      break;
    case 'star':
      drawStar(ctx, centerX, centerY, 5, radius, radius * 0.5);
      break;
    case 'heart':
      drawHeart(ctx, centerX, centerY, radius);
      break;
    default:
      // Default to square for other styles
      ctx.strokeRect(5, 5, size - 10, size - 10);
      break;
  }
};

const drawRoundedRect = (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) => {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
};

const drawPolygon = (ctx: CanvasRenderingContext2D, x: number, y: number, sides: number, radius: number) => {
  ctx.beginPath();
  for (let i = 0; i < sides; i++) {
    const angle = (i * 2 * Math.PI) / sides - Math.PI / 2;
    const px = x + radius * Math.cos(angle);
    const py = y + radius * Math.sin(angle);
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.stroke();
};

const drawStar = (ctx: CanvasRenderingContext2D, x: number, y: number, spikes: number, outerRadius: number, innerRadius: number) => {
  ctx.beginPath();
  for (let i = 0; i < spikes * 2; i++) {
    const radius = i % 2 === 0 ? outerRadius : innerRadius;
    const angle = (i * Math.PI) / spikes - Math.PI / 2;
    const px = x + radius * Math.cos(angle);
    const py = y + radius * Math.sin(angle);
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.stroke();
};

const drawHeart = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
  ctx.beginPath();
  const topCurveHeight = size * 0.3;
  ctx.moveTo(x, y + topCurveHeight);
  ctx.bezierCurveTo(x, y, x - size / 2, y, x - size / 2, y + topCurveHeight);
  ctx.bezierCurveTo(x - size / 2, y + (size + topCurveHeight) / 2, x, y + (size + topCurveHeight) / 2, x, y + size);
  ctx.bezierCurveTo(x, y + (size + topCurveHeight) / 2, x + size / 2, y + (size + topCurveHeight) / 2, x + size / 2, y + topCurveHeight);
  ctx.bezierCurveTo(x + size / 2, y, x, y, x, y + topCurveHeight);
  ctx.closePath();
  ctx.stroke();
};

export const isValidUrl = (string: string): boolean => {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
};

export const downloadQRCode = (dataUrl: string, filename: string = 'qrcode.png') => {
  const link = document.createElement('a');
  link.download = filename;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};