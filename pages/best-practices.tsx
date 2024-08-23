import React from 'react';
import Link from 'next/link';
import Layout from './components/Layouts';

export default function BestPractices() {
  return (
    <Layout title="ProteinPirate - Best Practices">
      <main className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-yellow-400">Best Practices for Using ProteinPirate</h1>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-pink-400">How to Use ProteinPirate</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Be specific about your dietary needs (e.g., "high-protein", "low-carb", "vegan")</li>
            <li>Mention key ingredients you want to use</li>
            <li>Specify the type of meal (e.g., breakfast, snack, dinner)</li>
            <li>Include any time constraints (e.g., "quick 15-minute meal")</li>
            <li>Mention cooking method preferences (e.g., "oven-baked", "stovetop")</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-pink-400">Example Prompts</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>"Give me a high-protein vegetarian breakfast recipe"</li>
            <li>"I need a quick 10-minute snack with chocolate and protein"</li>
            <li>"What's a good low-carb dinner recipe using chicken and vegetables?"</li>
            <li>"Can you suggest a vegan protein shake recipe?"</li>
            <li>"I want a hearty soup recipe for cold winter days"</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-pink-400">Tips for Best Results</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>If you're not satisfied with a recipe, try regenerating it or adjusting your prompt</li>
            <li>Use the "Remove" feature to exclude ingredients you don't want or don't have</li>
            <li>Check the nutritional information to ensure it meets your dietary needs</li>
            <li>Feel free to ask for modifications to a generated recipe</li>
            <li>Save your favorite recipes using the "Copy Recipe" feature</li>
          </ul>
        </section>

        <Link href="/" className="inline-block px-6 py-3 bg-yellow-400 text-gray-900 font-bold rounded-full hover:bg-pink-500 transition-all duration-300 ease-in-out transform hover:scale-105">
          Back to Recipe Generator
        </Link>
      </main>
    </Layout>
  );
}