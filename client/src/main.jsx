import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AppContextProvider } from './context/AppContext.jsx'
import {BrowserRouter} from 'react-router-dom'
import {ClerkProvider} from '@clerk/clerk-react'

// Import your Publishable Key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key')
}

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <ClerkProvider publishableKey ={PUBLISHABLE_KEY} afterSignOutUrl='/'>
  <AppContextProvider>
    <App />
  </AppContextProvider>
  </ClerkProvider>
  </BrowserRouter>,
)

/*

Wrap your app with BrowserRouter to use features like <Route>, <Link>, and useNavigate.

Example Scenario: 
If your app has multiple pages like /home, /about, or /profile, 
BrowserRouter makes switching between them smooth without reloading the page.

*/
