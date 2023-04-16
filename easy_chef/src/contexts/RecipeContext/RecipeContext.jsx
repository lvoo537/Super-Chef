import { createContext, useContext, useState } from 'react';

export const RecipeContext = createContext({
    recipeId: -1,
    setRecipeId: (recipeId) => {},
    fromCard: false,
    setFromCard: (val) => {}
});

export const RecipeProvider = ({ children }) => {
    const [recipeId, setRecipeId] = useState(-1);
    const [fromCard, setFromCard] = useState(false);

    return (
        <RecipeContext.Provider value={{ recipeId, setRecipeId, fromCard, setFromCard }}>
            {children}
        </RecipeContext.Provider>
    );
};

export function useRecipeContext() {
    return useContext(RecipeContext);
}
