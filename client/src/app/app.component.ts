import { Component, OnInit } from '@angular/core';
// import { ChatService } from './services/chat.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit {
  title = 'client';

  constructor() {

  }

  ngOnInit() {

    // this.chatService.receiveChat().subscribe((message: string) => {
    //   this.messages.push(message);
    // });

    // this.chatService.getUsers().subscribe((users: number) => {
    //   this.users = users;
    // });

  }

  // addChat() {
  //   this.messages.push(this.message);
  //   this.chatService.sendChat(this.message);
  //   this.message = '';
  // }
}
