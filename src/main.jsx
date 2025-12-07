import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import './index.css'
import App from './App.jsx'

// Get Clerk publishable key from environment
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

// If no key is provided, app will still work but without auth features
const clerkEnabled = !!PUBLISHABLE_KEY

const AppWithAuth = () => {
  if (clerkEnabled) {
    return (
      <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
        <App />
      </ClerkProvider>
    )
  }
  // Fallback without Clerk when no key is set
  return <App />
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppWithAuth />
  </StrictMode>,
)
