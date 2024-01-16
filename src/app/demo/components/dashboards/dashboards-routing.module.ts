import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                data: { breadcrumb: 'Dashboard' },
                loadChildren: () =>
                    import('./banking/dashboardbanking.module').then(
                        (m) => m.DashboardBankingModule
                    ),
            },
        ]),
    ],
    exports: [RouterModule],
})
export class DashboardsRoutingModule {}
