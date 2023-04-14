import { createContext, useContext, useState } from 'react';

export const RecipeContext = createContext({
    recipeId: -1,
    setRecipeId: (recipeId) => {}
});

export const RecipeProvider = ({ children }) => {
    const [recipeId, setRecipeId] = useState(-1);

    return (
        <RecipeContext.Provider value={{ recipeId, setRecipeId }}>
            {children}
        </RecipeContext.Provider>
    );
};

export function useRecipeContext() {
    return useContext(RecipeContext);
}
