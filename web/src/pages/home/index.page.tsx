import React, { MouseEvent, useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';
import { Modal, Input, notification } from 'antd';

import { clearTimeout } from 'timers';
import { Container } from './styles';
import { CursorModeType } from '../../interfaces/Cursor/CursorModeType';
import {
  ICursorPosition,
  ICursorPositionInfo,
} from '../../interfaces/Cursor/ICursorPosition';
import { cursorElement } from '../../utils/cursorElement';

const welcomeMessages = [
  'Boa pra noiz! Informe seu vulgo abaixo...',
  'Salve salve! Por qual username você atende?',
  'Aoba, beleza jovem? Como posso te chamar?',
];

const randomWelcomeMessage = () =>
  welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];

const MOUSE_HANDLER_INTERVAL = 10;

const Home: React.FC = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [welcomeMessage] = useState(randomWelcomeMessage());

  const [mode, setMode] = useState<CursorModeType>('cursor');
  const [position, setPosition] = useState<ICursorPosition>({ x: 0, y: 0 });
  const [username, setUsername] = useState('');
  const [showModal, setShowModal] = React.useState(false);
  const [confirmLoading, setConfirmLoading] = React.useState(false);

  useEffect(() => {
    const newSocket = io(String(process.env.NEXT_PUBLIC_API_URL));
    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  useEffect(() => {
    if (!socket) return;
    const usernameSaved = window.localStorage.getItem('username');

    if (usernameSaved) {
      setUsername(usernameSaved);
      socket.emit('new_user', usernameSaved);
    } else {
      setShowModal(true);
    }
  }, [socket]);

  const handleSubmit = () => {
    if (!username.length) return;

    setConfirmLoading(true);
    window.localStorage.setItem('username', username);

    socket?.emit('new_user', username);
    setTimeout(() => {
      setShowModal(false);
      setConfirmLoading(false);
    }, 2000);
  };

  useEffect(() => {
    if (!socket) return;

    socket.on('user_online', (user: string) =>
      notification.info({
        message: `${user} está online`,
      }),
    );
  }, [socket]);

  useEffect(() => {
    if (!socket) return;

    socket.on('user_moving', (data: ICursorPositionInfo) => {
      const handler = setTimeout(() => {
        const cursorId = `cursor-${data.name}`;
        const container = document.getElementById(`container`);
        let cursor = document.getElementById(cursorId);

        if (!container) return;
        if (!cursor || data.mode === 'pencil') {
          cursor = document.createElement('div');
          cursorElement(cursor, data.mode === 'cursor' ? cursorId : '');
          container.appendChild(cursor);
        }

        cursor.style.top = `${data.y}px`;
        cursor.style.left = `${data.x}px`;
      }, MOUSE_HANDLER_INTERVAL);

      return () => {
        clearTimeout(handler);
      };
    });
  }, [socket]);

  useEffect(() => {
    if (!socket) return;

    socket?.emit('mouse_movement', {
      ...position,
      name: username,
      mode,
    });
  }, [position, socket, username, mode]);

  const mouseHandler = (event: MouseEvent) => {
    const mouseInterval = setTimeout(() => {
      setPosition({ x: event.clientX, y: event.clientY });
    }, MOUSE_HANDLER_INTERVAL);

    return () => {
      clearTimeout(mouseInterval);
    };
  };

  return (
    <Container
      onMouseMove={mouseHandler}
      id="container"
      onClick={() => setMode(v => (v === 'cursor' ? 'pencil' : 'cursor'))}
    >
      <Modal
        title={welcomeMessage}
        visible={showModal}
        onOk={handleSubmit}
        confirmLoading={confirmLoading}
        closable={false}
        cancelButtonProps={{ hidden: true }}
        okButtonProps={{ disabled: !username.length }}
      >
        <Input
          autoFocus
          placeholder="Digite aqui"
          value={username}
          onChange={e => setUsername(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
        />
      </Modal>
    </Container>
  );
};

export default Home;
