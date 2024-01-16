import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardEcommerceRoutingModule } from './dashboardecommerce-routing.module';
import { DashboardEcommerceComponent } from './dashboardecommerce.component';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { MenuModule } from 'primeng/menu';
import { ChartModule } from 'primeng/chart';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { RatingModule } from 'primeng/rating';
import { BadgeModule } from 'primeng/badge';

@NgModule({
    imports: [
        CommonModule,
        DashboardEcommerceRoutingModule,
        ButtonModule,
        RippleModule,
        MenuModule,
        ChartModule,
        TableModule,
        InputTextModule,
        OverlayPanelModule,
        RatingModule,
        BadgeModule,
    ],
    declarations: [
        DashboardEcommerceComponent
    ]
})
export class DashboardEcommerceModule { }
