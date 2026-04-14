import { useRef } from "react";
import { useCategoryIndex, useCategoryPredict } from "../api/generated/toodl";

export function useCategoryPredictor(isShoppingList: boolean, onCategoryPredicted: (categoryId: number) => void) {
  const { data: categoriesData } = useCategoryIndex({ query: { enabled: isShoppingList } });
  const { mutate: predictCategory, isPending: isPredicting } = useCategoryPredict();

  const predictionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handlePredict = (value: string) => {
    if (!isShoppingList || value.trim().length < 2) return;

    if (predictionTimeoutRef.current) {
      clearTimeout(predictionTimeoutRef.current);
    }

    predictionTimeoutRef.current = setTimeout(() => {
      predictCategory(
        { data: { itemName: value.trim() } },
        {
          onSuccess: (data) => {
            if (data.categoryName && categoriesData) {
              const matchedCategory = categoriesData.find((cat) => cat.name === data.categoryName);
              if (matchedCategory) {
                onCategoryPredicted(matchedCategory.id);
              }
            }
          },
        },
      );
    }, 1000);
  };

  return { handlePredict, isPredicting };
}
