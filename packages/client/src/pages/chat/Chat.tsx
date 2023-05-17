import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import classNames from 'classnames';
import Paper from '@mui/material/Paper';

// @ts-ignore
import styles from '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  Sidebar,
  ConversationList,
  Conversation,
} from '@chatscope/chat-ui-kit-react';
import { useChatApi } from '@src/api/use-chat-api';
import { ClientLogger } from '@src/client-logger';
import withLayout from '@src/layout/withLayout';
import {
  ChatFragmentFragment,
  ChatMessageFragmentFragment,
} from '@src/api/types';
import { Button, Dialog, TextField } from '@mui/material';
import { NewChatDialog } from './NewChatDialog';

const DEBUG = true;

if (styles) console.log('styles loaded'); // Trick vite into loading the CSS

export const Chat = () => {
  const navigate = useNavigate();
  const chatApi = useChatApi();
  const [myChats, setMyChats] = useState<ChatFragmentFragment[]>([]);
  const [messages, setMessages] = useState<ChatMessageFragmentFragment[]>([]);
  const [addNewChatDialog, setAddNewChatDialog] = useState<boolean>(false);

  useEffect(() => {
    const chats = chatApi.myChats().then((chats) => {
      DEBUG && ClientLogger.debug('chats', '', chats);
      if (chats.data.myChats) {
        setMyChats(chats.data.myChats);
      }
    });
    DEBUG && ClientLogger.debug('chats', '', chats);
  }, []);

  const getMessages = async (chatId: string) => {
    const messages = await chatApi.messages(chatId);
    DEBUG && ClientLogger.debug('messages', '', messages);
    if (messages.data.messages) {
      setMessages(messages.data.messages);
    }
  };

  const onSend = async (
    innerHtml: string,
    textContent: string,
    innerText: string,
    nodes: NodeList,
  ) => {
    DEBUG &&
      ClientLogger.debug('send', '', {
        innerHtml,
        textContent,
        innerText,
        nodes,
      });
  };

  return (
    <>
      <div style={{ position: 'relative', height: '500px' }}>
        <MainContainer>
          <Sidebar position="left" scrollable={false}>
            <Button
              variant="contained"
              onClick={() => {
                setAddNewChatDialog(true);
              }}
            >
              New
            </Button>
            <ConversationList>
              {myChats.map((chat) => (
                <Conversation
                  key={chat.id}
                  name={chat.name}
                  lastSenderName="Lilly"
                  info="Yes i can do it for you"
                  onClick={() => {
                    getMessages(chat.id);
                  }}
                ></Conversation>
              ))}
            </ConversationList>
          </Sidebar>
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
            <MessageInput placeholder="Type message here" onSend={onSend} />
          </ChatContainer>
        </MainContainer>
      </div>
      <NewChatDialog
        open={addNewChatDialog}
        onClose={(chat) => {
          if (chat) {
            setMyChats([...myChats, chat]);
          }
          setAddNewChatDialog(false);
        }}
      />
    </>
  );
};
