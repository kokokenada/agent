import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import classNames from 'classnames';
import Paper from '@mui/material/Paper';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { ClientLogger } from '@src/client-logger';
import { useChatApi } from '@src/api/use-chat-api';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import { ChatFragmentFragment } from '@src/api/types';

const DEBUG = true;

interface NewChatDialogProps {
  open: boolean;
  onClose: (newChat?: ChatFragmentFragment | undefined) => void;
}

export const NewChatDialog: React.FC<NewChatDialogProps> = ({
  open,
  onClose,
}) => {
  const { register, handleSubmit } = useForm();
  const chatApi = useChatApi();

  const createChat = async (
    name: string,
  ): Promise<ChatFragmentFragment | undefined> => {
    const chat = await chatApi.createChat(name);
    DEBUG && ClientLogger.debug('chat', '', chat);
    const createChat = chat.data?.createChat;
    if (createChat && createChat.chat) {
      return createChat.chat;
    } else {
      ClientLogger.error('chat', '', chat);
    }
  };

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    DEBUG && ClientLogger.debug('onSubmit', 'data', data);
    const newChat = await createChat(data.name);
    onClose(newChat);
  };

  return (
    <Dialog open={open} onClose={() => onClose()} maxWidth="md" fullWidth>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>Create New Chat</DialogTitle>
        <DialogContent>
          <TextField
            label="Chat Name"
            variant="outlined"
            fullWidth
            autoFocus
            {...register('name', { required: true })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => onClose()}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            Create
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
