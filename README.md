# PageLite 🚀

The simplest way to create a public status page. Create beautiful status pages in 30 seconds with no signup required.

![PageLite](https://img.shields.io/badge/Next.js-14-black?style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square)
![Tailwind](https://img.shields.io/badge/Tailwind-3-38B2AC?style=flat-square)

## Why PageLite?

Betterstack and Statuspage.io are overengineered. Small teams just want a simple, fast, good-looking status page. PageLite delivers exactly that.

## Features ✨

- 🚀 **30-second setup** - No signup required for free tier
- 🎨 **Beautiful design** - Clean, minimal interface
- 📊 **Component status tracking** - API, Website, Database, CDN, DNS, Service
- 📈 **90-day uptime visualization** - Visual uptime bars
- 🔔 **Incident management** - Report and track incidents with timeline
- 📧 **Email subscriptions** - Let users subscribe to updates
- 🔗 **Slug-based access** - Simple URLs like `/s/abc123`
- 🔐 **Edit token security** - No auth needed, just keep your token safe

## Pricing 💰

**Free Forever**
- 1 status page
- Up to 5 components
- Incident history
- Email subscriptions
- No credit card required

**Pro - $5/month**
- Unlimited status pages
- Unlimited components
- Custom domain
- Priority support

## Tech Stack 🛠

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Storage**: LocalStorage (MVP) - can be replaced with database

## Getting Started

### Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
```

### Build for Production

```bash
# Build the application
npm run build

# Start production server
npm start
```

## Usage

### Creating a Status Page

1. Visit the homepage
2. Enter your status page name
3. Click "Create Status Page"
4. You'll be redirected to the builder with your edit token

### Managing Components

1. In the builder, click "+ Add Component"
2. Enter component name, type, and optional description
3. Update status (Operational/Degraded/Down) as needed
4. Components update in real-time on the public page

### Reporting Incidents

1. Click "+ Report Incident" in the builder
2. Enter incident title and initial message
3. Incident appears on the public page immediately
4. Add updates as the incident progresses

### Sharing Your Status Page

Your public status page URL: `/s/[your-slug]`
Keep your edit token safe - it's the only way to edit your page!

## Project Structure

```
pagelite/
├── app/
│   ├── page.tsx              # Landing page
│   ├── builder/
│   │   └── page.tsx          # Builder interface
│   ├── s/
│   │   └── [slug]/
│   │       └── page.tsx      # Public status page
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles
├── lib/
│   ├── types.ts              # TypeScript definitions
│   └── storage.ts            # Data storage utilities
└── public/                   # Static assets
```

## Future Enhancements 🚀

- [ ] Backend API with PostgreSQL/MongoDB
- [ ] Real uptime monitoring
- [ ] Webhook notifications
- [ ] Slack/Discord integrations
- [ ] Custom domains (Pro)
- [ ] Analytics dashboard
- [ ] API for programmatic updates
- [ ] Multi-language support
- [ ] Dark mode

## Contributing

Contributions welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project however you'd like!

## Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Other Platforms

PageLite works on any platform that supports Next.js:
- Netlify
- Railway
- Render
- AWS Amplify

## Support

Having issues? [Open an issue](https://github.com/tahseen137/pagelite/issues) on GitHub!

---

Built with ❤️ for teams who just want a simple status page.
