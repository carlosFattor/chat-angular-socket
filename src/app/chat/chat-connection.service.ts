import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { environment } from '../../environments/environment';
import { catchError, switchAll, map } from 'rxjs/operators';
import { EMPTY, Observable, Subject } from 'rxjs';
import { Message } from '../models/message.model';
export const WS_ENDPOINT = environment.wsEndpoint;
export const RECONNECT_INTERVAL = environment.reconnectInterval;

@Injectable({
  providedIn: 'root'
})
export class ChatConnectionService {

  private socket$: WebSocketSubject<Message>;
  private messagesSubject$ = new Subject<Observable<Message>>();
  public messages$ = this.messagesSubject$.pipe(switchAll(), catchError(e => { throw e }));

  constructor() {
  }

  public connect(cfg: { reconnect: boolean, channel: string, userName: string } = {reconnect: true, channel: 'chat', userName: 'carlos'}): void {
    this.close()
    if (!this.socket$ || this.socket$.closed) {
      this.socket$ = this.getNewWebSocket(cfg.channel, cfg.userName);
      const messages = this.socket$.pipe(
        map((data) => data as Message), 
        catchError(_ => EMPTY))
      this.messagesSubject$.next(messages);
    }
  }

  private getNewWebSocket(channel: string, userName: string) {
    return webSocket<Message>(`${WS_ENDPOINT}/${channel}/${userName}`);
  }

  close() {
    if(!!this.socket$) {
      this.socket$.complete();
      this.socket$ = undefined;
    }
  }

  sendMessage(msg: any) {
    this.socket$.next(msg);
  }
}
