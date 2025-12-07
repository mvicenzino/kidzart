---
description: How to fix and maintain the Kidzart application
---

# Kidzart App Maintenance Workflow

## Quick Start
// turbo-all
1. Navigate to project: `cd /Users/michaelvicenzino/.gemini/antigravity/scratch/kidzart`
2. Start dev server: `npm run dev -- --port 3000`
3. Open browser to http://localhost:3000

## Common Issues and Fixes

### Build/Runtime Errors
1. Check the terminal for error messages
2. Run `npm run build` to see compilation errors
3. Fix any import issues or syntax errors
4. Vite will hot-reload automatically

### Clerk Authentication Issues
1. Verify `.env.local` has `VITE_CLERK_PUBLISHABLE_KEY=pk_test_...`
2. Restart server after changing env vars
3. Check browser console for Clerk errors
4. Clerk docs: https://clerk.com/docs/quickstarts/react

### Supabase Database Issues
1. Verify `.env.local` has both `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
2. Run `database/schema.sql` in Supabase SQL Editor if tables missing
3. Check Row Level Security (RLS) policies
4. Supabase docs: https://supabase.com/docs

### Styling Issues
1. Global styles are in `src/index.css`
2. CSS variables defined in `:root`
3. Component styles are inline in JSX

### Adding New Features
1. Create component in `src/components/`
2. Add any new data to `src/data/mockData.js`
3. Import and use in `src/App.jsx`
4. Taxonomy categories are in `mockData.js` taxonomy object

## Project Structure
```
src/
├── components/     # React components (Navbar, ArtCard, ArtModal, FilterBar)
├── data/          # Mock data and taxonomy
├── lib/           # Database client (Supabase)
├── hooks/         # Custom React hooks
├── App.jsx        # Main app component
├── main.jsx       # Entry point with Clerk
└── index.css      # Global styles
```

## Key Files
- **App.jsx**: Main layout, gallery, highlights section
- **Navbar.jsx**: Navigation with Clerk auth
- **ArtCard.jsx**: Individual artwork cards
- **ArtModal.jsx**: Expanded art view with donate/print/download
- **FilterBar.jsx**: Gallery filtering by age, medium, theme
- **mockData.js**: Artwork data and taxonomy definitions
- **database.js**: Supabase client and services

## Testing Changes
1. Make changes to code
2. Vite auto-reloads
3. Check browser for visual changes
4. Check console for errors
5. Test on mobile viewport (resize browser)

## Deployment
1. Run `npm run build`
2. Deploy `dist/` folder to Vercel/Netlify
3. Set environment variables in hosting platform
