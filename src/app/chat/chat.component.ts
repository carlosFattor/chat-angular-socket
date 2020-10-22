import { ChangeDetectionStrategy, Component, ElementRef, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { Message } from '../models/message.model';
import { ChatConnectionService } from './chat-connection.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatComponent {

  @ViewChild('chatMsgs') textArea: ElementRef<HTMLInputElement>;
  message = "";
  blockUserName = false;
  messages: Message[] | null;
  userName: string;

  constructor(private chatService: ChatConnectionService) { }

  incommingUser(userName: string): void {
    if(userName.length > 3) {
      this.userName = userName;
      this.blockUserName = true;
      this.chatService.connect({ reconnect: false, channel: 'chat', userName: userName });
      this.chatService.messages$.subscribe(msg => {
        if(!this.messages) 
          this.messages = new Array();
        this.messages.push(msg);
        if(msg.userName === this.userName) {
          this.textArea.nativeElement.append(`    ${msg.userName}>> ${msg.msg} \n`)
        } else {
          this.textArea.nativeElement.append(`${msg.userName}<< ${msg.msg} \n`)
        }
      })
    }
  }

  sendMsg(msg: string): void {
    this.chatService.sendMessage({msg, userName: this.userName});
  }

}
