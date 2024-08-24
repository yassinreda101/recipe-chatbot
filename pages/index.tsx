import { useState } from 'react'
import { useMutation } from 'react-query'
import Link from 'next/link'
import { StructuredRecipe } from '../types'
import Layout from './components/Layouts'

export default function Home() {
  const [prompt, setPrompt] = useState('')
  const [recipe, setRecipe] = useState<StructuredRecipe | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [availableIngredients, setAvailableIngredients] = useState<Array<{name: string, amount: string}>>([])

  const mutation = useMutation({
    mutationFn: async (input: { prompt: string }) => {
      const response = await fetch('/api/getRecipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to get recipe')
      }
      const data = await response.json()
      console.log('API response:', data)
      return data as StructuredRecipe
    },
    onSuccess: (data: StructuredRecipe) => {
      console.log('onSuccess called with data:', data)
      setRecipe(data)
      setAvailableIngredients(data.ingredients)
      setError(null)
    },
    onError: (error: Error) => {
      console.error('Error in mutation:', error)
      setError(error.message)
      setRecipe(null)
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    mutation.mutate({ prompt })
  }

  const handleRemoveIngredient = (index: number) => {
    setAvailableIngredients(prevIngredients => prevIngredients.filter((_, i) => i !== index))
  }

  const handleRegenerateRecipe = () => {
    if (recipe) {
      const updatedPrompt = `Create a recipe with these ingredients: ${availableIngredients.map(ing => `${ing.amount} ${ing.name}`).join(', ')}`
      mutation.mutate({ prompt: updatedPrompt })
    }
  }

  const copyToClipboard = (recipe: StructuredRecipe) => {
    const recipeText = `
${recipe.title}

Servings: ${recipe.servings}
Cooking Time: ${recipe.cookingTime}

Ingredients:
${recipe.ingredients.map(ing => `${ing.amount} ${ing.name}`).join('\n')}

Instructions:
${recipe.instructions.join('\n')}

Nutritional Information (per serving):
Calories: ${Math.round(recipe.nutritionalInfo.calories / recipe.servings)}
Protein: ${Math.round(recipe.nutritionalInfo.protein / recipe.servings)}g
Carbs: ${Math.round(recipe.nutritionalInfo.carbs / recipe.servings)}g
Fat: ${Math.round(recipe.nutritionalInfo.fat / recipe.servings)}g
    `.trim()

    navigator.clipboard.writeText(recipeText).then(() => {
      alert('Recipe copied to clipboard! Happy cooking, matey! 🏴‍☠️🍳')
    }, (err) => {
      console.error('Could not copy text: ', err)
    })
  }

  return (
    <Layout title="ProteinPirate - Your Friendly AI Recipe Mate">
      <main className="flex-grow flex flex-col items-center justify-center">
        <div className="w-full max-w-3xl text-center">
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-500 mb-6">ProteinPirate</h1>
          <p className="text-2xl text-yellow-200 mb-12">Ahoy, matey! Ready to cook up a storm? 🏴‍☠️🍽️</p>

          <form onSubmit={handleSubmit} className="mb-12 space-y-4">
            <div className="relative">
              <input 
                id="prompt" 
                name="prompt" 
                type="text" 
                className="w-full py-4 px-6 text-lg text-gray-200 bg-gray-800 bg-opacity-50 rounded-full border-2 border-yellow-400 focus:outline-none focus:border-pink-500 transition-all duration-300 ease-in-out" 
                placeholder="Can I get a chicken burger recipe for 3..." 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
              <button 
                type="submit" 
                className="absolute right-2 top-2 bottom-2 px-6 bg-gradient-to-r from-yellow-400 to-pink-500 text-gray-900 font-bold rounded-full hover:from-yellow-500 hover:to-pink-600 transition-all duration-300 ease-in-out transform hover:scale-105"
                disabled={mutation.isLoading}
              >
                {mutation.isLoading ? (
                  <svg className="animate-spin h-5 w-5 text-gray-900 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : 'Set Sail!'}
              </button>
            </div>
            <p className="text-sm text-yellow-200">
              Need help? Check out our <Link href="/best-practices" className="text-pink-400 hover:text-pink-300 underline">best practices</Link> for using ProteinPirate!
            </p>
          </form>

          {error && (
            <div className="bg-red-500 bg-opacity-75 text-white p-6 rounded-2xl mb-8 animate-pulse">
              <p className="font-bold mb-2">Shiver me timbers! We&apos;ve hit a snag:</p>
              <p>{error}</p>
              <p className="mt-4">Don&apos;t worry, matey! Give it another shot or adjust yer course slightly!</p>
            </div>
          )}

          {recipe && !mutation.isLoading && (
            <div key={recipe.title} className="text-left bg-gray-800 bg-opacity-50 p-8 rounded-3xl shadow-2xl transition-all duration-300 ease-in-out hover:shadow-yellow-500/20">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-500">{recipe.title}</h2>
                <button
                  onClick={() => copyToClipboard(recipe)}
                  className="px-4 py-2 bg-yellow-400 text-gray-900 font-bold rounded-full hover:bg-pink-500 transition-all duration-300 ease-in-out transform hover:scale-105"
                >
                  Copy Recipe
                </button>
              </div>
              <p className="text-md text-yellow-200 mb-6">Servings: {recipe.servings} | Cooking Time: {recipe.cookingTime}</p>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-medium text-yellow-400 mb-4">Treasure Chest (Ingredients)</h3>
                  <ul className="space-y-2">
                    {availableIngredients.map((item, index) => (
                      <li key={index} className="flex justify-between items-center bg-gray-700 bg-opacity-50 p-3 rounded-xl">
                        <span>🏴‍☠️ {item.amount} {item.name}</span>
                        <button 
                          onClick={() => handleRemoveIngredient(index)}
                          className="ml-2 px-3 py-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all duration-300 ease-in-out transform hover:scale-105"
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                  <button 
                    onClick={handleRegenerateRecipe}
                    className="mt-4 px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-full hover:from-green-600 hover:to-blue-600 transition-all duration-300 ease-in-out transform hover:scale-105"
                    disabled={mutation.isLoading}
                  >
                    Regenerate Recipe
                  </button>
                </div>

                <div>
                  <h3 className="text-xl font-medium text-pink-400 mb-4">Captain&apos;s Orders (Instructions)</h3>
                  <ol className="space-y-4">
                    {recipe.instructions.map((step, index) => (
                      <li key={index} className="bg-gray-700 bg-opacity-50 p-4 rounded-xl">
                        <span className="font-bold text-yellow-400 mr-2">{index + 1}.</span> {step}
                      </li>
                    ))}
                  </ol>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-xl font-medium text-yellow-400 mb-4">Nutritional Booty (per serving)</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(recipe.nutritionalInfo).map(([key, value]) => (
                    <div key={key} className="bg-gray-700 bg-opacity-50 p-4 rounded-2xl text-center">
                      <p className="text-2xl font-bold text-pink-400">{Math.round(value / recipe.servings)}{key === 'calories' ? '' : 'g'}</p>
                      <p className="text-sm text-yellow-200 capitalize">{key}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </Layout>
  )
}