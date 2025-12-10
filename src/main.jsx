import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import './styles/animations.css'
import App from './App.jsx'

// Get Clerk publishable key from environment
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

// If no key is provided, app will still work but without auth features
const clerkEnabled = !!PUBLISHABLE_KEY

const AppWithAuth = () => {
  if (clerkEnabled) {
    return (
      <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ClerkProvider>
    )
  }
  // Fallback without Clerk when no key is set
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  )
}

// Global Error Handlers for debugging in Production
window.addEventListener('error', (event) => {
  console.error('Global Error caught:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  // Prevent crash from non-critical promise failures (like 3rd party scripts)
  console.warn('Unhandled Promise Rejection:', event.reason);
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppWithAuth />
  </StrictMode>,
)
