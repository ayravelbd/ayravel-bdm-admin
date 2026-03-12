"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductVariant } from "@/types/Product";
import { Input } from "@/components/ui/input";

interface Props {
  specifications: { [key: string]: string[] };
  baseProduct: any;
  onVariantsChange: (variants: ProductVariant[]) => void;
  initialVariants?: ProductVariant[];
}

export const VariantManager = ({ specifications, baseProduct, onVariantsChange, initialVariants = [] }: Props) => {
  const [variants, setVariants] = useState<ProductVariant[]>([]);

  const generateVariants = () => {
    const specKeys = Object.keys(specifications).filter(key => specifications[key].length > 0);
    if (specKeys.length === 0) return [];

    const combinations: ProductVariant[] = [];
    
    // Generate all combinations using recursive approach
    function generateCombos(index: number, currentCombo: { [key: string]: string }) {
      if (index === specKeys.length) {
        const specValues = Object.values(currentCombo);
        combinations.push({
          sku: `${baseProduct.productInfo?.sku || baseProduct.sku || 'SKU'}-${specValues.join('-')}`,
          price: baseProduct.productInfo?.price || baseProduct.price || 0,
          salePrice: baseProduct.productInfo?.salePrice || baseProduct.salePrice,
          quantity: 0,
          specifications: { ...currentCombo },
          images: [],
          isActive: true
        });
        return;
      }
      
      const currentKey = specKeys[index];
      const currentValues = specifications[currentKey] || [];
      
      for (const value of currentValues) {
        generateCombos(index + 1, { ...currentCombo, [currentKey]: value });
      }
    }
    
    generateCombos(0, {});
    return combinations;
  };

  // Initialize variants on component mount
  useEffect(() => {
    if (initialVariants.length > 0) {
      setVariants(initialVariants);
      onVariantsChange(initialVariants);
    }
  }, []);

  useEffect(() => {
    // Only regenerate variants if we don't have initial variants and specifications change
    if (initialVariants.length === 0 && Object.keys(specifications).length > 0) {
      const newVariants = generateVariants();
      setVariants(newVariants);
      onVariantsChange(newVariants);
    }
  }, [specifications]);

  const updateVariant = (index: number, field: string, value: any) => {
    const updatedVariants = [...variants];
    updatedVariants[index] = { ...updatedVariants[index], [field]: value };
    setVariants(updatedVariants);
    onVariantsChange(updatedVariants);
  };

  const getSpecificationDisplay = (specs: { [key: string]: string }) => {
    return Object.entries(specs).map(([key, value]) => 
      `${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`
    ).join(' | ');
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Product Variants ({variants.length})</h3>
        <Button type="button" onClick={() => {
          const newVariants = generateVariants();
          setVariants(newVariants);
          onVariantsChange(newVariants);
        }}>
          Regenerate Variants
        </Button>
      </div>
      
      {variants.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No variants generated. Please select specifications above.</p>
        </div>
      ) : (
        <div className="grid gap-4 max-h-96 overflow-y-auto">
          {variants.map((variant, index) => (
            <Card key={index} className="border-l-4 border-l-blue-500">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-blue-700">
                  {getSpecificationDisplay(variant.specifications)}
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">SKU</label>
                  <Input
                    type="text"
                    value={variant.sku}
                    onChange={(e) => updateVariant(index, 'sku', e.target.value)}
                    className="text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Price</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={variant.price}
                    onChange={(e) => updateVariant(index, 'price', Number(e.target.value))}
                    className="text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Sale Price</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={variant.salePrice || ''}
                    onChange={(e) => updateVariant(index, 'salePrice', Number(e.target.value) || undefined)}
                    className="text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Quantity</label>
                  <Input
                    type="number"
                    value={variant.quantity}
                    onChange={(e) => updateVariant(index, 'quantity', Number(e.target.value))}
                    className="text-sm"
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      {variants.length > 0 && (
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-blue-700">
            <strong>Total Variants:</strong> {variants.length} combinations generated from your specifications.
          </p>
        </div>
      )}
    </div>
  );
};