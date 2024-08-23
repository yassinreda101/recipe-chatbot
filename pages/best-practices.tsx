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
            <li>Be specific about your dietary needs (e.g., &quot;high-protein&quot;, &quot;low-carb&quot;, &quot;vegan&quot;)</li>
            <li>Mention key ingredients you want to use</li>
            <li>Specify the type of meal (e.g., breakfast, snack, dinner)</li>
            <li>Include any time constraints (e.g., &quot;quick 15-minute meal&quot;)</li>
            <li>Mention cooking method preferences (e.g., &quot;oven-baked&quot;, &quot;stovetop&quot;)</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-pink-400">Example Prompts</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>&quot;Give me a high-protein vegetarian breakfast recipe&quot;</li>
            <li>&quot;I need a quick 10-minute snack with chocolate and protein&quot;</li>
            <li>&quot;What&apos;s a good low-carb dinner recipe using chicken and vegetables?&quot;</li>
            <li>&quot;Can you suggest a vegan protein shake recipe?&quot;</li>
            <li>&quot;I want a hearty soup recipe for cold winter days&quot;</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-pink-400">Tips for Best Results</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>If you&apos;re not satisfied with a recipe, try regenerating it or adjusting your prompt</li>
            <li>Use the &quot;Remove&quot; feature to exclude ingredients you don&apos;t want or don&apos;t have</li>
            <li>Check the nutritional information to ensure it meets your dietary needs</li>
            <li>Feel free to ask for modifications to a generated recipe</li>
            <li>Save your favorite recipes using the &quot;Copy Recipe&quot; feature</li>
          </ul>
        </section>

        <Link href="/" className="inline-block px-6 py-3 bg-yellow-400 text-gray-900 font-bold rounded-full hover:bg-pink-500 transition-all duration-300 ease-in-out transform hover:scale-105">
          Back to Recipe Generator
        </Link>
      </main>
    </Layout>
  );
}