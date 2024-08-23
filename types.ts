export interface StructuredRecipe {
    title: string;
    servings: number;
    cookingTime: string;
    ingredients: Array<{name: string, amount: string}>;
    instructions: string[];
    nutritionalInfo: {
      calories: number;
      protein: number;
      carbs: number;
      fat: number;
    };
  }