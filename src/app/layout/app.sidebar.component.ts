import {
    AfterViewInit,
    Component,
    ElementRef,
    OnDestroy,
    ViewChild,
} from '@angular/core';
import { LayoutService } from './service/app.layout.service';

@Component({
    selector: 'app-sidebar',
    templateUrl: './app.sidebar.component.html',
})
export class AppSidebarComponent implements OnDestroy {
    timeout: any = null;

    @ViewChild('menuContainer') menuContainer!: ElementRef;

    constructor(public layoutService: LayoutService, public el: ElementRef) {}

    resetOverlay() {
        if (this.layoutService.state.overlayMenuActive) {
            this.layoutService.state.overlayMenuActive = false;
        }
    }

    get menuProfilePosition(): string {
        return this.layoutService.config().menuProfilePosition;
    }

    onMouseEnter() {
        if (!this.layoutService.state.anchored) {
            if (this.timeout) {
                clearTimeout(this.timeout);
                this.timeout = null;
            }
            this.layoutService.state.sidebarActive = true;
        }
    }

    ngOnDestroy() {
        this.resetOverlay();
    }
}
