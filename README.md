# Pokémon Explorer  

A **Next.js** web app that allows users to explore Pokémon details using data from the **PokeAPI**. It includes a homepage with a list of Pokémon and a search feature, as well as a detailed Pokémon info page.

---

##  **Live Demo**
🔗 [Pokemon Explorer Live](https://pokemon-app-five-ashen.vercel.app/) 

---

## 🛠️ **Tech Stack**
- **Next.js** (React Framework)  
- **TypeScript**  
- **TailwindCSS** (For Styling)  
- **PokeAPI** (Data Source)  

---

## 📌 **Features**
✅ View a list of Pokémon with images  
✅ Search Pokémon by name  
✅ Click on a Pokémon to see details (type, stats, abilities, moves)  
✅ Responsive UI with TailwindCSS  
✅ Next.js Dynamic Routing for Pokémon details  

---

## ⚡ **Getting Started (Run Locally)**
Follow these steps to set up the project on your local machine.

### **1️⃣ Clone the Repository**
```sh
git clone https://github.com/Akshay2217/Pokemon_App.git

### 2️⃣ Navigate to the Project Directory**
cd Pokemon_App

## **3️⃣ Install Dependencies**
npm install

##  **4️⃣ Create an Environment File**
Create a .env.local file in the root directory and add:
NEXT_PUBLIC_POKEMON_API_BASE=https://pokeapi.co/api/v2/

##  **5️⃣ Start the Development Server**
npm run dev

The app should now be running at http://localhost:3000.

## Folder structure
Pokemon_App/
│-- src/
│   ├── app/
│   │   ├── page.tsx         # Homepage (List of Pokémon)
│   │   ├── pokemon/[id]/page.tsx  # Dynamic Route for Pokémon Details
│   ├── components/          # Reusable UI Components
│-- public/                  # Static assets (icons, images)
│-- styles/                  # TailwindCSS styles
│-- .env.local               # Environment variables
│-- package.json             # Dependencies & scripts
│-- README.md                # Project documentation


##📩 Contact & Support
If you have any questions or suggestions, feel free to reach out!

 GitHub: @Akshay2217

