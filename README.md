# Customer Feedback System

A modern, real-time customer feedback collection and analytics platform built with Next.js 14 and Prisma.

## 🌟 Features

- **Multi-language Support**: Built-in support for Myanmar and English languages
- **Real-time Feedback Collection**: Instant feedback submission with animated UI
- **Interactive Dashboard**:
  - Feedback analytics and trends
  - Average ratings visualization
  - Recent feedback monitoring
  - Customizable reports
- **Admin Features**:
  - User management
  - Service center management
  - System settings configuration
- **Secure Authentication**: NextAuth.js integration with Prisma adapter
- **Responsive Design**: Works seamlessly on all devices

## 🚀 Tech Stack

- **Frontend**:
  - Next.js 14 (React)
  - TypeScript
  - Tailwind CSS
  - Radix UI Components
  - Tremor (Data Visualization)
  - Framer Motion (Animations)

- **Backend**:
  - Next.js API Routes
  - Prisma ORM
  - PostgreSQL Database
  - NextAuth.js (Authentication)

## 📸 Screenshots

![Feedback System Mockup](public/screenshots/Mockup1.png)

More screenshots will be added showcasing:
- User feedback interface
- Admin dashboard
- Analytics views
- Report generation

## 🛠️ Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/feedback-system.git
cd feedback-system
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your database and authentication settings
```

4. Set up the database:
```bash
npx prisma migrate deploy
npm run seed # Optional: seed initial data
```

5. Run the development server:
```bash
npm run dev
```

## 🌐 Deployment

The application is designed to be deployed on platforms like Vercel:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Configure environment variables
4. Deploy!

## 📝 License

MIT License - feel free to use this project for your own purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## ✨ Acknowledgments

- Built with modern web technologies
- Designed for real-world use cases
- Focused on user experience and performance
