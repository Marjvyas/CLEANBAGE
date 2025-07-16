# 🌿 CleanBage - Smart Waste Management Platform

**CleanBage** is a comprehensive digital solution designed to revolutionize urban waste management through technology and community engagement. Built with modern web technologies, this platform connects citizens, waste collectors, and municipal authorities to create a more efficient, transparent, and sustainable waste management ecosystem.

## 📖 Project Description

CleanBage addresses the growing challenges of urban waste management by providing:

- **Smart Scheduling System** - Automated waste pickup scheduling based on location, waste type, and collection routes
- **Community Gamification** - Reward-based system that encourages proper waste segregation and environmental consciousness
- **Real-time Tracking** - Live updates on collection status, route optimization, and service requests
- **Data Analytics** - Comprehensive insights into waste generation patterns, collection efficiency, and environmental impact
- **Multi-role Interface** - Specialized dashboards for residents, waste collectors, and administrators

The platform aims to reduce environmental impact, improve collection efficiency, and foster community participation in sustainable waste management practices.

## ✨ Features

### 🏠 For Users
- **Schedule Waste Pickup** - Easy scheduling for residential waste collection with calendar integration
- **Track Rewards** - Earn points and rewards for proper waste disposal and segregation
- **Leaderboard System** - Community ranking based on environmental contributions and achievements
- **Profile Management** - Personal dashboard with waste management statistics and history
- **Request Support** - Submit requests for special waste collection services or report issues

### 🚛 For Collectors
- **Collector Dashboard** - Specialized interface for waste collection professionals
- **Route Management** - Efficient pickup scheduling and GPS-based route optimization
- **Collection Tracking** - Monitor pickup status, completion rates, and performance metrics
- **Waste Categorization** - Tools for proper waste sorting and documentation

### 🎮 Gamification Features
- **Points & Rewards System** - Earn coins for eco-friendly actions and consistent participation
- **Achievement Badges** - Unlock achievements for milestones and environmental contributions
- **Community Leaderboard** - Compete with neighbors for environmental impact rankings
- **Progress Tracking** - Visual progress indicators for personal and community goals

## 🛠️ Tech Stack

- **Frontend:** Next.js 14, React 18, TypeScript
- **Styling:** Tailwind CSS, Radix UI Components
- **Icons:** Lucide React
- **UI Components:** Custom component library with shadcn/ui
- **Forms:** React Hook Form with Zod validation
- **Animations:** Smooth transitions and interactive elements
- **Build Tool:** Webpack 5, Turbopack
- **Package Manager:** npm/yarn/pnpm

## 📋 Requirements

### System Requirements
- **Node.js:** Version 18.0 or higher
- **Package Manager:** npm 8+, yarn 1.22+, or pnpm 7+
- **Operating System:** Windows 10+, macOS 10.15+, or Linux
- **Memory:** Minimum 4GB RAM (8GB recommended)
- **Storage:** At least 1GB free space

### Development Requirements
- **Code Editor:** VS Code (recommended) with React/TypeScript extensions
- **Browser:** Chrome 90+, Firefox 88+, Safari 14+, or Edge 90+
- **Git:** Version 2.20 or higher for version control

### Optional Requirements
- **Docker:** For containerized development (optional)
- **ESLint/Prettier:** For code formatting and linting (included in project)

## � Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Marjvyas/CLEANBAGE.git
   cd cleanbage
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Install QR Code Scanner dependencies (Required for QR features)**
   ```bash
   npm install qr-scanner --legacy-peer-deps
   npm install qrcode --legacy-peer-deps
   npm install react-qr-scanner --legacy-peer-deps
   
   # or with yarn
   yarn add qr-scanner qrcode react-qr-scanner
   
   # or with pnpm
   pnpm add qr-scanner qrcode react-qr-scanner
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## ⚡ Quick Start Guide

For those who want to get the app running immediately, follow these simple commands:

### Using npm:
```bash
# 1. Clone the repository
git clone https://github.com/Marjvyas/CLEANBAGE.git

# 2. Navigate to project directory
cd cleanbage

# 3. Install dependencies
npm install --legacy-peer-deps

# 4. Install QR Code Scanner dependencies (Required)
npm install qr-scanner --legacy-peer-deps
npm install qrcode --legacy-peer-deps
npm install react-qr-scanner --legacy-peer-deps

# 5. Start the development server
npm run dev
```

### Using yarn:
```bash
# 1. Clone the repository
git clone https://github.com/Marjvyas/CLEANBAGE.git

# 2. Navigate to project directory
cd cleanbage

# 3. Install dependencies
yarn install

# 4. Install QR Code Scanner dependencies (Required)
yarn add qr-scanner qrcode react-qr-scanner

# 5. Start the development server
yarn dev
```

### Using pnpm:
```bash
# 1. Clone the repository
git clone https://github.com/Marjvyas/CLEANBAGE.git

# 2. Navigate to project directory
cd cleanbage

# 3. Install dependencies
pnpm install

# 4. Install QR Code Scanner dependencies (Required)
pnpm add qr-scanner qrcode react-qr-scanner

# 5. Start the development server
pnpm dev
```

### 🎉 That's it!
After running these commands, open your browser and go to [http://localhost:3000](http://localhost:3000) to see the CleanBage app running locally!

### 🛠️ Additional Commands

Once you have the app running, you can use these additional commands:

```bash
# Build for production
npm run build
# or
yarn build
# or
pnpm build

# Start production server
npm start
# or
yarn start
# or
pnpm start

# Run linting
npm run lint
# or
yarn lint
# or
pnpm lint
```

### 🚨 Troubleshooting

If you encounter any issues:

1. **Node.js version issues:**
   ```bash
   # Check your Node.js version
   node --version
   # Should be 18.0 or higher
   ```

2. **Dependencies issues:**
   ```bash
   # Clear node_modules and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Port already in use:**
   ```bash
   # Run on different port
   npm run dev -- -p 3001
   ```

## � Project File Structure

```
cleanbage/
├── 📁 app/                           # Next.js App Router directory
│   ├── 📄 globals.css               # Global styles and Tailwind imports
│   ├── 📄 layout.tsx                # Root layout component
│   ├── 📄 page.jsx                  # Home page component
│   └── 📁 login/                    # Authentication pages
│       └── 📄 page.jsx              # Login page
│
├── 📁 components/                    # Reusable UI components
│   ├── 📁 ui/                       # Base UI components (shadcn/ui)
│   │   ├── 📄 button.tsx            # Button component
│   │   ├── 📄 card.tsx              # Card component
│   │   ├── 📄 input.tsx             # Input component
│   │   ├── 📄 badge.tsx             # Badge component
│   │   ├── 📄 dialog.tsx            # Modal dialog component
│   │   └── 📄 ...                   # Other UI primitives
│   │
│   ├── 📁 pages/                    # Page-specific components
│   │   ├── 📄 LeaderboardPage.jsx   # Leaderboard interface
│   │   ├── 📄 ProfilePage.jsx       # User profile management
│   │   ├── 📄 RequestPage.jsx       # Service request interface
│   │   ├── 📄 RewardsPage.jsx       # Rewards and achievements
│   │   └── 📄 SchedulePage.jsx      # Waste pickup scheduling
│   │
│   ├── 📁 schedule-sections/        # Scheduling components
│   │   ├── 📄 CollectWaste.jsx      # Waste collection interface
│   │   ├── 📄 ReportDumping.jsx     # Report illegal dumping
│   │   └── 📄 SchedulePickup.jsx    # Schedule pickup form
│   │
│   ├── 📄 BottomNavigation.jsx      # Main navigation component
│   ├── 📄 Dashboard.jsx             # Main dashboard component
│   ├── 📄 VideoBackground.jsx       # Background video component
│   ├── 📄 QuickActions.jsx          # Quick action buttons
│   ├── 📄 AnimatedWaves.jsx         # Animation components
│   ├── 📄 FloatingElements.jsx      # Floating UI elements
│   └── 📄 login-form.tsx            # Login form component
│
├── 📁 hooks/                        # Custom React hooks
│   ├── 📄 use-mobile.tsx            # Mobile detection hook
│   └── 📄 use-toast.ts              # Toast notification hook
│
├── 📁 lib/                          # Utility functions and configurations
│   └── 📄 utils.ts                  # Common utility functions
│
├── 📁 public/                       # Static assets
│   ├── 📁 images/                   # Image assets
│   │   └── 📄 cleanbage-logo.png    # App logo
│   ├── 📄 background-video.mp4      # Background video
│   ├── 📄 bg.png                    # Background image
│   └── 📄 placeholder.svg           # Placeholder images
│
├── 📁 styles/                       # Additional stylesheets
│   └── 📄 globals.css               # Global CSS styles
│
├── 📄 components.json               # shadcn/ui configuration
├── 📄 next.config.mjs               # Next.js configuration
├── 📄 tailwind.config.ts            # Tailwind CSS configuration
├── 📄 postcss.config.mjs            # PostCSS configuration
├── 📄 tsconfig.json                 # TypeScript configuration
├── 📄 package.json                  # Project dependencies and scripts
├── 📄 pnpm-lock.yaml               # Lock file (if using pnpm)
└── 📄 README.md                     # Project documentation
```

## 🎯 Key Components

### Navigation System
- **Fixed Bottom Navigation** - Always accessible navigation for seamless user experience
- **Role-based Menus** - Different navigation options for users vs. collectors
- **Notification Center** - Quick access to important updates

### Dashboard Features
- **Statistics Overview** - Personal and community waste management metrics
- **Quick Actions** - One-tap access to common tasks
- **Progress Visualization** - Charts and progress bars for goal tracking

### Scheduling System
- **Pickup Scheduling** - Calendar-based waste collection scheduling
- **Waste Reporting** - Report illegal dumping or issues
- **Collection Management** - Track pickup status and history

## 🎨 Design Features

- **Modern UI/UX** - Clean, intuitive interface with smooth animations
- **Responsive Design** - Optimized for mobile, tablet, and desktop
- **Video Background** - Dynamic background with performance optimization
- **Glass Morphism** - Modern frosted glass effects throughout the app
- **Accessibility** - WCAG compliant with keyboard navigation support

## 🌟 Environmental Impact

CleanBage promotes environmental sustainability through:
- **Community Engagement** - Gamified approach to waste management
- **Proper Disposal** - Education and rewards for correct waste sorting
- **Reduced Waste** - Encouraging recycling and waste reduction
- **Efficient Collection** - Optimized routes reduce carbon footprint

## 🤝 Contributing

We welcome contributions to CleanBage! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**CLEANBAGE Team**

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [Radix UI](https://www.radix-ui.com/)
- Icons by [Lucide](https://lucide.dev/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)

---

**🌍 Together, let's make waste management smarter and our planet cleaner!**
