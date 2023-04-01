import { createContext, useContext } from 'react';

export const RecipeContext = createContext({
    recipeId: '',
    setRecipeId: (recipeId) => {}
});

export function useRecipeContext() {
    return useContext(RecipeContext);
}
