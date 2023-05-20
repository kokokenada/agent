import React, { useContext, useEffect, useState } from 'react';

const DEBUG = true;

// @ts-ignore
import styles from '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import withLayout from '@src/layout/withLayout';
import { Chat } from './chat/Chat';

if (styles) console.log('styles loaded'); // Trick vite into loading the CSS

const HomeInner = () => {
  return (
    <>
      <Chat />
    </>
  );
};

export const Home = withLayout(HomeInner);
