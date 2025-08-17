# BEAM Law & Justice League

A modern, responsive landing page for BEAM Law & Justice League, built with Next.js and Tailwind CSS. This platform provides legal aid information, donation capabilities, and community support services.

## Features

- **Hero Section**: Compelling justice and law imagery with clear call-to-action
- **City Selector**: Find local legal aid chapters across major US cities
- **Service Cards**: Detailed information about Legal Aid, IP Support, and Governance Reform services
- **Donation Form**: Integrated donation system (Stripe integration ready)
- **Contact Form**: Community legal help request system
- **Responsive Design**: Mobile-first approach with modern UI/UX

## Tech Stack

- **Frontend**: Next.js 14 with App Router
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **TypeScript**: Full type safety
- **Backend Ready**: Supabase integration prepared
- **Payment Ready**: Stripe integration prepared

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd law.beamthinktank.space
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with metadata
│   ├── page.tsx            # Main landing page
│   └── globals.css         # Global styles
├── components/              # Reusable components (to be added)
└── lib/                    # Utility functions (to be added)
```

## Deployment

### Vercel (Recommended)

This project is optimized for Vercel deployment:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Vercel will automatically detect Next.js and deploy
4. Environment variables can be configured in Vercel dashboard

### Manual Deployment

1. Build the project:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```

## Environment Variables

The following environment variables will be needed for full functionality:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
```

## Future Enhancements

- [ ] Supabase integration for case tracking
- [ ] Stripe payment processing
- [ ] User authentication system
- [ ] Admin dashboard for volunteers
- [ ] Case management system
- [ ] Email notification system

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For questions or support, please contact the BEAM Law & Justice League team.

---

Built with ❤️ for justice and equality
