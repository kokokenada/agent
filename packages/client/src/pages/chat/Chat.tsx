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
import { useForm } from 'react-hook-form';

const DEBUG = true;

if (styles) console.log('styles loaded'); // Trick vite into loading the CSS

enum ChatNotificationEnum {
  COMPLETE_RESPONSE = 1,
  PARTIAL_RESPONSE = 2,
  ERROR = 3,
  INFO = 4,
}

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
  const {
    register,
    getValues,
    formState: { errors },
  } = useForm();

  const calcUrl = (chatId: string): string => {
    return VITE_SERVER_API_URL.replace('graphql', `ws/chat/${chatId}/`).replace(
      'http',
      'ws',
    );
  };

  // Respond to server push response
  useEffect(() => {
    if (lastMessage !== null) {
      DEBUG && ClientLogger.debug('lastMessage', '', lastMessage);
      try {
        const parsedMessage = JSON.parse(lastMessage.data);
        const notifcationType: ChatNotificationEnum =
          parsedMessage?.message?.type;
        const messageId = parsedMessage?.message?.message_id;
        const content = parsedMessage?.message?.message;
        const messageIndex = messages.findIndex(
          (message) => message.id === messageId,
        );
        DEBUG &&
          ClientLogger.debug('lastMessage', 'parsed', {
            parsedMessage,
            notifcationType,
            messageIndex,
            content,
            messageId,
            messages,
          });
        switch (notifcationType) {
          case ChatNotificationEnum.COMPLETE_RESPONSE:
            // add the message if not already there
            if (messageIndex === -1) {
              setMessages([
                ...messages,
                {
                  id: messageId,
                  content,
                  senderUser: {
                    id: 'bot',
                    isAI: true,
                    name: 'Bot',
                  },
                },
              ]);
            } else {
              // otherwise update it
              const newMessages = [...messages];
              newMessages[messageIndex] = {
                ...newMessages[messageIndex],
                content,
              };
            }
            break;
          case ChatNotificationEnum.PARTIAL_RESPONSE:
            // find the message and update it
            if (messageIndex !== -1) {
              const newMessages = [...messages];
              newMessages[messageIndex] = {
                ...newMessages[messageIndex],
                // append the new content
                content: `${newMessages[messageIndex].content}${content}`,
              };
              setMessages(newMessages);
            } else {
              // add new message
              setMessages([
                ...messages,
                {
                  id: messageId,
                  content,
                  senderUser: {
                    id: 'bot',
                    isAI: true,
                    name: 'Bot',
                  },
                },
              ]);
            }
            break;
          case ChatNotificationEnum.ERROR:
            ClientLogger.error('lastMessage', 'error', content);
            break;
          case ChatNotificationEnum.INFO:
            break;
          default:
            break;
        }
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
    const answerAs = getValues('answerAs');
    DEBUG &&
      ClientLogger.debug('send', '', {
        innerHtml,
        textContent,
        innerText,
        nodes,
        answerAs,
        connectionStatus,
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
      answerAs,
    );
  };

  DEBUG &&
    ClientLogger.debug('Chats', 'render', {
      myChats,
      messages,
      chatId,
    });

  return (
    <>
      <TextField
        id="outlined-basic"
        label="Answer As"
        variant="outlined"
        size="small"
        sx={{ marginTop: '8px' }}
        {...register('answerAs')}
      />
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
                  lastSenderName={chat.lastMessage?.senderUser?.name || ''}
                  info={chat.lastMessage?.content.substring(0, 25) || ''}
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
      {DEBUG && (
        <div>
          <span>The WebSocket is currently {connectionStatus}</span>
          {lastMessage ? <span>Last message: {lastMessage.data}</span> : null}
        </div>
      )}
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
