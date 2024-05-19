import React from 'react';

import 'src/global.css';

import { useScrollToTop } from 'src/hooks/use-scroll-to-top';

import Router from 'src/routes/sections';
import ThemeProvider from 'src/theme';

import GlobalDataProvider from './contexts/globalData';
import CheckInternetAndDatabaseConnection from './components/others/checkInternetAndDatabaseConnection';
import { ToastContainer } from 'react-toastify';
import LoginTimer from './components/others/LoginTimer';

// ----------------------------------------------------------------------

export default function App() {
  useScrollToTop();

  return (
    <>
      <ToastContainer autoClose={1000} />
      <CheckInternetAndDatabaseConnection />
      <GlobalDataProvider>
        <LoginTimer />
        <ThemeProvider>
          <Router />
        </ThemeProvider>
      </GlobalDataProvider>
    </>
  );
}
