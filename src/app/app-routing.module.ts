import { NgModule } from '@angular/core';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { AppLayoutComponent } from './layout/app.layout.component';



import { CertGuard } from './guard/cert.guard';
import { LoginComponent } from './admin/auth/login/login.component';
import { ForgotComponent } from './admin/auth/login/forgot/forgot.component';
import { RandomComponent } from './admin/auth/login/forgot/random/random.component';

const routerOptions: ExtraOptions = {
    anchorScrolling: 'enabled',
    scrollPositionRestoration: 'enabled',
};

const routes: Routes = [
    {
        path: '',
        redirectTo: 'pages',
        pathMatch: 'full',
    },
    {
        path: 'pages',
        component: AppLayoutComponent,
        children: [
            {
                path: '',
                data: { breadcrumb: 'Pages' },
                loadChildren: () =>
                    import('./admin/pages/pages.module').then(
                        (m) => m.PagesModule
                    ),
            },

        ],
    },
    {
        path: 'login',
        // loadChildren: () =>
        //     import('./admin/auth/auth.routes').then((m) => m.AuthRoutes),
        component: LoginComponent,
    },

    {
        path: 'forgot',
        component: ForgotComponent,
        children: [{ path: ':random', component: RandomComponent }],
      },

    {
        path: 'notfound',
        loadChildren: () =>
            import('./admin/notfound/notfound.module').then(
                (m) => m.NotfoundModule
            ),
    },
    {
        path: 'landing',
        loadChildren: () =>
            import('./admin/landing/landing.module').then(
                (m) => m.LandingModule
            ),
    },
    { path: '**', redirectTo: '/notfound' },
];

@NgModule({
    imports: [RouterModule.forRoot(routes, routerOptions)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
