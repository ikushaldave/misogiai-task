# ProjectShelf

A modern web application built with Next.js and Supabase, featuring a beautiful UI powered by Radix UI and Tailwind CSS.

## 🚀 Tech Stack

### Frontend

- **Framework**: [Next.js 15](https://nextjs.org/) - React framework for production
- **Language**: [TypeScript](https://www.typescriptlang.org/) - For type-safe code
- **Styling**:
  - [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
  - [Radix UI](https://www.radix-ui.com/) - Unstyled, accessible components
  - [Lucide React](https://lucide.dev/) - Beautiful icons
- **Form Handling**:
  - [React Hook Form](https://react-hook-form.com/)
  - [Formik](https://formik.org/)
  - [Zod](https://zod.dev/) - Schema validation

### Backend

- **Database & Authentication**: [Supabase](https://supabase.com/)
  - Authentication
  - Real-time database
  - Storage

### Development Tools

- **Package Manager**: Yarn
- **Linting**: ESLint
- **Code Formatting**: Prettier
- **Type Checking**: TypeScript

## 🛠️ Getting Started

1. **Clone the repository**

   ```bash
   git clone [repository-url]
   cd projectshelf
   ```

2. **Install dependencies**

   ```bash
   yarn install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory and add your Supabase credentials:

   ```
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. **Run the development server**

   ```bash
   yarn dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000) in your browser**

## 📦 Available Scripts

- `yarn dev` - Start development server
- `yarn build` - Build for production
- `yarn start` - Start production server
- `yarn lint` - Run ESLint

## 🏗️ Project Structure

```
├── app/              # Next.js app directory
├── components/       # Reusable UI components
├── hooks/           # Custom React hooks
├── lib/             # Utility functions and configurations
├── types/           # TypeScript type definitions
└── supabase/        # Supabase related configurations
```

## 🔒 Environment Variables

The following environment variables are required:

- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.
