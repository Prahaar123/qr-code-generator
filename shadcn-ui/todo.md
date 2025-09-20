# QR Code Generator Website - MVP Todo

## Core Features to Implement:
1. **Main QR Generator Component** (`src/components/QRGenerator.tsx`)
   - URL input field with validation
   - Real-time QR code generation
   - Error handling for invalid URLs

2. **Customization Panel** (`src/components/CustomizationPanel.tsx`)
   - Color picker for foreground/background colors
   - Size adjustment slider
   - Error correction level selection
   - Border/margin options

3. **QR Code Display** (`src/components/QRCodeDisplay.tsx`)
   - Canvas-based QR code rendering
   - Download functionality (PNG/SVG)
   - Preview with applied customizations

4. **Main Page** (`src/pages/Index.tsx`)
   - Clean, modern layout
   - Integration of all components
   - Responsive design

5. **Utilities** (`src/lib/qr-utils.ts`)
   - QR code generation logic
   - Download helpers
   - URL validation

## Dependencies to Add:
- qrcode: For QR code generation
- html2canvas: For downloading QR codes as images

## File Structure:
- src/pages/Index.tsx (main page)
- src/components/QRGenerator.tsx (main component)
- src/components/CustomizationPanel.tsx (customization options)
- src/components/QRCodeDisplay.tsx (display and download)
- src/lib/qr-utils.ts (utilities)

## Implementation Priority:
1. Basic QR generation with URL input
2. Customization options (colors, size)
3. Download functionality
4. Polish UI/UX