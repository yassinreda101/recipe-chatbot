import { NextApiRequest, NextApiResponse } from 'next'
import OpenAI from 'openai'
import { StructuredRecipe } from '../../types'
import NodeCache from 'node-cache'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const ASSISTANT_ID = process.env.OPENAI_ASSISTANT_ID
const MAX_RETRIES = 3
const CACHE_TTL = 3600 // Cache time-to-live in seconds (1 hour)
const cache = new NodeCache({ stdTTL: CACHE_TTL })

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
    })

    try {
      const { prompt } = req.body

      const cachedRecipe = cache.get<StructuredRecipe>(prompt)
      if (cachedRecipe) {
        res.write(`data: ${JSON.stringify({ status: 'complete', recipe: cachedRecipe })}\n\n`)
        res.end()
        return
      }

      res.write(`data: ${JSON.stringify({ status: 'generating' })}\n\n`)

      let recipeData: StructuredRecipe | null = null
      let attempts = 0

      while (!recipeData && attempts < MAX_RETRIES) {
        attempts++
        try {
          recipeData = await generateRecipe(prompt, res)
        } catch (error) {
          console.error(`Error in attempt ${attempts}:`, error)
          if (attempts === MAX_RETRIES) {
            throw error
          }
        }
      }

      if (recipeData) {
        cache.set(prompt, recipeData)
        res.write(`data: ${JSON.stringify({ status: 'complete', recipe: recipeData })}\n\n`)
      } else {
        throw new Error('Failed to generate a valid recipe after multiple attempts')
      }
    } catch (error) {
      console.error('Error:', error)
      res.write(`data: ${JSON.stringify({ status: 'error', message: 'Failed to generate recipe' })}\n\n`)
    }
    res.end()
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

async function generateRecipe(prompt: string, res: NextApiResponse): Promise<StructuredRecipe> {
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
  
  let delay = 1000
  const maxDelay = 5000
  let timeout = 60000 // 60 seconds timeout
  const startTime = Date.now()

  while (runStatus.status !== 'completed') {
    if (Date.now() - startTime > timeout) {
      throw new Error('Recipe generation timed out')
    }

    await new Promise(resolve => setTimeout(resolve, delay))
    runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id)
    delay = Math.min(delay * 1.5, maxDelay)

    res.write(`data: ${JSON.stringify({ status: 'generating', progress: runStatus.status })}\n\n`)
  }

  const messages = await openai.beta.threads.messages.list(thread.id)

  const lastAssistantMessage = messages.data
    .filter(message => message.role === 'assistant')
    .pop()

  if (lastAssistantMessage && typeof lastAssistantMessage.content[0] === 'object' && 'text' in lastAssistantMessage.content[0]) {
    const responseText = lastAssistantMessage.content[0].text.value
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