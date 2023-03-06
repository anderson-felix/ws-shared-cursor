import { Server } from 'socket.io';

import { CursorPositionInfo } from './interfaces';

interface User {
  username: string;
  avatar: string;
}

export default class Socket {
  io: Server;

  constructor(io: Server) {
    this.io = io;
  }

  public start(): void {
    this.io.on('connection', socket => {
      socket.broadcast.emit('user_connection', {
        connected: true,
        id: socket.id,
      });

      socket.on('disconnect', () =>
        socket.broadcast.emit('user_connection', {
          connected: false,
          id: socket.id,
        }),
      );

      socket.on('new_user', (user: User) => {
        socket.broadcast.emit('user_online', user); // Emit for all connections except the emissor
      });

      socket.on('mouse_movement', (data: CursorPositionInfo) => {
        if (data.mode === 'cursor') socket.broadcast.emit('user_moving', data);
        else this.io.emit('user_moving', data);
      });
    });
  }
}
