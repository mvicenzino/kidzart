
## Quick Start

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure Clerk Authentication**
   - Create a Clerk account at [clerk.com](https://clerk.com)
   - Create a new application
   - Copy your Publishable Key
   - Create `.env.local` and add:
     ```
     VITE_CLERK_PUBLISHABLE_KEY=pk_test_YOUR_KEY_HERE
     ```

3. **Configure Supabase Database** (optional)
   - Create a Supabase project at [supabase.com](https://supabase.com)
   - Run `database/schema.sql` in the SQL Editor
   - Add credentials to `.env.local`:
     ```
     VITE_SUPABASE_URL=your_project_url
     VITE_SUPABASE_ANON_KEY=your_anon_key
     ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   Navigate to [http://localhost:5173](http://localhost:5173)

## Tech Stack

- **Frontend**: React + Vite
- **Styling**: Vanilla CSS with CSS Variables
- **Icons**: Lucide React
- **Authentication**: Clerk
- **Database**: PostgreSQL (Supabase)
- **Storage**: Supabase Storage

## Project Structure

```
kidzart/
├── src/
│   ├── components/       # React components
│   │   ├── Navbar.jsx
│   │   ├── ArtCard.jsx
│   │   ├── ArtModal.jsx
│   │   └── FilterBar.jsx
│   ├── data/
│   │   └── mockData.js   # Sample artwork data
│   ├── lib/
│   │   └── database.js   # Supabase client
│   ├── App.jsx           # Main app component
│   ├── main.jsx          # Entry point with Clerk
│   └── index.css         # Global styles
├── database/
│   └── schema.sql        # PostgreSQL schema
├── public/
│   └── artwork/          # Local artwork images
└── .env.example          # Environment template
```

## Art Taxonomy

**Age Groups**: Toddler (2-3), Preschool (4-5), Early Elementary (6-7), Elementary (8-9), Tween (10-12)

**Mediums**: Crayon, Markers, Watercolor, Colored Pencils, Digital, Mixed Media, Finger Paint

**Themes**: Animals, Nature, Family, Fantasy, Space, Vehicles, Abstract, Food, Ocean, Buildings

## Part of Kindora Family, Inc.

© 2024 Kidzart. Made with 💜 for little artists everywhere.
