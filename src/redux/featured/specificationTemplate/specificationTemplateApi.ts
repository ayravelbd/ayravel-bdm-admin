import { baseApi } from "@/redux/api/baseApi";

export const specificationTemplateApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllSpecificationTemplates: builder.query({
      query: () => "/specification-template",
      providesTags: ["SpecificationTemplate"],
    }),
    
    getSpecificationTemplateByCategory: builder.query({
      query: (categoryId: string) => `/specification-template/category/${categoryId}`,
      providesTags: ["SpecificationTemplate"],
    }),
    
    createSpecificationTemplate: builder.mutation({
      query: (data) => ({
        url: "/specification-template/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["SpecificationTemplate"],
    }),
    
    generateProductVariants: builder.mutation({
      query: (productId: string) => ({
        url: `/product/generate-variants/${productId}`,
        method: "POST",
      }),
      invalidatesTags: ["Product"],
    }),
  }),
});

export const {
  useGetAllSpecificationTemplatesQuery,
  useGetSpecificationTemplateByCategoryQuery,
  useCreateSpecificationTemplateMutation,
  useGenerateProductVariantsMutation,
} = specificationTemplateApi;