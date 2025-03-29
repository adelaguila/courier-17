import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CertGuard } from 'src/app/guard/cert.guard';
import { TipoEgresoModule } from './tipos-egresos/tipo-egreso.module';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full',
                // data: { breadcrumb: 'Dashboard' },
                // loadChildren: () =>
                //     import('./dashboard/dashboard.module').then(
                //         (m) => m.DashboardModule
                //     ),
                // canActivate: [CertGuard],
            },
            {
                path: 'dashboard',
                data: { breadcrumb: 'Dashboard' },
                loadChildren: () =>
                    import('./dashboard/dashboard.module').then(
                        (m) => m.DashboardModule
                    ),
                // canActivate: [CertGuard],
            },

            // {
            //     path: 'sistema/usuarios',
            //     data: { breadcrumb: 'Usuarios' },
            //     loadChildren: () =>
            //         import('./usuarios/usuario.module').then((m) => m.UsuarioModule),
            //     canActivate: [CertGuard],
            // },

            // {
            //     path: 'tablas/bancos',
            //     data: { breadcrumb: 'Bancos' },
            //     loadChildren: () =>
            //         import('./bancos/banco.module').then(
            //             (m) => m.BancoModule
            //         ),
            //     canActivate: [CertGuard],
            // },

            // {
            //     path: 'tablas/cajasnap',
            //     data: { breadcrumb: 'Cajas Nap' },
            //     loadChildren: () =>
            //         import('./cajas-nap/caja-nap.module').then(
            //             (m) => m.CajaNapModule
            //         ),
            //     canActivate: [CertGuard],
            // },

            // {
            //     path: 'tablas/clientes-proveedores',
            //     data: { breadcrumb: 'Clientes / Proveedores' },
            //     loadChildren: () =>
            //         import('./terceros/tercero.module').then(
            //             (m) => m.TerceroModule
            //         ),
            //     canActivate: [CertGuard],
            // },
            // {
            //     path: 'tablas/cuentas-bancarias',
            //     data: { breadcrumb: 'Cuentas Bancarias' },
            //     loadChildren: () =>
            //         import('./cuentas-bancarias/cuenta-bancaria.module').then(
            //             (m) => m.CuentaBancariaModule
            //         ),
            //     canActivate: [CertGuard],
            // },

            // {
            //     path: 'tablas/marcas',
            //     data: { breadcrumb: 'Marcas' },
            //     loadChildren: () =>
            //         import('./marcas/marca.module').then(
            //             (m) => m.MarcaModule
            //         ),
            //     canActivate: [CertGuard],
            // },


            // {
            //     path: 'tablas/monedas',
            //     data: { breadcrumb: 'Monedas' },
            //     loadChildren: () =>
            //         import('./monedas/moneda.module').then(
            //             (m) => m.MonedaModule
            //         ),
            //     canActivate: [CertGuard],
            // },
            // {
            //     path: 'tablas/planes',
            //     data: { breadcrumb: 'Planes' },
            //     loadChildren: () =>
            //         import('./planes/plan.module').then(
            //             (m) => m.PlanModule
            //         ),
            //     canActivate: [CertGuard],
            // },


            // {
            //     path: 'tablas/servicios',
            //     data: { breadcrumb: 'Servicios' },
            //     loadChildren: () =>
            //         import('./servicios/servicio.module').then(
            //             (m) => m.ServicioModule
            //         ),
            //     canActivate: [CertGuard],
            // },

            // {
            //     path: 'tablas/sectores',
            //     data: { breadcrumb: 'Sectores' },
            //     loadChildren: () =>
            //         import('./sectores/sector.module').then(
            //             (m) => m.SectorModule
            //         ),
            //     canActivate: [CertGuard],
            // },

            // {
            //     path: 'tablas/tipos-vias',
            //     data: { breadcrumb: 'Tipos de Vías' },
            //     loadChildren: () =>
            //         import('./tipos-vias/tipo-via.module').then(
            //             (m) => m.TipoViaModule
            //         ),
            //     canActivate: [CertGuard],
            // },

            {
                path: 'tablas/agencias',
                data: { breadcrumb: 'Agencias' },
                loadChildren: () =>
                    import('./agencias/agencia.module').then(
                        (m) => m.AgenciaModule
                    ),
                // canActivate: [CertGuard],
            },

            {
                path: 'tablas/destinos',
                data: { breadcrumb: 'Destinos' },
                loadChildren: () =>
                    import('./agencias-destinos/agencia-destino.module').then(
                        (m) => m.AgenciaDestinoModule
                    ),
                // canActivate: [CertGuard],
            },

            {
                path: 'tablas/clientes-proveedores',
                data: { breadcrumb: 'Clientes / Proveedores' },
                loadChildren: () =>
                    import('./clientes-proveedores/cliente-proveedor.module').then(
                        (m) => m.ClienteProveedorModule
                    ),
                // canActivate: [CertGuard],
            },


            {
                path: 'tablas/ubigeos',
                data: { breadcrumb: 'Ubigeos' },
                loadChildren: () =>
                    import('./ubigeos/ubigeo.module').then(
                        (m) => m.UbigeoModule
                    ),
                // canActivate: [CertGuard],
            },

            {
                path: 'tablas/tarifario',
                data: { breadcrumb: 'Tipos Envios' },
                loadChildren: () =>
                    import('./tarifario/tarifario.module').then(
                        (m) => m.TarifarioModule
                    ),
                // canActivate: [CertGuard],
            },

            {
                path: 'tablas/tipos-clientes-proveedores',
                data: { breadcrumb: 'Tipos Clientes / Proveedores' },
                loadChildren: () =>
                    import('./tipos-clientes-proveedores/tipo-cliente-proveedor.module').then(
                        (m) => m.TipoClienteProveedorModule
                    ),
                // canActivate: [CertGuard],
            },

            {
                path: 'tablas/tipos-agencias',
                data: { breadcrumb: 'Tipos Agencias' },
                loadChildren: () =>
                    import('./tipos-agencias/tipo-agencia.module').then(
                        (m) => m.TipoAgenciaModule
                    ),
                // canActivate: [CertGuard],
            },


            {
                path: 'tablas/tipos-documentos-identidad',
                data: { breadcrumb: 'Tipos Documentos Identidad' },
                loadChildren: () =>
                    import('./tipos-documentos-identidad/tipo-documento-identidad.module').then(
                        (m) => m.TipoDocumentoIdentidadModule
                    ),
                // canActivate: [CertGuard],
            },

            {
                path: 'tablas/tipos-servicios',
                data: { breadcrumb: 'Tipos Servicios' },
                loadChildren: () =>
                    import('./tipos-servicios/tipo-servicio.module').then(
                        (m) => m.TipoServicioModule
                    ),
                // canActivate: [CertGuard],
            },

            {
                path: 'tablas/tipos-envios',
                data: { breadcrumb: 'Tipos Envios' },
                loadChildren: () =>
                    import('./tipos-envios/tipo-envio.module').then(
                        (m) => m.TipoEnvioModule
                    ),
                // canActivate: [CertGuard],
            },

            {
                path: 'tablas/tipos-pagos',
                data: { breadcrumb: 'Tipos Pagos' },
                loadChildren: () =>
                    import('./tipos-pagos/tipo-pago.module').then(
                        (m) => m.TipoPagoModule
                    ),
                // canActivate: [CertGuard],
            },

            {
                path: 'tablas/tipos-ordenes-servicios',
                data: { breadcrumb: 'Tipos Ordenes Servicio' },
                loadChildren: () =>
                    import('./tipos-ordenes-servicios/tipo-orden-servicio.module').then(
                        (m) => m.TipoOrdenServicioModule
                    ),
                // canActivate: [CertGuard],
            },

            {
                path: 'tablas/tipos-embalajes',
                data: { breadcrumb: 'Tipos Embalajes' },
                loadChildren: () =>
                    import('./tipos-embalajes/tipo-embalaje.module').then(
                        (m) => m.TipoEmbalajeModule
                    ),
                // canActivate: [CertGuard],
            },

            {
                path: 'ordenes',
                data: { breadcrumb: 'Ordenes' },
                loadChildren: () =>
                    import('./ordenes-servicios/orden-servicio.module').then(
                        (m) => m.OrdenServicioModule
                    ),
                // canActivate: [CertGuard],
            },


            // {
            //     path: 'tablas/vias',
            //     data: { breadcrumb: 'Vías' },
            //     loadChildren: () =>
            //         import('./vias/via.module').then(
            //             (m) => m.ViaModule
            //         ),
            //     canActivate: [CertGuard],
            // },

            // {
            //     path: 'cargos/tipos-cargos',
            //     data: { breadcrumb: 'Tipos de Cargos' },
            //     loadChildren: () =>
            //         import('./tipos-cargos/tipo-cargo.module').then(
            //             (m) => m.TipoCargoModule
            //         ),
            //     canActivate: [CertGuard],
            // },

            // {
            //     path: 'cargos/generar-cargos',
            //     data: { breadcrumb: 'Generar cargos' },
            //     loadChildren: () =>
            //         import('./liquidaciones/liquidacion.module').then(
            //             (m) => m.LiquidacionModule
            //         ),
            //     canActivate: [CertGuard],
            // },

            // {
            //     path: 'ordenes/tipos-ordenes',
            //     data: { breadcrumb: 'Tipos de Ordenes' },
            //     loadChildren: () =>
            //         import('./tipos-ordenes/tipo-orden.module').then(
            //             (m) => m.TipoOrdenModule
            //         ),
            //     canActivate: [CertGuard],
            // },

            // {
            //     path: 'abonados',
            //     data: { breadcrumb: 'Abonados' },
            //     loadChildren: () =>
            //         import('./abonados/abonado.module').then(
            //             (m) => m.AbonadoModule
            //         ),
            //     canActivate: [CertGuard],
            // },

            // {
            //     path: 'ordenes',
            //     data: { breadcrumb: 'Ordenes' },
            //     loadChildren: () =>
            //         import('./ordenes/orden.module').then(
            //             (m) => m.OrdenModule
            //         ),
            //     canActivate: [CertGuard],
            // },

            // {
            //     path: 'almacen',
            //     data: { breadcrumb: 'Almacen' },
            //     loadChildren: () =>
            //         import('./almacen/almacen.module').then(
            //             (m) => m.AlmacenModule
            //         ),
            //     canActivate: [CertGuard],
            // },

            // {
            //     path: 'almacen/productos',
            //     data: { breadcrumb: 'Productos' },
            //     loadChildren: () =>
            //         import('./productos/producto.module').then(
            //             (m) => m.ProductoModule
            //         ),
            //     canActivate: [CertGuard],
            // },

            // {
            //     path: 'almacen/onts',
            //     data: { breadcrumb: 'Onts' },
            //     loadChildren: () =>
            //         import('./onts/ont.module').then(
            //             (m) => m.OntModule
            //         ),
            //     canActivate: [CertGuard],
            // },

            // {
            //     path: 'facturacion',
            //     data: { breadcrumb: 'Facturación' },
            //     loadChildren: () =>
            //         import('./facturacion/facturacion.module').then(
            //             (m) => m.FacturacionModule
            //         ),
            //     canActivate: [CertGuard],
            // },

            // {
            //     path: 'pagos',
            //     data: { breadcrumb: 'Pagos' },
            //     loadChildren: () =>
            //         import('./pagos/pago.module').then(
            //             (m) => m.PagoModule
            //         ),
            //     canActivate: [CertGuard],
            // },

            // {
            //     path: 'cierre-caja',
            //     data: { breadcrumb: 'Cierre Caja' },
            //     loadChildren: () =>
            //         import('./cierre-caja/cierre-caja.module').then(
            //             (m) => m.CierreCajaModule
            //         ),
            //     canActivate: [CertGuard],
            // },

            // {
            //     path: 'caja/tipo-egresos',
            //     data: { breadcrumb: 'Tipod de Egresos' },
            //     loadChildren: () =>
            //         import('./tipos-egresos/tipo-egreso.module').then(
            //             (m) => m.TipoEgresoModule
            //         ),
            //     canActivate: [CertGuard],
            // },

            // {
            //     path: 'caja/tipo-ingresos',
            //     data: { breadcrumb: 'Tipod de Ingresos' },
            //     loadChildren: () =>
            //         import('./tipos-ingresos/tipo-ingreso.module').then(
            //             (m) => m.TipoIngresoModule
            //         ),
            //     canActivate: [CertGuard],
            // },

            // {
            //     path: 'caja/ingresos',
            //     data: { breadcrumb: 'Caja Ingresos' },
            //     loadChildren: () =>
            //         import('./caja-ingresos/caja-ingreso.module').then(
            //             (m) => m.CajaIngresoModule
            //         ),
            //     canActivate: [CertGuard],
            // },

            // {
            //     path: 'caja/egresos',
            //     data: { breadcrumb: 'Caja Egresos' },
            //     loadChildren: () =>
            //         import('./caja-egresos/caja-egreso.module').then(
            //             (m) => m.CajaEgresoModule
            //         ),
            //     canActivate: [CertGuard],
            // },

            // {
            //     path: 'caja/movimientos-dia',
            //     data: { breadcrumb: 'Caja Movimientos' },
            //     loadChildren: () =>
            //         import('./caja-movimientos-fecha/caja-movimiento-fecha.module').then(
            //             (m) => m.CajaMovimientoFechaModule
            //         ),
            //     canActivate: [CertGuard],
            // },

            // { path: 'crud', data: { breadcrumb: 'Crud' }, loadChildren: () => import('./crud/crud.module').then(m => m.CrudModule) },
            // { path: 'empty', data: { breadcrumb: 'Empty' }, loadChildren: () => import('./empty/emptydemo.module').then(m => m.EmptyDemoModule) },
            // { path: 'help', data: { breadcrumb: 'Help' }, loadChildren: () => import('./help/help.module').then(m => m.HelpModule) },
            // { path: 'invoice', data: { breadcrumb: 'Invoice' }, loadChildren: () => import('./invoice/invoice.module').then(m => m.InvoiceModule) },
            // { path: 'timeline', data: { breadcrumb: 'Timeline' }, loadChildren: () => import('./timeline/timelinedemo.module').then(m => m.TimelineDemoModule) },
            // { path: 'faq', data: { breadcrumb: 'FAQ' }, loadChildren: () => import('./faq/faq.module').then(m => m.FaqModule) },
            // { path: 'contact', data: { breadcrumb: 'Contact' }, loadChildren: () => import('./contact/contact.module').then(m => m.ContactModule) },
            { path: '**', redirectTo: '/notfound' },
        ]),
    ],
    exports: [RouterModule],
})
export class PagesRoutingModule {}
