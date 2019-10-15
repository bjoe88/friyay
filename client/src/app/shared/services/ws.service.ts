import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

interface Message {
  type: string;
  code: string;
}

@Injectable({
  providedIn: 'root'
})
export class WsService {

  constructor(private socket: Socket) {

  }

  emit(type: any, data: any) {
    const message = data;
    message.type = type;
    this.socket.emit('msg', message);
  }

  receiveMsg() {
    return this.socket.fromEvent('msg');
  }

  getUsers() {
    return this.socket.fromEvent('users');
  }

  adminStartGame(code: string) {
    const message: Message = {
      type: 'START_GAME',
      code
    };
    this.socket.emit('msgAdmin', message);
  }
}
