import React, { useState } from 'react'
import Layout from './components/Layouts'

interface Cookbook {
  id: string
  title: string
  description: string
  price: number
  imageUrl: string
}

const cookbooks: Cookbook[] = [
  {
    id: '1',
    title: "Protein Pirate's Treasure Chest",
    description: "50 high-protein recipes for the health-conscious buccaneer",
    price: 19.99,
    imageUrl: "/images/cookbook1.jpg"
  },
  {
    id: '2',
    title: "Galley Gourmet",
    description: "Exquisite ship-friendly recipes for the discerning sailor",
    price: 24.99,
    imageUrl: "/images/cookbook2.jpg"
  },
  // Add more cookbooks as needed
]

export default function Store() {
  const [cart, setCart] = useState<Cookbook[]>([])

  const addToCart = (cookbook: Cookbook) => {
    setCart([...cart, cookbook])
  }

  const removeFromCart = (id: string) => {
    setCart(cart.filter(item => item.id !== id))
  }

  const checkout = async () => {
    // In a real app, you'd integrate with a payment processor here
    alert("Thank you for your purchase! An email with download links will be sent shortly.")
    setCart([])
  }

  return (
    <Layout title="ProteinPirate - E-Cookbook Store">
      <main className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-yellow-400">Protein Pirate's E-Cookbook Store</h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-pink-400">Available Cookbooks</h2>
            <div className="space-y-6">
              {cookbooks.map(book => (
                <div key={book.id} className="bg-gray-800 bg-opacity-50 p-6 rounded-xl">
                  <img src={book.imageUrl} alt={book.title} className="w-full h-48 object-cover rounded-lg mb-4" />
                  <h3 className="text-xl font-semibold text-yellow-400">{book.title}</h3>
                  <p className="text-gray-300 mb-2">{book.description}</p>
                  <p className="text-white font-bold mb-4">${book.price.toFixed(2)}</p>
                  <button 
                    onClick={() => addToCart(book)}
                    className="px-4 py-2 bg-yellow-400 text-gray-900 font-bold rounded-full hover:bg-pink-500 transition-all duration-300 ease-in-out transform hover:scale-105"
                  >
                    Add to Cart
                  </button>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-pink-400">Your Cart</h2>
            {cart.length === 0 ? (
              <p className="text-gray-300">Your cart is empty, matey!</p>
            ) : (
              <div className="space-y-4">
                {cart.map(item => (
                  <div key={item.id} className="flex justify-between items-center bg-gray-700 bg-opacity-50 p-4 rounded-xl">
                    <span className="text-white">{item.title}</span>
                    <div>
                      <span className="text-yellow-400 mr-4">${item.price.toFixed(2)}</span>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="px-3 py-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all duration-300 ease-in-out transform hover:scale-105"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
                <div className="text-right">
                  <p className="text-xl font-bold text-yellow-400 mb-4">
                    Total: ${cart.reduce((sum, item) => sum + item.price, 0).toFixed(2)}
                  </p>
                  <button 
                    onClick={checkout}
                    className="px-6 py-3 bg-green-500 text-white font-bold rounded-full hover:bg-green-600 transition-all duration-300 ease-in-out transform hover:scale-105"
                  >
                    Checkout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </Layout>
  )
}