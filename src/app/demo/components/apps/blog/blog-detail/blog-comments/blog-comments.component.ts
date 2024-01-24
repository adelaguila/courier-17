import { Component, Input } from '@angular/core';
import { Comment } from 'src/app/demo/api/blog';
import { LayoutService } from 'src/app/layout/service/app.layout.service';

@Component({
    selector: 'app-blog-comments',
    templateUrl: './blog-comments.component.html'
})
export class BlogCommentsComponent {

    @Input() comments: Comment[] = [];

    rowCount = 3;
    
    constructor(private layoutService: LayoutService) {}

    get rtl() {
        return this.layoutService.config().rtl;
    }
}
