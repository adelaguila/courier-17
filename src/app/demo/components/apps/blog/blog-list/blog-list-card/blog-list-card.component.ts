import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Blog } from 'src/app/demo/api/blog';
import { LayoutService } from 'src/app/layout/service/app.layout.service';

@Component({
    selector: 'app-blog-list-card',
    templateUrl: './blog-list-card.component.html',
})
export class BlogListCardComponent {
    @Input() blog!: Blog;

    constructor(private router: Router, private layoutService : LayoutService) {}

    navigateToDetail(): void {
        this.router.navigateByUrl('/apps/blog/detail');
    }
    
    get rtl() {
        return this.layoutService.config().rtl;
    }
}
