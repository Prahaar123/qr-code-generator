import { useState, useEffect, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { generateQRCode, isValidUrl, QROptions } from '@/lib/qr-utils';
import { AlertCircle, Link } from 'lucide-react';
import QRCodeDisplay from './QRCodeDisplay';
import CustomizationPanel from './CustomizationPanel';

export default function QRGenerator() {
  const [url, setUrl] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [options, setOptions] = useState<QROptions>({
    text: '',
    size: 200,
    foregroundColor: '#000000',
    backgroundColor: '#ffffff',
    errorCorrectionLevel: 'M',
    margin: 4,
  });

  const handleOptionsChange = (newOptions: Partial<QROptions>) => {
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
      const dataUrl = await generateQRCode(qrOptions);
      setQrCodeUrl(dataUrl);
    } catch (err) {
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
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [generateQR]);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          QR Code Generator
        </h1>
        <p className="text-gray-600 text-lg">
          Create custom QR codes for free with advanced styling options
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Customization Panel */}
        <CustomizationPanel 
          options={options} 
          onOptionsChange={handleOptionsChange} 
        />

        {/* QR Code Display */}
        <QRCodeDisplay 
          qrCodeUrl={qrCodeUrl} 
          isGenerating={isGenerating} 
        />
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        <Card className="text-center p-4">
          <h3 className="font-semibold text-lg mb-2">Free Forever</h3>
          <p className="text-gray-600">Generate unlimited QR codes at no cost</p>
        </Card>
        <Card className="text-center p-4">
          <h3 className="font-semibold text-lg mb-2">Instant Generation</h3>
          <p className="text-gray-600">QR codes are generated in real-time as you type</p>
        </Card>
        <Card className="text-center p-4">
          <h3 className="font-semibold text-lg mb-2">Full Customization</h3>
          <p className="text-gray-600">Customize colors, size, and error correction</p>
        </Card>
      </div>
    </div>
  );
}