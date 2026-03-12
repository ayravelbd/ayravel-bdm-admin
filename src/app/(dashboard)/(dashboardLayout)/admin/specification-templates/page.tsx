"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useGetAllSpecificationTemplatesQuery, useCreateSpecificationTemplateMutation } from "@/redux/featured/specificationTemplate/specificationTemplateApi";
import { useGetAllCategoriesQuery } from "@/redux/featured/categories/categoryApi";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

interface SpecOption {
  value: string;
  label: string;
  colorCode?: string;
}

interface SpecField {
  name: string;
  label: string;
  type: "select" | "color" | "text" | "number";
  required: boolean;
  options: SpecOption[];
}

export default function SpecificationTemplatesPage() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [templateName, setTemplateName] = useState("");
  const [fields, setFields] = useState<SpecField[]>([]);
  const [currentField, setCurrentField] = useState<SpecField>({
    name: "",
    label: "",
    type: "select",
    required: false,
    options: []
  });
  const [newOption, setNewOption] = useState({ value: "", label: "", colorCode: "" });

  const { data: templates, isLoading } = useGetAllSpecificationTemplatesQuery({});
  const { data: categories } = useGetAllCategoriesQuery(undefined);
  const [createTemplate] = useCreateSpecificationTemplateMutation();

  // Predefined templates for common categories
  const predefinedTemplates = {
    clothing: {
      name: "Clothing",
      fields: [
        {
          name: "color",
          label: "Color",
          type: "color" as const,
          required: true,
          options: [
            { value: "red", label: "Red", colorCode: "#FF0000" },
            { value: "blue", label: "Blue", colorCode: "#0000FF" },
            { value: "black", label: "Black", colorCode: "#000000" },
            { value: "white", label: "White", colorCode: "#FFFFFF" },
            { value: "green", label: "Green", colorCode: "#008000" },
            { value: "yellow", label: "Yellow", colorCode: "#FFFF00" },
            { value: "pink", label: "Pink", colorCode: "#FFC0CB" },
            { value: "gray", label: "Gray", colorCode: "#808080" }
          ]
        },
        {
          name: "size",
          label: "Size",
          type: "select" as const,
          required: true,
          options: [
            { value: "xs", label: "XS" },
            { value: "s", label: "S" },
            { value: "m", label: "M" },
            { value: "l", label: "L" },
            { value: "xl", label: "XL" },
            { value: "xxl", label: "XXL" },
            { value: "xxxl", label: "XXXL" }
          ]
        }
      ]
    },
    bags: {
      name: "Bags & Accessories",
      fields: [
        {
          name: "color",
          label: "Color",
          type: "color" as const,
          required: true,
          options: [
            { value: "black", label: "Black", colorCode: "#000000" },
            { value: "brown", label: "Brown", colorCode: "#8B4513" },
            { value: "tan", label: "Tan", colorCode: "#D2B48C" },
            { value: "red", label: "Red", colorCode: "#FF0000" },
            { value: "blue", label: "Navy Blue", colorCode: "#000080" },
            { value: "white", label: "White", colorCode: "#FFFFFF" },
            { value: "gray", label: "Gray", colorCode: "#808080" }
          ]
        },
        {
          name: "material",
          label: "Material",
          type: "select" as const,
          required: false,
          options: [
            { value: "leather", label: "Leather" },
            { value: "canvas", label: "Canvas" },
            { value: "nylon", label: "Nylon" },
            { value: "polyester", label: "Polyester" },
            { value: "cotton", label: "Cotton" }
          ]
        }
      ]
    },
    shoes: {
      name: "Shoes & Footwear",
      fields: [
        {
          name: "color",
          label: "Color",
          type: "color" as const,
          required: true,
          options: [
            { value: "black", label: "Black", colorCode: "#000000" },
            { value: "white", label: "White", colorCode: "#FFFFFF" },
            { value: "brown", label: "Brown", colorCode: "#8B4513" },
            { value: "red", label: "Red", colorCode: "#FF0000" },
            { value: "blue", label: "Blue", colorCode: "#0000FF" },
            { value: "gray", label: "Gray", colorCode: "#808080" }
          ]
        },
        {
          name: "size",
          label: "Size",
          type: "select" as const,
          required: true,
          options: [
            { value: "35", label: "35" },
            { value: "36", label: "36" },
            { value: "37", label: "37" },
            { value: "38", label: "38" },
            { value: "39", label: "39" },
            { value: "40", label: "40" },
            { value: "41", label: "41" },
            { value: "42", label: "42" },
            { value: "43", label: "43" },
            { value: "44", label: "44" },
            { value: "45", label: "45" }
          ]
        }
      ]
    },
    electronics: {
      name: "Electronics",
      fields: [
        {
          name: "color",
          label: "Color",
          type: "color" as const,
          required: false,
          options: [
            { value: "black", label: "Black", colorCode: "#000000" },
            { value: "white", label: "White", colorCode: "#FFFFFF" },
            { value: "silver", label: "Silver", colorCode: "#C0C0C0" },
            { value: "gold", label: "Gold", colorCode: "#FFD700" },
            { value: "blue", label: "Blue", colorCode: "#0000FF" },
            { value: "red", label: "Red", colorCode: "#FF0000" }
          ]
        },
        {
          name: "storage",
          label: "Storage",
          type: "select" as const,
          required: false,
          options: [
            { value: "32gb", label: "32GB" },
            { value: "64gb", label: "64GB" },
            { value: "128gb", label: "128GB" },
            { value: "256gb", label: "256GB" },
            { value: "512gb", label: "512GB" },
            { value: "1tb", label: "1TB" }
          ]
        }
      ]
    }
  };

  const loadPredefinedTemplate = (templateKey: string) => {
    const template = predefinedTemplates[templateKey as keyof typeof predefinedTemplates];
    if (template) {
      setFields(template.fields);
      setTemplateName(template.name);
    }
  };

  const addOptionToCurrentField = () => {
    if (!newOption.value || !newOption.label) {
      toast.error("Please fill option value and label");
      return;
    }

    setCurrentField(prev => ({
      ...prev,
      options: [...prev.options, { ...newOption }]
    }));
    setNewOption({ value: "", label: "", colorCode: "" });
  };

  const removeOptionFromCurrentField = (index: number) => {
    setCurrentField(prev => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index)
    }));
  };

  const addFieldToTemplate = () => {
    if (!currentField.name || !currentField.label || currentField.options.length === 0) {
      toast.error("Please fill all field details and add at least one option");
      return;
    }

    setFields(prev => [...prev, { ...currentField }]);
    setCurrentField({
      name: "",
      label: "",
      type: "select",
      required: false,
      options: []
    });
  };

  const removeFieldFromTemplate = (index: number) => {
    setFields(prev => prev.filter((_, i) => i !== index));
  };

  const handleCreateTemplate = async () => {
    if (!selectedCategory || !templateName || fields.length === 0) {
      toast.error("Please fill all required fields and add at least one specification field");
      return;
    }

    try {
      const categoryData = categories?.find(cat => cat._id === selectedCategory);
      await createTemplate({
        categoryId: selectedCategory,
        categoryName: categoryData?.name || "",
        fields: fields,
        isActive: true
      }).unwrap();
      
      toast.success("Template created successfully!");
      setShowCreateForm(false);
      setSelectedCategory("");
      setTemplateName("");
      setFields([]);
    } catch (error) {
      toast.error("Failed to create template");
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Specification Templates</h1>
        <Button onClick={() => setShowCreateForm(true)}>
          Create Template
        </Button>
      </div>

      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Specification Template</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Quick Templates */}
            <div>
              <label className="block font-medium mb-2">Quick Templates</label>
              <div className="flex flex-wrap gap-2">
                {Object.entries(predefinedTemplates).map(([key, template]) => (
                  <Button
                    key={key}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => loadPredefinedTemplate(key)}
                  >
                    {template.name}
                  </Button>
                ))}
              </div>
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-medium mb-2">Category *</label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories?.map((cat) => (
                      <SelectItem key={cat._id} value={cat._id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block font-medium mb-2">Template Name *</label>
                <Input
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  placeholder="e.g., Clothing Specifications"
                />
              </div>
            </div>

            {/* Current Fields */}
            {fields.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Added Fields:</h4>
                <div className="space-y-2">
                  {fields.map((field, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <div>
                        <span className="font-medium">{field.label}</span>
                        <span className="text-sm text-gray-600 ml-2">({field.type})</span>
                        <span className="text-xs text-gray-500 ml-2">{field.options.length} options</span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFieldFromTemplate(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Add New Field */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Add Specification Field</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block font-medium mb-2">Field Name</label>
                    <Input
                      value={currentField.name}
                      onChange={(e) => setCurrentField(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., color, size"
                    />
                  </div>
                  <div>
                    <label className="block font-medium mb-2">Display Label</label>
                    <Input
                      value={currentField.label}
                      onChange={(e) => setCurrentField(prev => ({ ...prev, label: e.target.value }))}
                      placeholder="e.g., Color, Size"
                    />
                  </div>
                  <div>
                    <label className="block font-medium mb-2">Field Type</label>
                    <Select 
                      value={currentField.type} 
                      onValueChange={(value) => setCurrentField(prev => ({ ...prev, type: value as any }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="select">Select (Dropdown)</SelectItem>
                        <SelectItem value="color">Color (Color Picker)</SelectItem>
                        <SelectItem value="text">Text Input</SelectItem>
                        <SelectItem value="number">Number Input</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Add Options */}
                <div>
                  <label className="block font-medium mb-2">Add Options</label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      placeholder="Option value (e.g., red, xl)"
                      value={newOption.value}
                      onChange={(e) => setNewOption(prev => ({ ...prev, value: e.target.value }))}
                    />
                    <Input
                      placeholder="Display label (e.g., Red, XL)"
                      value={newOption.label}
                      onChange={(e) => setNewOption(prev => ({ ...prev, label: e.target.value }))}
                    />
                    {currentField.type === 'color' && (
                      <Input
                        type="color"
                        value={newOption.colorCode}
                        onChange={(e) => setNewOption(prev => ({ ...prev, colorCode: e.target.value }))}
                        className="w-20"
                      />
                    )}
                    <Button type="button" onClick={addOptionToCurrentField}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  {/* Current Field Options */}
                  {currentField.options.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {currentField.options.map((option, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center gap-1">
                          {currentField.type === 'color' && option.colorCode && (
                            <div 
                              className="w-3 h-3 rounded-full" 
                              style={{ backgroundColor: option.colorCode }}
                            />
                          )}
                          {option.label}
                          <X 
                            className="w-3 h-3 cursor-pointer" 
                            onClick={() => removeOptionFromCurrentField(index)}
                          />
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <Button type="button" onClick={addFieldToTemplate}>
                  Add Field to Template
                </Button>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button onClick={handleCreateTemplate} disabled={fields.length === 0}>
                Create Template
              </Button>
              <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Existing Templates */}
      <div className="grid gap-4">
        {templates?.data?.map((template: any) => (
          <Card key={template._id}>
            <CardHeader>
              <CardTitle>{template.categoryName} Template</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {template.fields.map((field: any, index: number) => (
                  <div key={index} className="border-l-4 border-l-blue-500 pl-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium">{field.label}</span>
                      <Badge variant="outline">{field.type}</Badge>
                      {field.required && <Badge variant="destructive">Required</Badge>}
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {field.options.slice(0, 5).map((option: any, optIndex: number) => (
                        <Badge key={optIndex} variant="secondary" className="text-xs">
                          {field.type === 'color' && option.colorCode && (
                            <div 
                              className="w-2 h-2 rounded-full mr-1" 
                              style={{ backgroundColor: option.colorCode }}
                            />
                          )}
                          {option.label}
                        </Badge>
                      ))}
                      {field.options.length > 5 && (
                        <Badge variant="outline" className="text-xs">
                          +{field.options.length - 5} more
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}