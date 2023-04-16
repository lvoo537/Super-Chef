import { createContext, useContext } from 'react';

export const CreateRecipeIngredientsContext = createContext({
    ingredients: [],
    setIngredients: (ingredients) => {}
});

export function useCreateIngredientsContext() {
    return useContext(CreateRecipeIngredientsContext);
}
