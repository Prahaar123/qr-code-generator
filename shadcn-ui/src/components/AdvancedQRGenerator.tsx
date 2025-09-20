import { useState, useEffect, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { generateAdvancedQRCode, isValidUrl, AdvancedQROptions } from '@/lib/qr-advanced-utils';
import { AlertCircle, Link, Sparkles } from 'lucide-react';
import QRCodeDisplay from './QRCodeDisplay';
import AdvancedCustomizationPanel from './AdvancedCustomizationPanel';

export default function AdvancedQRGenerator() {
  const [url, setUrl] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [options, setOptions] = useState<AdvancedQROptions>({
    text: '',
    size: 300,
    foregroundColor: '#000000',
    backgroundColor: '#ffffff',
    transparentBackground: false,
    errorCorrectionLevel: 'M',
    margin: 4,
    frameStyle: 'none',
    patternStyle: 'square',
    cornerDotStyle: 'square',
    cornerFrameStyle: 'square',
    // New color options
    patternColor: '#000000',
    cornerFrameColor: '#000000',
    cornerDotColor: '#000000',
    // Gradient options
    usePatternGradient: false,
    useCornerFrameGradient: false,
    useCornerDotGradient: false,
    patternGradientColors: ['#ff0000', '#00ff00', '#0000ff'],
    cornerFrameGradientColors: ['#ff6b6b', '#4ecdc4', '#45b7d1'],
    cornerDotGradientColors: ['#96ceb4', '#ffeaa7', '#dda0dd'],
  });

  const handleOptionsChange = (newOptions: Partial<AdvancedQROptions>) => {
    setOptions(prev => ({ ...prev, ...newOptions }));
  };

  const generateQR = useCallback(async () => {
    if (!url.trim()) {
      setQrCodeUrl(null);
      setError(null);
      return;
    }

    if (!isValidUrl(url)) {
      setError('Please enter a valid URL (e.g., https://example.com)');
      setQrCodeUrl(null);
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const qrOptions = { ...options, text: url };
      const dataUrl = await generateAdvancedQRCode(qrOptions);
      setQrCodeUrl(dataUrl);
    } catch (err) {
      console.error('QR Generation Error:', err);
      setError('Failed to generate QR code. Please try again.');
      setQrCodeUrl(null);
    } finally {
      setIsGenerating(false);
    }
  }, [url, options]);

  // Auto-generate QR code when URL or options change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      generateQR();
    }, 500); // Reduced timeout for faster response

    return () => clearTimeout(timeoutId);
  }, [generateQR]);

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Advanced QR Code Generator
        </h1>
        <p className="text-gray-600 text-lg flex items-center justify-center space-x-2">
          <Sparkles className="w-5 h-5" />
          <span>Create stunning custom QR codes with frames, patterns, and gradient colors</span>
        </p>
      </div>

      {/* URL Input */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Link className="w-5 h-5" />
            <span>Enter Your URL</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="url">Website URL</Label>
            <Input
              id="url"
              type="url"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="text-lg"
            />
          </div>
          
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Customization Panel - Takes 2 columns */}
        <div className="xl:col-span-2">
          <AdvancedCustomizationPanel 
            options={options} 
            onOptionsChange={handleOptionsChange} 
          />
        </div>

        {/* QR Code Display - Takes 1 column */}
        <div className="xl:col-span-1">
          <QRCodeDisplay 
            qrCodeUrl={qrCodeUrl} 
            isGenerating={isGenerating} 
          />
        </div>
      </div>

      {/* Enhanced Features */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
        <Card className="text-center p-4">
          <h3 className="font-semibold text-lg mb-2">12 Frame Styles</h3>
          <p className="text-gray-600 text-sm">Choose from elegant frames to enhance your QR codes</p>
        </Card>
        <Card className="text-center p-4">
          <h3 className="font-semibold text-lg mb-2">Individual Colors</h3>
          <p className="text-gray-600 text-sm">Customize colors for patterns, corners, and dots separately</p>
        </Card>
        <Card className="text-center p-4">
          <h3 className="font-semibold text-lg mb-2">Transparent Background</h3>
          <p className="text-gray-600 text-sm">Create QR codes with transparent backgrounds</p>
        </Card>
        <Card className="text-center p-4">
          <h3 className="font-semibold text-lg mb-2">Gradient Support</h3>
          <p className="text-gray-600 text-sm">Create stunning gradient effects with 3-color blends</p>
        </Card>
      </div>
    </div>
  );
}