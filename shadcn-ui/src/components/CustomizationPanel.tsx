import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { QROptions } from '@/lib/qr-utils';

interface CustomizationPanelProps {
  options: QROptions;
  onOptionsChange: (options: Partial<QROptions>) => void;
}

export default function CustomizationPanel({ options, onOptionsChange }: CustomizationPanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Customize Your QR Code</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Size */}
        <div className="space-y-2">
          <Label>Size: {options.size}px</Label>
          <Slider
            value={[options.size]}
            onValueChange={(value) => onOptionsChange({ size: value[0] })}
            max={400}
            min={100}
            step={10}
            className="w-full"
          />
        </div>

        {/* Foreground Color */}
        <div className="space-y-2">
          <Label>Foreground Color</Label>
          <div className="flex items-center space-x-2">
            <input
              type="color"
              value={options.foregroundColor}
              onChange={(e) => onOptionsChange({ foregroundColor: e.target.value })}
              className="w-12 h-8 rounded border cursor-pointer"
            />
            <span className="text-sm text-gray-600">{options.foregroundColor}</span>
          </div>
        </div>

        {/* Background Color */}
        <div className="space-y-2">
          <Label>Background Color</Label>
          <div className="flex items-center space-x-2">
            <input
              type="color"
              value={options.backgroundColor}
              onChange={(e) => onOptionsChange({ backgroundColor: e.target.value })}
              className="w-12 h-8 rounded border cursor-pointer"
            />
            <span className="text-sm text-gray-600">{options.backgroundColor}</span>
          </div>
        </div>

        {/* Error Correction Level */}
        <div className="space-y-2">
          <Label>Error Correction Level</Label>
          <Select
            value={options.errorCorrectionLevel}
            onValueChange={(value: 'L' | 'M' | 'Q' | 'H') => onOptionsChange({ errorCorrectionLevel: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="L">Low (7%)</SelectItem>
              <SelectItem value="M">Medium (15%)</SelectItem>
              <SelectItem value="Q">Quartile (25%)</SelectItem>
              <SelectItem value="H">High (30%)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Margin */}
        <div className="space-y-2">
          <Label>Margin: {options.margin}</Label>
          <Slider
            value={[options.margin]}
            onValueChange={(value) => onOptionsChange({ margin: value[0] })}
            max={10}
            min={0}
            step={1}
            className="w-full"
          />
        </div>
      </CardContent>
    </Card>
  );
}