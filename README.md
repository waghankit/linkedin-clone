# LinkedIn Clone 🧑‍💼

A full-stack LinkedIn clone built with modern technologies to replicate core LinkedIn functionalities including user authentication, posting, commenting, liking, and profile management.

🚀 **Live Demo:** [linkedin-clone-red-one.vercel.app](https://linkedin-clone-red-one.vercel.app/)

## 🔧 Tech Stack

- **Frontend:** Next.js 14 (App Router), TypeScript, Tailwind CSS, Shadcn/ui
- **Backend:** Node.js, Next.js API Routes
- **Database:** PostgreSQL (hosted on Supabase)
- **ORM:** Prisma
- **Authentication:** NextAuth.js (Credentials Provider)
- **Hosting:** Vercel
- **Dev Tools:** ESLint, Prettier, ChatGPT, Claude, Cursor

## ✨ Features

- 🔐 Secure login and registration with hashed passwords
- 🏠 Dashboard to create, view, edit, and delete posts
- 💬 Commenting and Like functionality per post
- 👤 Profile page displaying user details and posts
- 📱 Responsive design with modern UI/UX
- ☁️ Deployed and production-ready

## 🛠️ Getting Started

### 1. Clone the repository
git clone https://github.com/yourusername/linkedin-clone.git
cd linkedin-clone

2. Install dependencies
npm install

3. Set up environment variables
Create a .env file based on .env.example:

DATABASE_URL=postgresql://<username>:<password>@<host>:5432/<db>
NEXTAUTH_SECRET=your-random-secret
NEXTAUTH_URL=http://localhost:3000

4. Migrate database
npx prisma migrate dev --name init

6. Run the app
npm run dev


🚀 Deployment
The app is deployed on Vercel. Ensure to set DATABASE_URL, NEXTAUTH_SECRET, and NEXTAUTH_URL in your Vercel dashboard environment variables.

📁 Folder Structure
src/app: App Router pages

src/components: Reusable UI components

src/lib/prisma.ts: Prisma Client instance

prisma/schema.prisma: Prisma schema



📸 Screenshots
![Screenshot 2025-06-19 at 4 41 24 PM](https://github.com/user-attachments/assets/e0ea1701-8572-49d5-9c00-230cf9749d22)

![Screenshot 2025-06-19 at 4 41 14 PM](https://github.com/user-attachments/assets/48553ed3-0331-4205-9f9e-36d750f32d8b)

![Screenshot 2025-06-19 at 4 41 04 PM](https://github.com/user-attachments/assets/b92975b7-0817-4b46-a5f5-e9b05ec04950)


🙌 Contributing
Feel free to fork and contribute. Pull requests are welcome!
