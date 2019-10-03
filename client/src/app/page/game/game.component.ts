import { Component, OnInit } from '@angular/core';
import { WsService } from '../../shared/services/ws.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.sass']
})
export class GameComponent implements OnInit {
  code = '';
  constructor(private ws: WsService) { }

  ngOnInit() {
  }
  join() {
    this.ws.joinGame(this.code);
  }
}
