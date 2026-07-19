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
# Firebase (copy .env.example to .env.local)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=beam-law-platform.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=beam-law-platform
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=beam-law-platform.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

Enable Email/Password authentication and Firestore in the Firebase console. Give authorized users a boolean `beam_admin` or `partner_admin` custom claim, then deploy rules, indexes, and the participant write-through trigger:

```bash
npm install -g firebase-tools
firebase login
firebase use beam-law-platform
npm --prefix functions install
npm --prefix functions run build
firebase deploy --only firestore,functions
```

After the first admin login, open **Practice Areas** and choose **Save & initialize** to create the fixed track and chapter records.

The full collection contract is documented in `docs/DATA_MODEL.md`.

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
