export interface ISpecificationOption {
  value: string;
  label: string;
  colorCode?: string;
  image?: string;
}

export interface ISpecificationField {
  name: string;
  label: string;
  type: "select" | "color" | "text" | "number";
  required: boolean;
  options: ISpecificationOption[];
}

export interface ISpecificationTemplate {
  _id: string;
  categoryId: string;
  categoryName: string;
  fields: ISpecificationField[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}