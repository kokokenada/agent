import React, { useEffect } from 'react';
import {
  BrowserRouter,
  Navigate,
  Routes as Switch,
  Route,
  useLocation,
} from 'react-router-dom';
import { Home } from './pages/Home';

const ScrollToTop = () => {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return null;
};

const parseQueryString = (key: string): string | undefined => {
  const searchString = window.location.search;
  const query = searchString.substring(1);
  const vars = query.split('&');
  for (let i = 0; i < vars.length; i++) {
    const pair = vars[i].split('=');
    if (decodeURIComponent(pair[0]) === key) {
      return decodeURIComponent(pair[1]);
    }
  }
  return undefined;
};

const DEBUG = true;

export const Routes = () => {
  // const api = getApi();

  useEffect(() => {}, []);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Switch>
        <Route path="/" element={<Home />} />
        {/* <Route path="/404" element={<NotFound />} /> */}
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Switch>
    </BrowserRouter>
  );
};
