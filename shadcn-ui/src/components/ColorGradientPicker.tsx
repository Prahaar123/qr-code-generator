import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

interface ColorGradientPickerProps {
  label: string;
  color: string;
  onColorChange: (color: string) => void;
  useGradient: boolean;
  onGradientToggle: (useGradient: boolean) => void;
  gradientColors: [string, string, string];
  onGradientColorsChange: (colors: [string, string, string]) => void;
}

export default function ColorGradientPicker({
  label,
  color,
  onColorChange,
  useGradient,
  onGradientToggle,
  gradientColors,
  onGradientColorsChange
}: ColorGradientPickerProps) {
  const handleGradientColorChange = (index: number, newColor: string) => {
    const newColors: [string, string, string] = [...gradientColors];
    newColors[index] = newColor;
    onGradientColorsChange(newColors);
  };

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">{label}</Label>
      
      {/* Solid Color Option */}
      {!useGradient && (
        <div className="flex items-center space-x-2">
          <input
            type="color"
            value={color}
            onChange={(e) => onColorChange(e.target.value)}
            className="w-12 h-8 rounded border cursor-pointer"
          />
          <span className="text-sm text-gray-600">{color}</span>
        </div>
      )}
      
      {/* Gradient Toggle */}
      <div className="flex items-center space-x-2">
        <Switch
          checked={useGradient}
          onCheckedChange={onGradientToggle}
          id={`gradient-${label.toLowerCase().replace(/\s+/g, '-')}`}
        />
        <Label 
          htmlFor={`gradient-${label.toLowerCase().replace(/\s+/g, '-')}`}
          className="text-sm"
        >
          Use Gradient
        </Label>
      </div>
      
      {/* Gradient Color Pickers */}
      {useGradient && (
        <div className="space-y-2">
          <Label className="text-xs text-gray-500">Gradient Colors</Label>
          <div className="grid grid-cols-3 gap-2">
            {gradientColors.map((gradientColor, index) => (
              <div key={index} className="flex flex-col items-center space-y-1">
                <input
                  type="color"
                  value={gradientColor}
                  onChange={(e) => handleGradientColorChange(index, e.target.value)}
                  className="w-10 h-6 rounded border cursor-pointer"
                />
                <span className="text-xs text-gray-500">Color {index + 1}</span>
              </div>
            ))}
          </div>
          <div 
            className="h-4 rounded"
            style={{
              background: `linear-gradient(90deg, ${gradientColors[0]} 0%, ${gradientColors[1]} 50%, ${gradientColors[2]} 100%)`
            }}
          />
        </div>
      )}
    </div>
  );
}