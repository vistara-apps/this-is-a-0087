# XStore Weaver

**Weave your X influence into shoppable storefronts instantly.**

XStore Weaver automatically generates shoppable storefronts for X (Twitter) users by analyzing their most-liked posts and comments, then extracting and listing sellable items or services using AI.

## 🚀 Features

### Core Features
- **AI-Powered Product Discovery & Listing**: Scans your top X posts to identify potential products or services using OpenAI
- **One-Click Storefront Deployment**: Generates fully functional, mobile-responsive storefronts linked to your X persona
- **Integrated Payment Processing**: Seamless payments via Stripe (fiat) and Turnkey (crypto on Base)
- **Performance Analytics Dashboard**: Track traffic, sales, revenue, and top-performing X content

### Technical Features
- **Real X API Integration**: Fetch user tweets, likes, and engagement metrics
- **AI Content Analysis**: OpenAI-powered product identification and description generation
- **Dual Payment Support**: Stripe for traditional payments, Turnkey for USDC on Base
- **IPFS Storage**: Decentralized storage for storefront assets via Pinata
- **Supabase Backend**: Complete database with Row Level Security
- **Responsive Design**: Mobile-first design with Tailwind CSS

## 🛠 Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS
- **Backend**: Supabase (PostgreSQL)
- **Payments**: Stripe, Turnkey (Base/USDC)
- **AI**: OpenAI GPT-4, DALL-E 3
- **Storage**: Pinata (IPFS)
- **Social**: X (Twitter) API v2
- **Analytics**: Recharts

## 📋 Prerequisites

Before setting up XStore Weaver, you'll need accounts and API keys for:

1. **X (Twitter) Developer Account**
   - API Key and Secret
   - Bearer Token
   - OAuth 2.0 setup

2. **OpenAI Account**
   - API Key with GPT-4 access

3. **Stripe Account**
   - Publishable and Secret Keys
   - Webhook endpoint configured

4. **Turnkey Account**
   - API Key
   - Organization ID

5. **Supabase Project**
   - Project URL
   - Anon Key

6. **Pinata Account**
   - API Key
   - Secret Key

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/vistara-apps/this-is-a-0087.git
cd this-is-a-0087
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Copy the example environment file and fill in your API keys:

```bash
cp .env.example .env
```

Edit `.env` with your API keys:

```env
# X API Configuration
VITE_X_API_KEY=your_x_api_key_here
VITE_X_API_SECRET=your_x_api_secret_here
VITE_X_BEARER_TOKEN=your_x_bearer_token_here

# OpenAI Configuration
VITE_OPENAI_API_KEY=your_openai_api_key_here

# Stripe Configuration
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key_here
STRIPE_SECRET_KEY=your_stripe_secret_key_here

# Turnkey Configuration
VITE_TURNKEY_API_KEY=your_turnkey_api_key_here
VITE_TURNKEY_ORGANIZATION_ID=your_turnkey_org_id_here

# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Pinata Configuration
VITE_PINATA_API_KEY=your_pinata_api_key_here
VITE_PINATA_SECRET_KEY=your_pinata_secret_key_here

# Base Chain Configuration
VITE_BASE_RPC_URL=https://mainnet.base.org
VITE_BASE_CHAIN_ID=8453

# Application Configuration
VITE_APP_URL=http://localhost:5173
VITE_API_BASE_URL=http://localhost:3001
```

### 4. Database Setup

1. Create a new Supabase project
2. Run the database schema from `database/schema.sql` in your Supabase SQL editor
3. Enable Row Level Security (RLS) policies as defined in the schema

### 5. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 🏗 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── AnalyticsChart.jsx
│   ├── Header.jsx
│   ├── ProductCard.jsx
│   └── StorefrontGenerator.jsx
├── contexts/           # React contexts
│   ├── AuthContext.jsx
│   └── PaymentContext.jsx
├── pages/              # Page components
│   ├── Dashboard.jsx
│   ├── Landing.jsx
│   └── Storefront.jsx
├── services/           # API service layers
│   ├── api.js
│   ├── openaiService.js
│   ├── pinataService.js
│   ├── stripeService.js
│   ├── supabaseService.js
│   ├── turnkeyService.js
│   └── xApi.js
├── App.jsx
├── main.jsx
└── index.css

database/
└── schema.sql          # Complete database schema

.env.example            # Environment variables template
```

## 🔧 Configuration

### X API Setup

1. Create a Twitter Developer account
2. Create a new app with OAuth 2.0 enabled
3. Set redirect URI to `http://localhost:5173/auth/callback`
4. Copy API keys to your `.env` file

### Stripe Setup

1. Create a Stripe account
2. Get your publishable and secret keys
3. Set up webhooks for payment events
4. Configure your webhook endpoint

### Turnkey Setup

1. Create a Turnkey account
2. Set up your organization
3. Configure Base network support
4. Get your API credentials

### Supabase Setup

1. Create a new Supabase project
2. Run the provided SQL schema
3. Configure authentication settings
4. Set up Row Level Security policies

## 🚀 Deployment

### Frontend Deployment (Vercel/Netlify)

1. Build the project:
```bash
npm run build
```

2. Deploy the `dist` folder to your hosting provider

3. Set environment variables in your hosting dashboard

### Backend Requirements

The application requires a backend API for:
- X OAuth token exchange
- Stripe webhook handling
- Turnkey transaction signing
- File uploads to Pinata

Refer to the service files for the expected API endpoints.

## 📊 Database Schema

The application uses the following main tables:

- **users**: User profiles and authentication data
- **storefronts**: Generated storefronts
- **products**: Products extracted from X posts
- **sales**: Transaction records
- **analytics_visits**: Storefront visit tracking
- **x_posts_analysis**: Cached AI analysis of X posts

See `database/schema.sql` for the complete schema with indexes and RLS policies.

## 🔐 Security Features

- Row Level Security (RLS) on all tables
- OAuth 2.0 authentication with X
- Secure API key management
- CORS protection
- Input validation and sanitization

## 🎨 Design System

The application uses a consistent design system with:

- **Colors**: Primary, accent, surface, and text colors
- **Typography**: Display, heading, body, and caption styles
- **Spacing**: Consistent spacing scale (sm, md, lg, xl)
- **Shadows**: Card and modal shadows
- **Border Radius**: Consistent border radius scale

## 📈 Analytics

Track key metrics including:
- Storefront visits and traffic sources
- Product views and conversion rates
- Revenue and sales analytics
- Top-performing X posts driving sales

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in this repository
- Check the documentation
- Review the example environment configuration

## 🚀 Roadmap

- [ ] Advanced analytics dashboard
- [ ] Multi-chain crypto support
- [ ] Custom storefront themes
- [ ] Bulk product import
- [ ] API for third-party integrations
- [ ] Mobile app
- [ ] Advanced AI product recommendations

---

**Built with ❤️ for creators who want to monetize their social influence.**
