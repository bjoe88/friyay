import { Component, OnInit } from '@angular/core';
import { WsService } from '../../shared/services/ws.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.sass']
})
export class GameComponent implements OnInit {
  code = '';
  status = 'JOIN_GAME';
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
        this.status = msg.code;
        break;
    }
  }
}
