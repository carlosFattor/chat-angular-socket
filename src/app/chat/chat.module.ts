import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatComponent } from './chat.component';
import { ChatConnectionService } from './chat-connection.service';

@NgModule({
  declarations: [ChatComponent],
  imports: [
    CommonModule
  ],
  providers: [
    ChatConnectionService
  ]
})
export class ChatModule { }
