import { Component, OnInit } from '@angular/core';
import {
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Banco } from 'src/app/admin/models/banco';
import { CuentaBancaria } from 'src/app/admin/models/cuenta-bancaria';
import { Moneda } from 'src/app/admin/models/moneda';
import { BancoService } from 'src/app/admin/services/banco.service';
import { CuentaBancariaService } from 'src/app/admin/services/cuenta-bancaria.service';
import { MonedaService } from 'src/app/admin/services/moneda.service';



import { PrimengModule } from 'src/app/primeng/primeng.module';

@Component({
    selector: 'app-cuenta-bancaria-form',
    standalone: true,
    imports: [PrimengModule, ReactiveFormsModule],
    templateUrl: './cuenta-bancaria-form.component.html',
    styleUrl: './cuenta-bancaria-form.component.scss',
})
export class CuentaBancariaFormComponent implements OnInit {
    cuentaBancaria: CuentaBancaria;
    form: FormGroup;
    title: string = '';
    submitted = false;

    readOnlyID: boolean = false;
    isEdit: boolean = false;

    bancos: Banco[] | undefined;
    monedas: Moneda[] | undefined;

    constructor(
        private cuentaBancariaService: CuentaBancariaService,
        private bancoService: BancoService,
        private monedaService: MonedaService,
        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig,
        private messageService: MessageService
    ) {

        if (this.config.data) {
            this.title = 'EDITAR CUENTA BANCARIA';
            this.cuentaBancaria = this.config.data;
            this.readOnlyID = true;
            this.isEdit = true;

        } else {
            this.title = 'NUEVO CUENTA BANCARIA';
            this.cuentaBancaria = new CuentaBancaria();
            this.readOnlyID = false;
            this.isEdit = false;
        }
    }
    ngOnInit(): void {

        this.bancoService.findAll().subscribe((data) => (this.bancos = data));
        this.monedaService.findAll().subscribe((data) => (this.monedas = data));

        this.form = new FormGroup({
            numeroCuenta: new FormControl(this.cuentaBancaria?.numeroCuenta),
            banco: new FormControl(this.cuentaBancaria?.banco, [
                Validators.required,
            ]),
            moneda: new FormControl(this.cuentaBancaria?.moneda, [
                Validators.required,

            ]),
            descripcion: new FormControl(this.cuentaBancaria?.descripcion, [
                Validators.required,
                Validators.minLength(2),
                Validators.maxLength(100),
            ]),
            cci: new FormControl(this.cuentaBancaria?.cci),
            saldoInicial: new FormControl(this.cuentaBancaria?.saldoInicial),
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

        const values = this.form.value;
        const recordId = values.numeroCuenta;

        if (this.isEdit) {
            this.cuentaBancariaService.update(recordId, values).subscribe((data) => {
                this.cuentaBancariaService.setCuentaBancariaChange(data);
                this.cuentaBancariaService.setMessageChange({
                    key: 'tc',
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Datos actualizados correctamente',
                    life: 3000,
                });
            });
        } else {
            this.cuentaBancariaService.save(values).subscribe((data) => {
                this.cuentaBancariaService.setCuentaBancariaChange(data);
                this.cuentaBancariaService.setMessageChange({
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
