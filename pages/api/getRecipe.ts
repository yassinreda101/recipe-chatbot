import type { NextApiRequest, NextApiResponse } from 'next'
import OpenAI from 'openai'
import { StructuredRecipe } from '../../types'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const ASSISTANT_ID = process.env.OPENAI_ASSISTANT_ID

const MAX_RETRIES = 3

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  if (req.method === 'POST') {
    try {
      const { prompt } = req.body

      if (!process.env.OPENAI_API_KEY) {
        throw new Error('OPENAI_API_KEY is not set')
      }

      if (!ASSISTANT_ID) {
        throw new Error('OPENAI_ASSISTANT_ID is not set')
      }

      let recipeData: StructuredRecipe | null = null
      let attempts = 0

      while (!recipeData && attempts < MAX_RETRIES) {
        attempts++
        console.log(`Attempt ${attempts} to generate recipe`)

        try {
          recipeData = await generateRecipe(prompt)
        } catch (error) {
          console.error(`Error in attempt ${attempts}:`, error)
          if (attempts === MAX_RETRIES) {
            throw error
          }
        }
      }

      if (recipeData) {
        res.status(200).json(recipeData)
      } else {
        throw new Error('Failed to generate a valid recipe after multiple attempts')
      }
    } catch (error) {
      console.error('Error:', error)
      res.status(500).json({ 
        error: 'Failed to generate recipe', 
        details: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      })
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

async function generateRecipe(prompt: string): Promise<StructuredRecipe> {
  const thread = await openai.beta.threads.create()

  const improvedPrompt = `
Based on the following user request: "${prompt}"

Please generate a high-protein, low-calorie recipe that best matches the user's intent. If the user's request is vague or not directly related to a specific recipe, use your knowledge to infer an appropriate recipe that aligns with their interests or dietary needs.

Provide the recipe in the following format:

Title: [Recipe Title]
Servings: [Number of Servings]
Cooking Time: [Cooking Time]

Ingredients:
- [Ingredient 1]: [Amount]
- [Ingredient 2]: [Amount]
...

Instructions:
1. [Step 1]
2. [Step 2]
...

Nutritional Information (for entire recipe):
Calories: [Total Calories]
Protein: [Total Protein] g
Carbs: [Total Carbs] g
Fat: [Total Fat] g

Important notes:
1. Ensure all nutritional information is accurate and consistent with the ingredients and serving size.
2. The nutritional information should be for the entire recipe, not per serving.
3. Aim for recipes with approximately 30-40g of protein per serving and under 500 calories per serving.
4. Include precise measurements for all ingredients to ensure accurate nutritional calculations.
5. IMPORTANT: Strictly adhere to the format provided above. Do not add any additional text or explanations outside of this format.
`

  await openai.beta.threads.messages.create(thread.id, {
    role: "user",
    content: improvedPrompt
  })

  const run = await openai.beta.threads.runs.create(thread.id, {
    assistant_id: ASSISTANT_ID as string,
  })

  let runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id)
  while (runStatus.status !== 'completed') {
    await new Promise(resolve => setTimeout(resolve, 1000))
    runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id)
  }

  const messages = await openai.beta.threads.messages.list(thread.id)

  const lastAssistantMessage = messages.data
    .filter(message => message.role === 'assistant')
    .pop()

  if (lastAssistantMessage && typeof lastAssistantMessage.content[0] === 'object' && 'text' in lastAssistantMessage.content[0]) {
    const responseText = lastAssistantMessage.content[0].text.value
    console.log('Raw AI response:', responseText)

    return parseRecipeText(responseText)
  } else {
    throw new Error('No valid response from assistant')
  }
}

function parseRecipeText(text: string): StructuredRecipe {
  const lines = text.split('\n').map(line => line.trim()).filter(line => line !== '')
  
  const recipe: Partial<StructuredRecipe> = {
    ingredients: [],
    instructions: [],
    nutritionalInfo: { calories: 0, protein: 0, carbs: 0, fat: 0 }
  }

  let currentSection: 'ingredients' | 'instructions' | null = null

  for (const line of lines) {
    if (line.startsWith('Title:')) {
      recipe.title = line.replace('Title:', '').trim()
    } else if (line.startsWith('Servings:')) {
      recipe.servings = parseInt(line.replace('Servings:', '').trim(), 10)
    } else if (line.startsWith('Cooking Time:')) {
      recipe.cookingTime = line.replace('Cooking Time:', '').trim()
    } else if (line === 'Ingredients:') {
      currentSection = 'ingredients'
    } else if (line === 'Instructions:') {
      currentSection = 'instructions'
    } else if (line.startsWith('Nutritional Information')) {
      currentSection = null
    } else if (line.startsWith('Calories:')) {
      recipe.nutritionalInfo!.calories = parseInt(line.split(':')[1].trim(), 10)
    } else if (line.startsWith('Protein:')) {
      recipe.nutritionalInfo!.protein = parseInt(line.split(':')[1].trim(), 10)
    } else if (line.startsWith('Carbs:')) {
      recipe.nutritionalInfo!.carbs = parseInt(line.split(':')[1].trim(), 10)
    } else if (line.startsWith('Fat:')) {
      recipe.nutritionalInfo!.fat = parseInt(line.split(':')[1].trim(), 10)
    } else if (currentSection === 'ingredients' && line.includes(':')) {
      const [name, amount] = line.split(':').map(part => part.trim())
      recipe.ingredients!.push({ name, amount })
    } else if (currentSection === 'instructions') {
      recipe.instructions!.push(line.replace(/^\d+\.\s*/, ''))
    }
  }

  if (!recipe.title || !recipe.servings || !recipe.cookingTime || recipe.ingredients!.length === 0 || recipe.instructions!.length === 0) {
    throw new Error('Failed to parse all required recipe fields')
  }

  return recipe as StructuredRecipe
}