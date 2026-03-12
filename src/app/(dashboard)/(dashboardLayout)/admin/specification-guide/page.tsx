"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function SimpleSpecificationGuide() {
  const commonSpecs = [
    { name: "Color", values: ["Red", "Blue", "Black", "White", "Green", "Yellow", "Pink", "Gray", "Brown", "Orange"] },
    { name: "Size", values: ["XS", "S", "M", "L", "XL", "XXL", "XXXL"] },
    { name: "Material", values: ["Cotton", "Polyester", "Leather", "Canvas", "Nylon", "Silk", "Wool", "Denim"] },
    { name: "Style", values: ["Casual", "Formal", "Sport", "Vintage", "Modern", "Classic"] },
    { name: "Pattern", values: ["Solid", "Striped", "Checkered", "Floral", "Geometric", "Abstract"] },
    { name: "Shoe Size", values: ["35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45"] },
    { name: "Storage", values: ["32GB", "64GB", "128GB", "256GB", "512GB", "1TB"] },
    { name: "Capacity", values: ["Small", "Medium", "Large", "Extra Large"] }
  ];

  const getColorCode = (colorName: string): string => {
    const colorMap: { [key: string]: string } = {
      red: '#FF0000', blue: '#0000FF', black: '#000000', white: '#FFFFFF',
      green: '#008000', yellow: '#FFFF00', pink: '#FFC0CB', gray: '#808080',
      grey: '#808080', brown: '#8B4513', orange: '#FFA500', purple: '#800080'
    };
    return colorMap[colorName.toLowerCase()] || '#CCCCCC';
  };

  return (
    <div className="space-y-6 p-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">Product Specifications Guide</h1>
        <p className="text-gray-600">Common specifications you can use for your products</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {commonSpecs.map((spec, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="text-lg">{spec.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {spec.values.map((value, valueIndex) => (
                  <Badge key={valueIndex} variant="secondary" className="text-xs">
                    {spec.name.toLowerCase().includes('color') && (
                      <div
                        className="w-2 h-2 rounded-full mr-1"
                        style={{ 
                          backgroundColor: getColorCode(value)
                        }}
                      />
                    )}
                    {value}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-blue-50">
        <CardHeader>
          <CardTitle>How to Use Specifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">For Simple Products:</h4>
              <ul className="text-sm space-y-1 text-gray-700">
                <li>• Add specifications for product details</li>
                <li>• No variants will be created</li>
                <li>• Single price and inventory</li>
                <li>• Example: Red Cotton T-Shirt</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">For Variable Products:</h4>
              <ul className="text-sm space-y-1 text-gray-700">
                <li>• Add multiple values per specification</li>
                <li>• System creates all combinations</li>
                <li>• Individual pricing per variant</li>
                <li>• Example: Red/Blue + S/M/L = 6 variants</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-green-50">
        <CardHeader>
          <CardTitle>Quick Examples</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div>
              <h5 className="font-medium">👕 Clothing</h5>
              <p className="text-gray-600">Color: Red, Blue, Black<br/>Size: S, M, L, XL</p>
            </div>
            <div>
              <h5 className="font-medium">👜 Bags</h5>
              <p className="text-gray-600">Color: Black, Brown<br/>Material: Leather, Canvas</p>
            </div>
            <div>
              <h5 className="font-medium">📱 Electronics</h5>
              <p className="text-gray-600">Color: Black, White<br/>Storage: 64GB, 128GB</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}