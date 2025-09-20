import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  AdvancedQROptions, 
  frameStyles, 
  patternStyles, 
  cornerDotStyles, 
  cornerFrameStyles 
} from '@/lib/qr-advanced-utils';
import { Palette, Frame, Grid, Circle } from 'lucide-react';
import ColorGradientPicker from './ColorGradientPicker';

interface AdvancedCustomizationPanelProps {
  options: AdvancedQROptions;
  onOptionsChange: (options: Partial<AdvancedQROptions>) => void;
}

export default function AdvancedCustomizationPanel({ options, onOptionsChange }: AdvancedCustomizationPanelProps) {
  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="text-lg flex items-center space-x-2">
          <Palette className="w-5 h-5" />
          <span>Advanced Customization</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Basic</TabsTrigger>
            <TabsTrigger value="frames">Frames</TabsTrigger>
            <TabsTrigger value="patterns">Patterns</TabsTrigger>
            <TabsTrigger value="corners">Corners</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-6 mt-4">
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

            {/* Background Options */}
            <div className="space-y-4">
              <Label>Background</Label>
              
              {/* Transparent Background Toggle */}
              <div className="flex items-center space-x-2">
                <Switch
                  checked={options.transparentBackground}
                  onCheckedChange={(checked) => onOptionsChange({ transparentBackground: checked })}
                  id="transparent-bg"
                />
                <Label htmlFor="transparent-bg" className="text-sm">
                  Transparent Background
                </Label>
              </div>

              {/* Background Color (only if not transparent) */}
              {!options.transparentBackground && (
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={options.backgroundColor}
                    onChange={(e) => onOptionsChange({ backgroundColor: e.target.value })}
                    className="w-12 h-8 rounded border cursor-pointer"
                  />
                  <span className="text-sm text-gray-600">{options.backgroundColor}</span>
                </div>
              )}
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
          </TabsContent>

          <TabsContent value="frames" className="space-y-4 mt-4">
            <div className="flex items-center space-x-2 mb-3">
              <Frame className="w-4 h-4" />
              <Label>Frame Styles</Label>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {frameStyles.map((frame) => (
                <button
                  key={frame.id}
                  onClick={() => onOptionsChange({ frameStyle: frame.id })}
                  className={`p-3 rounded-lg border text-left transition-all hover:bg-gray-50 ${
                    options.frameStyle === frame.id 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{frame.preview}</span>
                    <div>
                      <div className="font-medium text-sm">{frame.name}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="patterns" className="space-y-4 mt-4">
            <div className="flex items-center space-x-2 mb-3">
              <Grid className="w-4 h-4" />
              <Label>Pattern Styles</Label>
            </div>
            <div className="grid grid-cols-1 gap-2 mb-6">
              {patternStyles.map((pattern) => (
                <button
                  key={pattern.id}
                  onClick={() => onOptionsChange({ patternStyle: pattern.id })}
                  className={`p-3 rounded-lg border text-left transition-all hover:bg-gray-50 ${
                    options.patternStyle === pattern.id 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{pattern.preview}</span>
                    <div className="font-medium">{pattern.name}</div>
                    {options.patternStyle === pattern.id && (
                      <Badge variant="secondary" className="ml-auto">Selected</Badge>
                    )}
                  </div>
                </button>
              ))}
            </div>

            {/* Pattern Color Options */}
            <div className="border-t pt-4">
              <ColorGradientPicker
                label="Pattern Color"
                color={options.patternColor}
                onColorChange={(color) => onOptionsChange({ patternColor: color })}
                useGradient={options.usePatternGradient}
                onGradientToggle={(useGradient) => onOptionsChange({ usePatternGradient: useGradient })}
                gradientColors={options.patternGradientColors}
                onGradientColorsChange={(colors) => onOptionsChange({ patternGradientColors: colors })}
              />
            </div>
          </TabsContent>

          <TabsContent value="corners" className="space-y-6 mt-4">
            <div className="flex items-center space-x-2 mb-3">
              <Circle className="w-4 h-4" />
              <Label>Corner Customization</Label>
            </div>
            
            {/* Corner Frame Styles */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Corner Frame Style</Label>
              <div className="grid grid-cols-1 gap-2 mb-4">
                {cornerFrameStyles.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => onOptionsChange({ cornerFrameStyle: style.id })}
                    className={`p-2 rounded border text-left transition-all hover:bg-gray-50 ${
                      options.cornerFrameStyle === style.id 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-sm">{style.preview}</span>
                      <span className="text-sm font-medium">{style.name}</span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Corner Frame Color Options */}
              <div className="border-t pt-4">
                <ColorGradientPicker
                  label="Corner Frame Color"
                  color={options.cornerFrameColor}
                  onColorChange={(color) => onOptionsChange({ cornerFrameColor: color })}
                  useGradient={options.useCornerFrameGradient}
                  onGradientToggle={(useGradient) => onOptionsChange({ useCornerFrameGradient: useGradient })}
                  gradientColors={options.cornerFrameGradientColors}
                  onGradientColorsChange={(colors) => onOptionsChange({ cornerFrameGradientColors: colors })}
                />
              </div>
            </div>

            {/* Corner Dot Styles */}
            <div className="space-y-3 border-t pt-6">
              <Label className="text-sm font-medium">Corner Dot Style</Label>
              <div className="grid grid-cols-1 gap-2 mb-4">
                {cornerDotStyles.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => onOptionsChange({ cornerDotStyle: style.id })}
                    className={`p-2 rounded border text-left transition-all hover:bg-gray-50 ${
                      options.cornerDotStyle === style.id 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-sm">{style.preview}</span>
                      <span className="text-sm font-medium">{style.name}</span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Corner Dot Color Options */}
              <div className="border-t pt-4">
                <ColorGradientPicker
                  label="Corner Dot Color"
                  color={options.cornerDotColor}
                  onColorChange={(color) => onOptionsChange({ cornerDotColor: color })}
                  useGradient={options.useCornerDotGradient}
                  onGradientToggle={(useGradient) => onOptionsChange({ useCornerDotGradient: useGradient })}
                  gradientColors={options.cornerDotGradientColors}
                  onGradientColorsChange={(colors) => onOptionsChange({ cornerDotGradientColors: colors })}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}