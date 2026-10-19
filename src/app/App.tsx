import * as React from 'react';
import { RouterProvider } from 'react-router';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'sonner';
import { router } from './routes';
import './../styles/theme.css';
/* Preview-only, and loaded last so its unlayered rules win over @layer
   utilities. Entirely inert unless <html data-theme="japandi"> is set. */
import './../styles/japandi.css';

function App() {
  return (
    <HelmetProvider>
      <RouterProvider router={router} />
      <Toaster position="top-center" richColors />
    </HelmetProvider>
  );
}

export default App;