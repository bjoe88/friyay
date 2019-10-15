import { Component, OnInit } from '@angular/core';
import { WsService } from '../../shared/services/ws.service';


enum Status {
  GET_CLIENT_CODE = 'GET_CLIENT_CODE',
  SEND_CLIENT_CODE = 'SEND_CLIENT_CODE',
  INVALID_CODE = 'INVALID_CODE',
  NEW_GAME = 'NEW_GAME',
  JOIN_GAME = 'JOIN_GAME',
  START_GAME = 'START_GAME',
  QUESTION = 'QUESTION',
  RESULT = 'RESULT',
  ANSWER = 'ANSWER',
  ENDGAME = 'ENDGAME',
}

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.sass']
})
export class GameComponent implements OnInit {
  code = '';
  status: Status = Status.NEW_GAME;
  result = false;
  questions = null;
  constructor(private ws: WsService) { }

  ngOnInit() {
    this.ws.receiveMsg().subscribe((message: string) => {
      this.processMsg(message);
    });
  }

  join() {
    this.ws.emit(Status.JOIN_GAME, { code: this.code });
  }

  makeId(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
  sendClientKey(clientKey) {
    this.ws.emit(Status.SEND_CLIENT_CODE, { clientKey });
  }

  processMsg(msg: any) {
    const self = this;
    switch (msg.code) {
      case Status.GET_CLIENT_CODE:
        // SEND_CLIENT_CODE = 'SEND_CLIENT_CODE',
        let clientKey = window.localStorage.getItem('ifun-client-key');

        if (!clientKey) {
          clientKey = self.makeId(32);
          window.localStorage.setItem('ifun-client-key', clientKey);
        }
        self.sendClientKey(clientKey);
        break;
      case Status.JOIN_GAME:
        self.status = Status.JOIN_GAME;
        break;
      case Status.START_GAME:
        self.status = Status.START_GAME;
        break;
      case Status.QUESTION:
        self.status = Status.QUESTION;
        break;
      case Status.ANSWER:
        self.status = Status.ANSWER;
        break;
      case Status.RESULT:
        self.status = Status.RESULT;
        break;
      case Status.ENDGAME:
        self.status = Status.ENDGAME;
        break;
    }
  }

  whatStatus(status: string): boolean {
    const self = this;
    return status === this.status;
  }
}
