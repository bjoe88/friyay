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

  joinGame(code: string) {
    console.log('asd');

    const message: Message = {
      type: 'JOIN_GAME',
      code
    };
    console.log('asd');
    this.socket.emit('msg', message);
  }

  receiveChat() {
    return this.socket.fromEvent('chat');
  }

  getUsers() {
    return this.socket.fromEvent('users');
  }

}
