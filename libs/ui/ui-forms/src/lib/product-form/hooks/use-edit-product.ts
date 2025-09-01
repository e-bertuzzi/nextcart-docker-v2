import { useState, useEffect } from 'react';
import { productService } from '../service/product-service';
import {
  Option,
  ProductFormState,
  ProductUpdatePayload,
  NutritionalInfoOption,
} from '../interface/types';

export function useEditProduct(productId: string) {
  const [formData, setFormData] = useState<ProductFormState>({
    productId: '',
    name: '',
    itName: '',
    productCategoryId: undefined,
    productClaimIds: [],
    productAllergenIds: [],
    productDietIds: [],
    nutritionalInfoValues: [],
  });

  const [categories, setCategories] = useState<Option[]>([]);
  const [claims, setClaims] = useState<Option[]>([]);
  const [allergens, setAllergens] = useState<Option[]>([]);
  const [dietOptions, setDietOptions] = useState<Option[]>([]);
  const [nutritionalInfos, setNutritionalInfos] = useState<
    NutritionalInfoOption[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    content: string;
  } | null>(null);

  // Fetch options + product data all’inizio
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [cat, cl, al, di, niRaw, product] = await Promise.all([
          productService.getCategories(),
          productService.getClaims(),
          productService.getAllergens(),
          productService.getDiets(),
          productService.getNutritionalInfos(),
          productService.getProduct(productId), // fetch prodotto esistente
        ]);

        setCategories(cat);
        setClaims(cl);
        setAllergens(
          al.map((item: any) => ({
            label: item.value, // 👈 testo mostrato nella UI
            value: item.value, // 👈 valore usato nei dati
          }))
        );
        
        setDietOptions(
          di.map((item: any) => ({
            label: item.value, // 👈 testo mostrato nella UI
            value: item.value, // 👈 valore usato nei dati
          }))
        );

        const niMapped = niRaw.map((item: any) => ({
          label: item.label,
          value: item.value,
          unitOfMeasure: item.unitOfMeasure,
        }));
        setNutritionalInfos(niMapped);

        // Popola formData dal prodotto fetchato
        setFormData({
          productId: product.productId,
          name: product.name,
          itName: product.itName,
          productCategoryId:
            product.productCategory?.productCategoryId ?? undefined,
          productClaimIds:
            product.productClaims
              ?.map((c: any) => c.claim?.claimId)
              .filter((id: any) => id !== undefined) ?? [],
          productAllergenIds:
            product.productAllergens
              ?.map((a: any) => a.allergen?.allergenId)
              .filter((id: any) => id !== undefined) ?? [],
          productDietIds: product.productDiets?.map((d: any) => d.dietId) ?? [],

          nutritionalInfoValues:
            product.nutritionalInformationValues
              ?.map((n: any) => ({
                nutrientId: n.nutrient?.nutrientId,
                value: n.value != null ? n.value.toString() : '',
              }))
              .filter(
                (n: { nutrientId: undefined }) => n.nutrientId !== undefined
              ) ?? [],
        });

      } catch (error) {
        setMessage({ type: 'error', content: 'Error loading product data.' });
        console.error('Fetch product data error:', error);
        setMessage({ type: 'error', content: 'Error loading product data.' });
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [productId]);

  const onChange = <K extends keyof ProductFormState>(
    field: K,
    value: ProductFormState[K]
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const payload: ProductUpdatePayload = {
        name: formData.name,
        itName: formData.itName,
        productCategory: formData.productCategoryId
          ? { productCategoryId: formData.productCategoryId }
          : undefined,
        productClaims: formData.productClaimIds.map((claimId) => ({
          product: { productId: formData.productId }, // aggiungi questo
          claim: { claimId },
        })),
        productAllergens: formData.productAllergenIds.map((allergenId) => ({
          product: { productId: formData.productId }, // se serve anche qui
          allergen: { allergenId },
        })),
        productDiets: formData.productDietIds.map((dietId) => ({
          product: { productId: formData.productId }, // se serve anche qui
          dietId,
        })),
        nutritionalInformationValues: formData.nutritionalInfoValues
          .filter((v) => v.value !== '' && !isNaN(Number(v.value)))
          .map((v) => ({
            id: v.nutrientId,
            value: Number(v.value),
          })),
      };

      await productService.updateProduct(formData.productId, payload);
      setMessage({ type: 'success', content: 'Product updated successfully!' });
    } catch (error) {
      setMessage({ type: 'error', content: 'Error updating product.' });
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    loading,
    message,
    onChange,
    handleSubmit,
    setMessage,
    categories,
    claims,
    allergens,
    dietOptions,
    nutritionalInfos,
  };
}
