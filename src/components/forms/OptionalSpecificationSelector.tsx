"use client";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Palette, Ruler, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface SpecField {
  id: string;
  type: 'color' | 'size' | 'text';
  name: string;
  value: string;
}

interface Props {
  onSpecsChange: (specs: { [key: string]: string[] }) => void;
  initialSpecs?: { [key: string]: string[] };
}

export const OptionalSpecificationSelector = ({ 
  onSpecsChange, 
  initialSpecs = {} 
}: Props) => {
  const [specFields, setSpecFields] = useState<SpecField[]>([]);
  const initializedRef = useRef(false);


  // Initialize fields from initialSpecs only once when component mounts
  useEffect(() => {
    console.log('useEffect triggered with initialSpecs:', initialSpecs);
    console.log('initializedRef.current:', initializedRef.current);
    
    // Only initialize if we haven't initialized before and have actual initial specs
    if (!initializedRef.current && Object.keys(initialSpecs).length > 0) {
      const fields: SpecField[] = [];
      Object.entries(initialSpecs).forEach(([name, values]) => {
        values.forEach((value, index) => {
          fields.push({
            id: `${name}-${index}-${Date.now()}-${Math.random()}`,
            type: name.toLowerCase() === 'color' ? 'color' : 
                  name.toLowerCase() === 'size' ? 'size' : 'text',
            name,
            value
          });
        });
      });
      console.log('Setting spec fields to:', fields);
      setSpecFields(fields);
      initializedRef.current = true;
    }
    // If we've already initialized or initialSpecs is empty, don't do anything
  }, [initialSpecs]);

  const addSpecField = (type: 'color' | 'size' | 'text') => {
    console.log('Adding spec field of type:', type);
    const newField: SpecField = {
      id: `${type}-${Date.now()}-${Math.random()}`,
      type,
      name: type === 'color' ? 'color' : 
            type === 'size' ? 'size' : '',
      value: ''
    };
    
    const updatedFields = [...specFields, newField];
    console.log('Updated fields after adding:', updatedFields);
    setSpecFields(updatedFields);
    updateSpecs(updatedFields);
  };

  const updateField = (id: string, field: 'name' | 'value', newValue: string) => {
    const updatedFields = specFields.map(spec => 
      spec.id === id ? { ...spec, [field]: newValue } : spec
    );
    setSpecFields(updatedFields);
    updateSpecs(updatedFields);
  };

  const removeField = (id: string) => {
    const updatedFields = specFields.filter(spec => spec.id !== id);
    setSpecFields(updatedFields);
    updateSpecs(updatedFields);
  };

  const updateSpecs = (fields: SpecField[]) => {
    // Group by name and collect values
    const groupedSpecs: { [key: string]: string[] } = {};
    
    fields
      .filter(field => field.name.trim() && field.value.trim())
      .forEach(field => {
        const name = field.name.trim().toLowerCase();
        if (!groupedSpecs[name]) {
          groupedSpecs[name] = [];
        }
        const value = field.value.trim();
        if (!groupedSpecs[name].includes(value)) {
          groupedSpecs[name].push(value);
        }
      });
    
    onSpecsChange(groupedSpecs);
  };

  const getFieldIcon = (type: string) => {
    switch (type) {
      case 'color': return <Palette className="w-4 h-4" />;
      case 'size': return <Ruler className="w-4 h-4" />;
      default: return <Tag className="w-4 h-4" />;
    }
  };

  const getFieldColor = (type: string) => {
    switch (type) {
      case 'color': return 'border-pink-200 bg-pink-50';
      case 'size': return 'border-blue-200 bg-blue-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  const getColorPreview = (value: string) => {
    const colorMap: { [key: string]: string } = {
      red: '#FF0000', blue: '#0000FF', black: '#000000', white: '#FFFFFF',
      green: '#008000', yellow: '#FFFF00', pink: '#FFC0CB', gray: '#808080',
      brown: '#8B4513', orange: '#FFA500', purple: '#800080', navy: '#000080'
    };
    return colorMap[value.toLowerCase()] || '#CCCCCC';
  };

  // Group fields by specification name for preview
  const groupedFields = specFields.reduce((acc, field) => {
    if (field.name.trim() && field.value.trim()) {
      const name = field.name.trim().toLowerCase();
      if (!acc[name]) acc[name] = [];
      if (!acc[name].includes(field.value.trim())) {
        acc[name].push(field.value.trim());
      }
    }
    return acc;
  }, {} as { [key: string]: string[] });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Product Specifications (Optional)</CardTitle>
        <p className="text-sm text-gray-600">Add as many colors, sizes, or other specifications as you need</p>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Add Buttons */}
        <div className="flex flex-wrap gap-2">
          <button 
            type="button" 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              addSpecField('color');
            }}
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3 text-pink-600 border-pink-200 hover:bg-pink-50"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a3 3 0 016 0v4a4 4 0 01-4 4 1 1 0 001 1h4a3 3 0 013 3v3a1 1 0 01-1 1H7z" />
            </svg>
            Add Color
          </button>
          <button 
            type="button" 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              addSpecField('size');
            }}
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3 text-blue-600 border-blue-200 hover:bg-blue-50"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10l-2-6H9l-2 6zM5 7l1 6h12l1-6H5zM12 3v4" />
            </svg>
            Add Size
          </button>
          <button 
            type="button" 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              addSpecField('text');
            }}
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3 text-gray-600 border-gray-200 hover:bg-gray-50"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            Add Other
          </button>
        </div>

        {/* Specification Fields */}
        {specFields.length === 0 ? (
          <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
            <Tag className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="mb-4">No specifications added yet</p>
            <p className="text-sm">Click the buttons above to add colors, sizes, or other specifications</p>
          </div>
        ) : (
          <div className="space-y-3">
            {specFields.map((field) => (
              <div key={field.id} className={`flex gap-3 items-center p-3 rounded-lg border ${getFieldColor(field.type)}`}>
                {getFieldIcon(field.type)}
                
                {field.type === 'color' || field.type === 'size' ? (
                  <span className="font-medium capitalize text-sm min-w-[60px]">
                    {field.type}:
                  </span>
                ) : (
                  <Input
                    placeholder="Spec name"
                    value={field.name}
                    onChange={(e) => updateField(field.id, 'name', e.target.value)}
                    className="w-24 h-8 text-sm"
                  />
                )}
                
                <div className="flex items-center gap-2 flex-1">
                  <Input
                    placeholder={
                      field.type === 'color' ? 'e.g., Red, Blue, Black' :
                      field.type === 'size' ? 'e.g., S, M, L, XL' :
                      'Specification value'
                    }
                    value={field.value}
                    onChange={(e) => updateField(field.id, 'value', e.target.value)}
                    className="flex-1 h-8 text-sm"
                  />
                  
                  {field.type === 'color' && field.value && (
                    <div 
                      className="w-6 h-6 rounded border-2 border-gray-300"
                      style={{ backgroundColor: getColorPreview(field.value) }}
                      title={field.value}
                    />
                  )}
                </div>
                
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeField(field.id)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Preview of Grouped Specifications */}
        {Object.keys(groupedFields).length > 0 && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-3">Specification Preview:</h4>
            <div className="space-y-2">
              {Object.entries(groupedFields).map(([name, values]) => (
                <div key={name} className="flex items-center gap-2">
                  <span className="font-medium capitalize min-w-[80px]">{name}:</span>
                  <div className="flex gap-1 flex-wrap">
                    {values.map((value) => (
                      <Badge key={value} variant="secondary" className="text-xs">
                        {name === 'color' && (
                          <div
                            className="w-2 h-2 rounded-full mr-1"
                            style={{ backgroundColor: getColorPreview(value) }}
                          />
                        )}
                        {value}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Helper Text */}
        <div className="text-xs text-gray-500 bg-blue-50 p-3 rounded">
          <p><strong>💡 How it works:</strong></p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li><strong>Add Color:</strong> Click multiple times to add Red, Blue, Black, etc.</li>
            <li><strong>Add Size:</strong> Click multiple times to add S, M, L, XL, etc.</li>
            <li><strong>Add Other:</strong> Add any custom specification like Material, Brand, etc.</li>
            <li><strong>Variants:</strong> If you select &quot;Variable&quot; product type, all combinations will be generated</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};