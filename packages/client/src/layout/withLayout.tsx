import React from 'react';
import { Header } from './Header';

const withLayout = (WrappedComponent: React.ComponentType) => {
  return () => (
    <>
      <Header />
      <WrappedComponent />
    </>
  );
};

export default withLayout;
