import { Component, OnInit } from '@angular/core';
import { WsService } from 'src/app/shared/services/ws.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.sass']
})
export class AdminComponent implements OnInit {
  code = '1';
  constructor(private ws: WsService) { }

  ngOnInit() {
    this.ws.receiveMsg().subscribe((message: string) => {
      this.processMsg(message);
    });
  }

  startGameBtn() {
    this.ws.adminStartGame(this.code);
  }

  processMsg(msg: any) {
    const self = this;
    // switch (msg.code) {
    //   case 'JOIN_GAME':
    //     self.status = Status.JOIN_GAME;
    //     break;
    // }
  }
}
