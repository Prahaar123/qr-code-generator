import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Download } from 'lucide-react';
import { downloadQRCode } from '@/lib/qr-utils';

interface QRCodeDisplayProps {
  qrCodeUrl: string | null;
  isGenerating: boolean;
}

export default function QRCodeDisplay({ qrCodeUrl, isGenerating }: QRCodeDisplayProps) {
  const handleDownload = () => {
    if (qrCodeUrl) {
      downloadQRCode(qrCodeUrl, `qrcode-${Date.now()}.png`);
    }
  };

  return (
    <Card className="p-6 flex flex-col items-center space-y-4">
      <div className="w-64 h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
        {isGenerating ? (
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        ) : qrCodeUrl ? (
          <img 
            src={qrCodeUrl} 
            alt="Generated QR Code" 
            className="max-w-full max-h-full object-contain"
          />
        ) : (
          <p className="text-gray-500 text-center">
            Enter a URL above to generate your QR code
          </p>
        )}
      </div>
      
      {qrCodeUrl && (
        <Button onClick={handleDownload} className="w-full">
          <Download className="w-4 h-4 mr-2" />
          Download QR Code
        </Button>
      )}
    </Card>
  );
}