import { Component, OnInit } from '@angular/core';
import { WsService } from '../../shared/services/ws.service';
import { Breakpoints } from '@angular/cdk/layout';

enum Status { NEW_GAME = 'NEW_GAME', JOIN_GAME = 'JOIN_GAME' }

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
    this.ws.joinGame(this.code);
  }

  processMsg(msg: any) {
    const self = this;
    switch (msg.code) {
      case 'JOIN_GAME':
        self.status = Status.JOIN_GAME;
        break;
    }
  }
  whatStatus(status: string): boolean {
    const self = this;
    return status === this.status;
    switch (status) {
      case 'NEW_GAME':
        return self.status === Status.NEW_GAME;
      case 'JOIN_GAME':
        return self.status === Status.JOIN_GAME;
      case 'NEW_GAME':
        return self.status === Status.NEW_GAME;
    }
  }
}
