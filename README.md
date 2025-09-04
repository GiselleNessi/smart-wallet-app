# Smart Wallet App

A modern, sleek web application that provides seamless email-based authentication with automatic smart wallet creation. Built with React, TypeScript, and Tailwind CSS, this app offers a comprehensive wallet management experience.

## ✨ Features

### 🔐 Seamless Email Authentication
- **Simple Login**: Users can login using just their email address
- **No Wallet Setup Required**: Smart wallets are created automatically in the background
- **Secure Verification**: Email-based verification code system
- **Session Management**: Automatic token handling and storage

### 💼 Smart Wallet Management
- **Automatic Creation**: Smart wallets are created seamlessly during login
- **Wallet Information**: View wallet addresses, creation dates, and account details
- **Profile Management**: Connected profiles with verification status
- **Address Copying**: Easy wallet address copying functionality

### 👥 User Management
- **View All Users**: Browse all registered users with pagination
- **Search Users**: Find specific users by email, address, or ID
- **User Details**: Comprehensive user information display
- **Admin Controls**: Full user management capabilities

### 🎨 Modern UI/UX
- **Ultra-Dark Theme**: Sleek black and gray design
- **Glass-morphism Effects**: Beautiful backdrop blur and transparency
- **Responsive Design**: Works perfectly on all devices
- **Smooth Animations**: Polished interactions and transitions

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Thirdweb API credentials

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/GiselleNessi/smart-wallet-app.git
   cd smart-wallet-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   Update `.env.local` with your Thirdweb credentials:
   ```env
   REACT_APP_THIRDWEB_CLIENT_ID=your_client_id_here
   REACT_APP_THIRDWEB_SECRET_KEY=your_secret_key_here
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 🔧 Configuration

### Thirdweb API Setup

1. **Get API Credentials**
   - Visit [Thirdweb Dashboard](https://thirdweb.com/dashboard)
   - Create a new project
   - Copy your Client ID and Secret Key

2. **Configure Environment**
   - Add your credentials to `.env.local`
   - Restart the development server

### API Endpoints Used

- `POST /v1/auth/initiate` - Start email authentication
- `POST /v1/auth/complete` - Complete authentication with verification code
- `GET /v1/wallets/me` - Get authenticated user's wallet information
- `GET /v1/wallets/user` - Get user information (admin)

## 📱 User Experience

### Login Flow
1. **Enter Email**: User enters their email address
2. **Receive Code**: Verification code sent to email
3. **Enter Code**: User enters the verification code
4. **Smart Wallet Created**: Wallet is automatically created in the background
5. **Access Granted**: User gains access to the application

### Dashboard Features
- **Wallet Overview**: View wallet address and smart wallet details
- **Account Information**: Creation date, user type, and verification status
- **Connected Profiles**: Email profiles with verification badges
- **User Management**: Browse and search all users (admin feature)

## 🛠️ Technical Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom dark theme
- **API**: Thirdweb API integration
- **Build Tool**: Create React App
- **State Management**: React Hooks (useState, useEffect)
- **HTTP Client**: Fetch API with comprehensive error handling

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── AuthForm.tsx    # Email authentication form
│   ├── WalletInfo.tsx  # Wallet information display
│   └── UserManagement.tsx # User management interface
├── services/           # API services
│   └── thirdwebApi.ts  # Thirdweb API integration
├── types/              # TypeScript type definitions
│   └── thirdweb.ts     # API and component types
├── hooks/              # Custom React hooks
│   └── useLocalStorage.ts # Local storage management
├── utils/              # Utility functions
│   └── typeGuards.ts   # Runtime type validation
└── App.tsx             # Main application component
```

## 🎨 Design System

### Color Palette
- **Background**: Pure black (`#000000`) to ultra-dark gray (`#010409`)
- **Cards**: `black/80` with `black/60` for sections
- **Borders**: `dark-800/50` for subtle definition
- **Text**: White primary, `primary-500` for secondary
- **Accents**: `primary-600/700` for interactive elements

### Typography
- **Headings**: Bold, white text with drop shadows
- **Body**: Primary colors with proper contrast
- **Code**: Monospace font for addresses and technical data

## 🔒 Security Features

- **Token Management**: Secure JWT token handling
- **Session Persistence**: Automatic logout on refresh for security
- **Input Validation**: Comprehensive form validation
- **Error Handling**: Graceful error management with user feedback
- **API Security**: Proper header authentication

## 📊 Logging & Debugging

The application includes comprehensive logging for development and debugging:

- **API Calls**: All requests and responses logged
- **Authentication Flow**: Step-by-step login process tracking
- **Error Handling**: Detailed error information
- **User Actions**: Button clicks and form submissions

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel
```bash
npm install -g vercel
vercel --prod
```

### Deploy to Netlify
```bash
npm run build
# Upload build/ folder to Netlify
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Thirdweb](https://thirdweb.com) for the powerful API
- [React](https://reactjs.org) for the amazing framework
- [Tailwind CSS](https://tailwindcss.com) for the utility-first styling
- [TypeScript](https://www.typescriptlang.org) for type safety

## 📞 Support

If you have any questions or need help, please:
- Open an issue on GitHub
- Check the [Thirdweb Documentation](https://portal.thirdweb.com)
- Review the API logs in the browser console

---

**Built with ❤️ using Thirdweb API**