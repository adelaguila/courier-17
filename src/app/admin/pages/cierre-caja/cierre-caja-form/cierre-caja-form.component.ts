import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CierreCaja } from 'src/app/admin/models/cierre-caja';
import { CierreCajaDetalle } from 'src/app/admin/models/cierre-caja-detalle';

import { Servicio } from 'src/app/admin/models/servicio';
import { User } from 'src/app/admin/models/user';
import { CierreCajaService } from 'src/app/admin/services/cierre-caja.service';

import { ServicioService } from 'src/app/admin/services/servicio.service';
import { UserService } from 'src/app/admin/services/user.service';
import { PrimengModule } from 'src/app/primeng/primeng.module';
import { environment } from 'src/environments/environment.development';

@Component({
    selector: 'app-cierre-caja-form',
    standalone: true,
    imports: [PrimengModule, ReactiveFormsModule],
    templateUrl: './cierre-caja-form.component.html',
    styleUrl: './cierre-caja-form.component.scss',
})
export class CierreCajaFormComponent implements OnInit {
    cierreCaja: CierreCaja;
    form: FormGroup;
    formServicio!: FormGroup;
    title: string = '';
    isEdit!: boolean;
    submitted = false;

    cierreCajaDetalles: CierreCajaDetalle[] = [];
    readOnlyID: boolean = false;

    today = new Date();
    fecha: any;
    pipe = new DatePipe('en-US');
    userRegistro: User;
    detalles: any = [];
    constructor(
        private cierreCajaService: CierreCajaService,
        private userService: UserService,
        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {
        if (this.config.data) {
            this.title = 'EDITAR CIERRE CAJA';
            this.cierreCaja = this.config.data;
            this.readOnlyID = false;
            this.isEdit = true;
        } else {
            this.title = 'NUEVO CIERRE CAJA';
            this.cierreCaja = new CierreCaja();
            this.readOnlyID = false;
            this.isEdit = false;
        }
    }
    ngOnInit(): void {
        const helper = new JwtHelperService();
        const decodeToken = helper.decodeToken(
            localStorage.getItem(environment.TOKEN_NAME)
        );
        this.userService
            .findOneByUsername(decodeToken.sub)
            .subscribe((user) => {
                this.userRegistro = user;
            });

        this.fecha = this.pipe.transform(this.today, 'YYYY-MM-dd');

        this.form = new FormGroup({
            idCierreCaja: new FormControl(this.cierreCaja.idCierreCaja),
            fecha: new FormControl(this.fecha, [Validators.required]),
        });
    }
    get f() {
        return this.form.controls;
    }

    cargar() {
        const values = this.form.value;
        this.cierreCajaService
            .detallesCierreAbiertosFecha(values.fecha)
            .subscribe((data) => {
                this.detalles = data;
            });
    }
    operate() {
        if (this.form.invalid) {
            this.messageService.add({
                // key: 'tc',
                severity: 'error',
                summary: 'Error',
                detail: 'El formulario es inválido',
                life: 3000,
            });

            return;
        }

        const values = this.form.value;
        const recordId = values.idCierreCaja;

        this.cierreCaja = { ...values };
        this.cierreCaja.user = this.userRegistro;
        this.cierreCajaService.save(this.cierreCaja).subscribe((data) => {
            this.cierreCajaService.setCierreCajaChange(data);
            this.cierreCajaService.setMessageChange({
                key: 'tc',
                severity: 'success',
                summary: 'Success',
                detail: 'Datos creados correctamente',
                life: 3000,
            });
        });

        this.close();
    }

    close() {
        this.ref.close();
    }
}
