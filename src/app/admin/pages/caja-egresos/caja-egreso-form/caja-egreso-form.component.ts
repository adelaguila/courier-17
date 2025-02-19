import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { JwtHelperService } from '@auth0/angular-jwt';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CajaEgreso } from 'src/app/admin/models/caja-egreso';
import { TipoEgreso } from 'src/app/admin/models/tipo-egreso';
import { User } from 'src/app/admin/models/user';
import { CajaEgresoService } from 'src/app/admin/services/caja-egreso.service';
import { TipoEgresoService } from 'src/app/admin/services/tipo-egreso.service';
import { UserService } from 'src/app/admin/services/user.service';

import { PrimengModule } from 'src/app/primeng/primeng.module';
import { environment } from 'src/environments/environment.development';

@Component({
    selector: 'app-caja-egreso-form',
    standalone: true,
    imports: [PrimengModule, ReactiveFormsModule],
    templateUrl: './caja-egreso-form.component.html',
    styleUrl: './caja-egreso-form.component.scss',
})
export class CajaEgresoFormComponent implements OnInit {
    cajaEgreso: CajaEgreso;
    form: FormGroup;
    title: string = '';
    submitted = false;

    readOnlyID: boolean = false;
    isEdit: boolean = false;

    today = new Date();
    fecha: any;
    pipe = new DatePipe('en-US');

    tiposEgresos: TipoEgreso[];

    userRegistro: User;

    constructor(
        private cajaEgresoService: CajaEgresoService,
        private tipoEgresoService: TipoEgresoService,
        private userService: UserService,

        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig,
        private messageService: MessageService
    ) {
        if (this.config.data) {
            this.title = 'EDITAR EGRESO';
            this.cajaEgreso = this.config.data;
            this.readOnlyID = true;
            this.isEdit = true;

            this.fecha = this.config.data.fecha;
        } else {
            this.title = 'NUEVO EGRESO';
            this.cajaEgreso = new CajaEgreso();
            this.readOnlyID = false;
            this.isEdit = false;
        }
    }
    ngOnInit(): void {
        this.fecha = this.pipe.transform(this.today, 'YYYY-MM-dd');

        const helper = new JwtHelperService();
                const decodeToken = helper.decodeToken(
                    localStorage.getItem(environment.TOKEN_NAME)
                );
                this.userService
                    .findOneByUsername(decodeToken.sub)
                    .subscribe((user) => {
                        this.userRegistro = user;
                    });

        this.tipoEgresoService
                    .findAll()
                    .subscribe(
                        (data: TipoEgreso[]) => (this.tiposEgresos = data)
                    );

        this.form = new FormGroup({
            idCajaEgreso: new FormControl(this.cajaEgreso?.idCajaEgreso),
            tipoEgreso: new FormControl(this.cajaEgreso?.tipoEgreso, [Validators.required]),
            fecha: new FormControl(this.fecha, [Validators.required]),
            documento: new FormControl(this.cajaEgreso?.documento, [
                Validators.required,
            ]),
            proveedor: new FormControl(this.cajaEgreso?.proveedor, [
                Validators.required,
            ]),
            glosa: new FormControl(this.cajaEgreso?.glosa, [
                Validators.required,
            ]),
            // userCobrador: new FormControl("", [Validators.required]),
            importe: new FormControl(this.cajaEgreso.importe, [
                Validators.required,
            ]),

        });
    }
    get f() {
        return this.form.controls;
    }

    operate() {
        if (this.form.invalid) {
            this.messageService.add({
                key: 'tc',
                severity: 'error',
                summary: 'Error',
                detail: 'El formulario es inválido',
                life: 3000,
            });

            return;
        }

        const values: CajaEgreso =  { ...this.form.value };
        const recordId = values.idCajaEgreso;
        values.userRegistro = this.userRegistro.idUser;

        if (this.isEdit) {
            this.cajaEgresoService
                .update(recordId, values)
                .subscribe((data) => {
                    this.cajaEgresoService.setCajaEgresoChange(data);
                    this.cajaEgresoService.setMessageChange({
                        key: 'tc',
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Datos actualizados correctamente',
                        life: 3000,
                    });
                });
        } else {

            this.cajaEgresoService.save(values).subscribe((data) => {
                this.cajaEgresoService.setCajaEgresoChange(data);
                this.cajaEgresoService.setMessageChange({
                    key: 'tc',
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Datos creados correctamente',
                    life: 3000,
                });
            });
        }

        this.close();
    }

    close() {
        this.ref.close();
    }
}
