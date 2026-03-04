import * as React from 'react';
import { RouterProvider } from 'react-router';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'sonner';
import { router } from './routes';
import './../styles/theme.css';

function App() {
  return (
    <HelmetProvider>
      <RouterProvider router={router} />
      <Toaster position="top-center" richColors />
    </HelmetProvider>
  );
}

export default App;