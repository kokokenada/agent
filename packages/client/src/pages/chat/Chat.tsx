import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import classNames from 'classnames';
import Paper from '@mui/material/Paper';
import { v4 as uuidv4 } from 'uuid';
import useWebSocket, { ReadyState } from 'react-use-websocket';

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
import { getEnvVar } from '@src/api/utils';

const DEBUG = true;

if (styles) console.log('styles loaded'); // Trick vite into loading the CSS

export const Chat = () => {
  const navigate = useNavigate();
  const chatApi = useChatApi();
  const [myChats, setMyChats] = useState<ChatFragmentFragment[]>([]);
  const [chatId, setChatId] = useState<string | undefined>(undefined);
  const [messages, setMessages] = useState<ChatMessageFragmentFragment[]>([]);
  const [addNewChatDialog, setAddNewChatDialog] = useState<boolean>(false);
  const VITE_SERVER_API_URL = getEnvVar('VITE_API_URL');
  const [socketUrl, setSocketUrl] = useState(
    VITE_SERVER_API_URL.replace('graphql', `ws/chat/${chatId}`).replace(
      'http',
      'ws',
    ),
  ); // test: ws://echo.websocket.events
  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl);

  const calcUrl = (chatId: string): string => {
    return VITE_SERVER_API_URL.replace('graphql', `ws/chat/${chatId}/`).replace(
      'http',
      'ws',
    );
  };

  const getLastMessage = () => {
    return messages[messages.length - 1];
  };

  useEffect(() => {
    if (lastMessage !== null) {
      DEBUG && ClientLogger.debug('lastMessage', '', lastMessage);
      try {
        const parsedMessage = JSON.parse(lastMessage.data);
        setMessages([
          ...messages,
          {
            id: 'msgId',
            content: parsedMessage?.message.message,
            senderUser: {
              id: parsedMessage?.message.chat_id,
              isAI: true,
              name: 'Bot',
            },
          },
        ]);
      } catch (e) {
        ClientLogger.error('lastMessage', 'parse failed', e);
      }
    }
  }, [lastMessage]);

  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Open',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }[readyState];
  DEBUG &&
    ClientLogger.debug('connectionStatus', '', {
      VITE_SERVER_API_URL,
      connectionStatus,
      readyState,
      lastMessage,
      socketUrl,
    });

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
    const chatMessages = await chatApi.chatMessages(chatId);
    DEBUG && ClientLogger.debug('getMessages', '', { chatMessages, chatId });
    if (chatMessages.data.chatMessages) {
      const list: ChatMessageFragmentFragment[] = [];
      for (const edge of chatMessages.data.chatMessages.edges) {
        if (edge?.node) {
          list.push(edge.node);
        }
      }
      setMessages(list);
    }
    setChatId(chatId);
    setSocketUrl(calcUrl(chatId));
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
    if (!chatId) {
      ClientLogger.error('send', 'chatId is undefined');
      return;
    }
    const msgId = uuidv4();
    setMessages([
      ...messages,
      {
        id: msgId,
        content: innerText,
        senderUser: { id: 'me', isAI: false, name: 'me' },
      },
    ]);

    const newMessge = chatApi.createChatMessage(
      // Don't await
      msgId,
      chatId,
      innerText,
    );
  };

  const lastMessageObject = getLastMessage();

  DEBUG &&
    ClientLogger.debug('Chats', 'render', {
      myChats,
      messages,
      chatId,
      lastMessageObject,
    });

  return (
    <>
      {DEBUG && (
        <div>
          {/* <button
          onClick={handleClickSendMessage}
          disabled={readyState !== ReadyState.OPEN}
        >
          Click Me to send 'Hello'
        </button> */}
          <span>The WebSocket is currently {connectionStatus}</span>
          {lastMessage ? <span>Last message: {lastMessage.data}</span> : null}
        </div>
      )}
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
                  lastSenderName={lastMessageObject?.senderUser?.name || ''}
                  info={lastMessageObject?.content.substring(0, 25) || ''}
                  onClick={() => {
                    getMessages(chat.id);
                  }}
                  active={chatId === chat.id}
                ></Conversation>
              ))}
            </ConversationList>
          </Sidebar>
          <ChatContainer>
            <MessageList>
              {messages.map((message) => (
                <Message
                  key={message.id}
                  model={{
                    message: message.content,
                    direction: message?.senderUser?.isAI
                      ? 'incoming'
                      : 'outgoing',
                  }}
                />
              ))}
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
