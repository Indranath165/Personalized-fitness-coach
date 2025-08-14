# 🏋️‍♂️ Personalized Fitness Coach

> An AI-powered fitness application that creates personalized workout plans, tracks progress, and provides comprehensive fitness coaching through intelligent recommendations.

## ✨ Features

### 🤖 AI-Powered Workouts
- **Intelligent Workout Generation**: Powered by Google Gemini AI
- **Personalized Plans**: Based on fitness goals, experience level, and available equipment
- **Specialized Workouts**: Yoga, HIIT, Basketball, Trail Running, Rehabilitation exercises
- **Video Demonstrations**: YouTube integration with exercise tutorials

### 📊 Progress Tracking
- **Workout History**: Complete tracking of all workout sessions
- **Progress Analytics**: Visual charts showing improvements over time
- **Performance Metrics**: Detailed statistics and progress indicators
- **Goal Achievement**: Track progress toward personal fitness objectives

### 🍎 Nutrition Management
- **Calorie Tracking**: Daily calorie intake monitoring
- **Macro Breakdown**: Protein, carbs, and fat tracking
- **Meal Planning**: Nutrition tips and meal suggestions
- **Progress Visualization**: Charts showing nutrition trends

### 🎨 User Experience
- **Dark/Light Mode**: Full theme support
- **Mobile Responsive**: Optimized for all devices
- **Intuitive Interface**: Clean, modern design
- **Real-time Updates**: Instant feedback and progress updates

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **AI**: Google Gemini API
- **Charts**: Chart.js with React integration
- **Icons**: Lucide React
- **Deployment**: Netlify

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account
- Google AI Studio account (for Gemini API)

### Installation

1. **Clone the repository**
   ```bash
   git clone git@github.com:Indranath165/Personalized-fitness-coach.git
   cd Personalized-fitness-coach
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your environment variables:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   GEMINI_API_KEY=your_gemini_api_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📖 Documentation

Detailed setup and deployment guides are available in the `/docs` folder:

- [**Deployment Guide**](./docs/DEPLOYMENT.md) - Complete deployment instructions
- [**Authentication Setup**](./docs/AUTHENTICATION_SETUP.md) - Configure authentication providers
- [**Firebase Setup**](./docs/FIREBASE_SETUP_GUIDE.md) - Firebase configuration (if needed)
- [**SMS Setup**](./docs/SMS_SETUP_GUIDE.md) - SMS authentication setup

## 🎯 Getting Started

1. **Sign Up**: Create your account using email or Google OAuth
2. **Complete Profile**: Set up your fitness goals and preferences
3. **Generate Workout**: Get your first AI-powered workout plan
4. **Track Progress**: Complete workouts and monitor your improvement
5. **Stay Motivated**: Use analytics to see your fitness journey

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Main dashboard
│   ├── profile/           # User profile management
│   ├── workout/           # Workout pages
│   ├── history/           # Progress history
│   ├── analytics/         # Progress analytics
│   ├── nutrition/         # Nutrition tracking
│   ├── specialized-workouts/ # Specialized workout types
│   └── api/              # API routes
├── components/            # Reusable components
├── lib/                  # Utilities and configurations
├── types/               # TypeScript definitions
└── utils/              # Helper functions
```

## 🚀 Deployment

### Netlify Deployment

1. **Connect Repository**: Link your GitHub repo to Netlify
2. **Set Environment Variables**: Configure all required environment variables
3. **Deploy**: Netlify will automatically build and deploy your app

For detailed deployment instructions, see [Deployment Guide](./docs/DEPLOYMENT.md).

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Google Gemini AI** for intelligent workout generation
- **Supabase** for backend infrastructure
- **Next.js** for the amazing framework
- **TailwindCSS** for styling capabilities
- **Chart.js** for beautiful progress visualizations

## 📞 Support

For support, email support@example.com or create an issue in this repository.

---

**Made with ❤️ by [Indranath165](https://github.com/Indranath165)**
- npm, yarn, pnpm, or bun package manager
- Supabase account and project
- Google AI Studio account for Gemini API access

## 🔧 Installation & Setup

### 1. Clone the Repository

```bash
git clone [your-repository-url]
cd personalized-fitness-coach
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the root directory and add your environment variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Google Gemini AI API Key (Server-side only)
GEMINI_API_KEY=your_gemini_api_key_here

# Next.js Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_here
```

### 4. Set Up Supabase Database

1. Create a new Supabase project at [supabase.io](https://supabase.io)
2. Run the SQL script from `database/schema.sql` in your Supabase SQL editor
3. Enable email authentication in Supabase Auth settings
4. (Optional) Configure Google OAuth in Supabase Auth providers

### 5. Get Google Gemini API Key

1. Visit [Google AI Studio](https://aistudio.google.com/)
2. Create a new API key
3. Add the API key to your `.env.local` file

### 6. Run the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application running.

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Main dashboard
│   ├── history/           # Workout history & progress
│   ├── login/             # Login page
│   ├── profile/           # Profile management
│   ├── signup/            # Registration page
│   └── workout/           # Workout tracking pages
├── components/            # Reusable React components
├── lib/                   # Utility libraries
│   ├── supabase/         # Supabase client configuration
│   └── utils.ts          # Helper functions
├── types/                 # TypeScript type definitions
└── middleware.ts          # Next.js middleware for auth
```

## 🔐 Authentication Flow

1. **Sign Up**: Users create accounts with email/password or Google OAuth
2. **Email Verification**: Supabase sends verification emails (if enabled)
3. **Profile Setup**: New users complete their fitness profile
4. **Protected Routes**: Middleware ensures authenticated access to app features
5. **Session Management**: Automatic session refresh and secure logout

## 🏃‍♂️ Workout Generation Process

1. **User Profile Analysis**: AI considers fitness goals, equipment, and experience
2. **History Analysis**: Previous workouts are analyzed to ensure variety and progression
3. **AI Prompt Generation**: Structured prompt sent to Google Gemini API
4. **Workout Creation**: AI generates 5-7 exercises with sets, reps, and rest periods
5. **Database Storage**: Workout plan saved to Supabase for tracking and history

## 📊 Progress Tracking Features

- **Workout Completion**: Mark exercises as complete with performance notes
- **Historical Data**: View all past workouts with completion status
- **Progress Charts**: Weekly and monthly workout frequency visualization
- **Statistics**: Total workouts, current streak, and average session duration
- **Goal Tracking**: Monitor progress toward fitness objectives

## 🚀 Deployment

### Netlify Deployment

1. **Connect Repository**: Link your GitHub repository to Netlify
2. **Build Settings**:
   - Build command: `npm run build`
   - Publish directory: `.next`
3. **Environment Variables**: Add all environment variables from `.env.local`
4. **Deploy**: Netlify will automatically build and deploy your application

### Environment Variables for Production

Ensure these environment variables are set in your production environment:

```env
NEXT_PUBLIC_SUPABASE_URL=your_production_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_supabase_anon_key
GEMINI_API_KEY=your_production_gemini_api_key
NEXTAUTH_URL=https://your-domain.netlify.app
NEXTAUTH_SECRET=your_production_secret
```

## 🔧 Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Type checking
npm run type-check
```

## 🎨 Customization

### Adding New Exercise Equipment

1. Update the `Equipment` type in `src/types/index.ts`
2. Add the new equipment option to `availableEquipment` array in profile setup
3. Update the equipment labels in `src/lib/utils.ts`

### Modifying AI Prompts

Edit the prompt generation logic in `src/app/api/generate-workout/route.ts` to customize how the AI generates workouts.

### Styling Customization

The application uses TailwindCSS. Modify styles by:
- Editing component classes directly
- Updating `tailwind.config.js` for global changes
- Adding custom CSS in component files

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the existing [Issues](https://github.com/your-username/fitgenie/issues)
2. Create a new issue with detailed information
3. Provide logs and error messages when possible

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [Supabase](https://supabase.io/) for backend-as-a-service
- [Google AI](https://ai.google.dev/) for Gemini AI capabilities
- [TailwindCSS](https://tailwindcss.com/) for utility-first CSS framework
- [Lucide](https://lucide.dev/) for beautiful icons

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
