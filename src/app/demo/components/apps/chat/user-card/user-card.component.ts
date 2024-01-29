import { Component, OnInit, Input } from '@angular/core';
import { Message } from 'src/app/demo/api/message';
import { User } from 'src/app/demo/api/user';
import { ChatService } from '../service/chat.service';
import { LayoutService } from 'src/app/layout/service/app.layout.service';

@Component({
    selector: 'app-user-card',
    templateUrl: './user-card.component.html'
})
export class UserCardComponent implements OnInit {

    @Input() user!: User;

    lastMessage!: Message;

    constructor(private chatService: ChatService, private layoutService: LayoutService) { }

    get rtl() {
        return this.layoutService.config().rtl;
    }

    ngOnInit(): void {
        let filtered = this.user.messages.filter(m => m.ownerId !== 123)
        this.lastMessage = filtered[filtered.length - 1];
        console.log(this.user);
        
    }

    changeView(user: User) {
        this.chatService.changeActiveChat(user);
    }
}
