ProteinPirate 🏴‍☠️🍗
ProteinPirate is an AI-powered recipe generator that creates high-protein, low-calorie recipes tailored to your specific requests. Ahoy, health-conscious mateys! Set sail for a culinary adventure with our friendly AI First Mate!
![image](https://github.com/user-attachments/assets/78cc743a-7ece-456b-b90c-e874252da76d)


Features 🦜

AI-powered recipe generation
Customizable recipe requests
Nutritional information for each recipe
Ingredient management and recipe regeneration
Mobile-responsive design
Pirate-themed user interface

Technology Stack 🛠️

Next.js
React
TypeScript
Tailwind CSS
OpenAI API
React Query
Vercel (for deployment)

Getting Started 🚀
Prerequisites

Node.js (version 16.x)
npm (comes with Node.js)
OpenAI API key

Installation

Clone the repository:
Copygit clone https://github.com/yourusername/proteinpirate.git
cd proteinpirate

Install dependencies:
Copynpm install

Create a .env.local file in the root directory and add your OpenAI API key:
CopyOPENAI_API_KEY=your_api_key_here
OPENAI_ASSISTANT_ID=your_assistant_id_here

Start the development server:
Copynpm run dev

Open http://localhost:3000 in your browser to see the application.

Usage 🍲

Enter a recipe request in the input field (e.g., "high-protein vegetarian breakfast").
Click the "Set Sail!" button to generate a recipe.
View the generated recipe, including ingredients, instructions, and nutritional information.
Use the "Remove" button to adjust ingredients and regenerate the recipe if needed.
Copy the recipe to your clipboard using the "Copy Recipe" button.

Deployment 🌐
This project is set up for easy deployment on Vercel. Follow these steps:

Push your code to a GitHub repository.
Log in to your vercel account and click "New site from Git".
Choose your repository and configure the build settings:

Build command: npm run build
Publish directory: .next


Add your environment variables (OPENAI_API_KEY and OPENAI_ASSISTANT_ID) in the dashboard.
Deploy your site!

Contributing 🤝
Contributions are welcome! Please feel free to submit a Pull Request.

Fork the repository
Create your feature branch (git checkout -b feature/AmazingFeature)
Commit your changes (git commit -m 'Add some AmazingFeature')
Push to the branch (git push origin feature/AmazingFeature)
Open a Pull Request

License ⚖️
This project is licensed under the MIT License - see the LICENSE.md file for details.
Acknowledgments 👏

OpenAI for providing the AI capabilities
The Next.js team for their amazing framework
All the contributors who have helped shape ProteinPirate

Ahoy, me hearties! May your coding be as smooth as calm seas, and your recipes as hearty as a pirate's feast! 🏴‍☠️🍽️
