import { Component, Input, OnInit, signal } from '@angular/core';
import { MenuService } from '../app.menu.service';
import {
    ColorScheme,
    LayoutService,
    MenuMode,
} from '../service/app.layout.service';

@Component({
    selector: 'app-config',
    templateUrl: './app.config.component.html',
})
export class AppConfigComponent implements OnInit {
    @Input() minimal: boolean = false;

    componentThemes: any[] = [];

    menuThemes: any[] = [];

    topbarThemes: any[] = [];

    scenes: any[] = [];

    scales: number[] = [12, 13, 14, 15, 16];

    selectedScene = signal<string>('');

    constructor(
        public layoutService: LayoutService,
        public menuService: MenuService
    ) {}

    get visible(): boolean {
        return this.layoutService.state.configSidebarVisible;
    }
    set visible(_val: boolean) {
        this.layoutService.state.configSidebarVisible = _val;
    }

    get scale(): number {
        return this.layoutService.config().scale;
    }
    set scale(_val: number) {
        this.layoutService.config.update((config) => ({
            ...config,
            scale: _val,
        }));
    }

    get menuMode(): MenuMode {
        return this.layoutService.config().menuMode;
    }
    set menuMode(_val: MenuMode) {
        this.layoutService.config().menuMode = _val;
        if (this.layoutService.isHorizontal()) {
            this.menuService.reset();
        }
    }

    get colorScheme(): ColorScheme {
        return this.layoutService.config().colorScheme;
    }
    set colorScheme(_val: ColorScheme) {
        if (_val !== this.layoutService.config().colorScheme) {
            this.layoutService.config.update((config) => ({
                ...config,
                menuTheme: _val,
                topbarTheme: _val,
                colorScheme: _val,
            }));
        }
    }

    get inputStyle(): string {
        return this.layoutService.config().inputStyle;
    }
    set inputStyle(_val: string) {
        this.layoutService.config.update((config) => ({
            ...config,
            inputStyle: _val,
        }));
    }

    get ripple(): boolean {
        return this.layoutService.config().ripple;
    }
    set ripple(_val: boolean) {
        this.layoutService.config.update((config) => ({
            ...config,
            ripple: _val,
        }));
    }

    get menuTheme(): string {
        return this.layoutService.config().menuTheme;
    }
    set menuTheme(_val: ColorScheme) {
        this.layoutService.config.update((config) => ({
            ...config,
            menuTheme: _val,
        }));
    }

    get topbarTheme(): string {
        return this.layoutService.config().topbarTheme;
    }
    set topbarTheme(_val: string) {
        this.layoutService.config.update((config) => ({
            ...config,
            topbarTheme: _val,
        }));
    }

    get componentTheme(): string {
        return this.layoutService.config().componentTheme;
    }
    set componentTheme(_val: string) {
        this.layoutService.config.update((config) => ({
            ...config,
            componentTheme: _val,
        }));
    }

    ngOnInit() {
        this.componentThemes = [
            { name: 'purple', color: '#6f42c1' },
            { name: 'indigo', color: '#6610f2' },
            { name: 'pink', color: '#d63384' },
            { name: 'blue', color: '#0d6efd' },
            { name: 'cyan', color: '#0dcaf0' },
            { name: 'teal', color: '#20c997' },
            { name: 'green', color: '#198754' },
            { name: 'yellow', color: '#ffc107' },
            { name: 'orange', color: '#fd7e14' },
            { name: 'black', color: '#000000' },
        ];

        this.menuThemes = [
            { name: 'light', color: '#ffffff' },
            { name: 'dark', color: '#212529' },
            { name: 'dim', color: '#212529' },
        ];

        this.topbarThemes = [
            { name: 'light', color: '#FFFFFF' },
            { name: 'dark', color: '#212529' },
            { name: 'dim', color: '#1565C0' },
        ];
    }

    onConfigButtonClick() {
        this.layoutService.showConfigSidebar();
    }

    changeTheme(theme: string) {
        this.componentTheme = theme;
    }

    decrementScale() {
        this.scale--;
    }

    incrementScale() {
        this.scale++;
    }
}
