import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { map } from 'rxjs';
import { OntUser } from 'src/app/admin/models/ont-user';
import { ProductoEmpleado } from 'src/app/admin/models/producto-empleado';
import { OntUserService } from 'src/app/admin/services/ont-user.service';
import { ProductoEmpleadoService } from 'src/app/admin/services/producto-empleado.service';
import { UserService } from 'src/app/admin/services/user.service';
import { PrimengModule } from 'src/app/primeng/primeng.module';

import { Vendedor } from 'src/app/shared/interfaces/vendedor';

@Component({
    selector: 'app-empleado-inventario',
    templateUrl: './empleado-inventario.component.html',
    styleUrls: ['./empleado-inventario.component.scss'],
    standalone: true,
    imports: [PrimengModule, PdfViewerModule, ReactiveFormsModule, NgIf],
    providers: [MessageService, ConfirmationService, DialogService],
})
export class EmpleadoInventarioComponent implements OnInit {
    form!: FormGroup;
    empleados: Vendedor[] | undefined = [];
    listaProductosEmpleado: ProductoEmpleado[];
    listaONTSEmpleado: OntUser[];

    constructor(
        private userService: UserService,
        private productoEmpleadoService: ProductoEmpleadoService,
        private ontUserService: OntUserService,
        private confirmationService: ConfirmationService,
        private messageService: MessageService,
        public dialogService: DialogService,
        private route: ActivatedRoute,
        private router: Router // private breadcrumbService: AppBreadcrumbService
    ) {}

    ngOnInit(): void {
        this.userService
            .findAll()
            .pipe(
                map((value) =>
                    value.sort((a, b) => {
                        if (a.name < b.name) {
                            return -1;
                        } else {
                            return 1;
                        }
                    })
                )
            )
            .subscribe((data) => {
                data.map((e) => {
                    let vendedor: Vendedor = {
                        code: e.idUser,
                        name: e.name,
                    };
                    this.empleados.push(vendedor);
                });
            });

        this.form = new FormGroup({
            empleado: new FormControl(0, Validators.required),
        });
    }

    get f() {
        return this.form.controls;
    }

    cargar() {
        let empleado = this.form.value['empleado'];
        console.log(empleado.code);
        this.productoEmpleadoService
            .getByEmpleadoInsumos(empleado.code)
            .subscribe((data) => {
                this.listaProductosEmpleado = data;
            });
        // this.ontUserService.getByEstadoUser('DISPONIBLE',empleado.code).subscribe((data) => {
        //     this.listaONTSEmpleado = data;
        // });
        this.cargarOnus(empleado.code);
    }

    devolverOnu(onuUser: OntUser) {
        console.log(onuUser);
        this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: `¿Está seguro que desea devolver la ONU ${onuUser.serieMarca}?`,
            header: 'Confirmar',
            icon: 'pi pi-info-circle',
            acceptButtonStyleClass: 'p-button-danger p-button-text',
            acceptIcon: 'none',
            acceptLabel: 'SI, Devolver',
            rejectIcon: 'none',
            rejectButtonStyleClass: 'p-button-text',
            accept: () => {
                this.ontUserService.devolver(onuUser).subscribe((data) => {
                    // this.cargarOnus(onuUser.User.idUser);
                    let indice = this.listaONTSEmpleado.indexOf(onuUser);
                    this.listaONTSEmpleado.splice(indice, 1);
                });
            },
            reject: () => {},
        });
    }

    devolverProducto(productoEmpleado: ProductoEmpleado) {
        this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: `¿Está seguro que desea devolver el producto ${productoEmpleado.producto.nombreProducto}?`,
            header: 'Confirmar',
            icon: 'pi pi-info-circle',
            acceptButtonStyleClass: 'p-button-danger p-button-text',
            acceptIcon: 'none',
            acceptLabel: 'SI, Devolver',
            rejectIcon: 'none',
            rejectButtonStyleClass: 'p-button-text',
            accept: () => {
                this.productoEmpleadoService.devolver(productoEmpleado).subscribe((data) => {
                    // this.cargarOnus(onuUser.User.idUser);
                    let indice = this.listaProductosEmpleado.indexOf(productoEmpleado);
                    this.listaProductosEmpleado.splice(indice, 1);
                });
            },
            reject: () => {},
        });
    }

    cargarOnus(empleado: any) {
        this.ontUserService
            .getByEstadoUser('DISPONIBLE', empleado)
            .subscribe((data) => {
                this.listaONTSEmpleado = data;
            });
    }
}
