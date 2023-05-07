import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import classNames from 'classnames';
import Paper from '@mui/material/Paper';

const DEBUG = false;

import styles from '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';

import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
} from '@chatscope/chat-ui-kit-react';
import { useChatApi } from '@src/api/use-chat-api';
import { ClientLogger } from '@src/client-logger';

console.log('styles', styles);

export const Home = () => {
  const navigate = useNavigate();
  const chatApi = useChatApi();

  useEffect(() => {
    const chats = chatApi.chats();
    DEBUG && ClientLogger.debug('chats', '', chats);
  }, []);

  return (
    <>
      <div style={{ position: 'relative', height: '500px' }}>
        <MainContainer>
          <ChatContainer>
            <MessageList>
              <Message
                model={{
                  message: 'Hello my friend',
                  sentTime: 'just now',
                  sender: 'Joe',
                }}
              />
            </MessageList>
            <MessageInput placeholder="Type message here" />
          </ChatContainer>
        </MainContainer>
      </div>
    </>
  );
};
