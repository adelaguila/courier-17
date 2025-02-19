import { DatePipe, NgIf } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { MessageService } from 'primeng/api';
import {
    DialogService,
    DynamicDialogConfig,
    DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { Abonado } from 'src/app/admin/models/abonado';
import { AlmacenMovimiento } from 'src/app/admin/models/almacen-movimiento';
import { AlmacenMovimientoItem } from 'src/app/admin/models/almacen-movimiento-item';
import { Ont } from 'src/app/admin/models/ont';
import { Orden } from 'src/app/admin/models/orden';
import { User } from 'src/app/admin/models/user';
import { AbonadoService } from 'src/app/admin/services/abonado.service';
import { AlmacenMovimientoService } from 'src/app/admin/services/almacen-movimiento.service';
import { OntService } from 'src/app/admin/services/ont.service';
import { OrdenService } from 'src/app/admin/services/orden.service';
import { UserService } from 'src/app/admin/services/user.service';
import { PrimengModule } from 'src/app/primeng/primeng.module';
import { environment } from 'src/environments/environment.development';

@Component({
    selector: 'app-asignar-onu-dialog',
    templateUrl: './asignar-onu-dialog.component.html',
    styleUrls: ['./asignar-onu-dialog.component.scss'],
    standalone: true,
    imports: [PrimengModule, ReactiveFormsModule, NgIf],
    providers: [DialogService, MessageService],
})
export class AsignarOnuDialogComponent implements OnInit {
    abonado!: Abonado;
    form!: FormGroup;
    title: string = 'Asignar ONU';
    submitted = false;
    usuarios: User[] | undefined;
    ontsDisponibles: Ont[];
    today = new Date();
    fecha: any;
    pipe = new DatePipe('en-US');
    nombreTipoOrden: string;
    nombreTercero: string;
    direccion: string;
    userRegistro: User;
    devuelto: any;

    constructor(
        private ontService: OntService,
        private userService: UserService,
        private almacenMovimientoService: AlmacenMovimientoService,
        private abonadoService: AbonadoService,
        public ref: DynamicDialogRef,
        private cd: ChangeDetectorRef,
        public config: DynamicDialogConfig,
        private messageService: MessageService
    ) {}
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

        this.ontService
            .getByEstado('DISPONIBLE')
            .subscribe((data) => (this.ontsDisponibles = data));

        if (this.config.data) {
            this.abonado = this.config.data;
        }

        this.fecha = this.pipe.transform(this.today, 'YYYY-MM-dd');

        this.form = new FormGroup({
            ont: new FormControl([Validators.required]),
            fecha: new FormControl(this.fecha, [Validators.required]),
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

        console.log(this.form.value);

        let items: AlmacenMovimientoItem[] = [];

        const item: AlmacenMovimientoItem = new AlmacenMovimientoItem();

        item.producto = this.form.value['ont'].producto;
        item.cantidad = 1;
        item.precioUnitario = 0;
        item.series = this.form.value['ont'].serie;

        items.push(item);

        const almacenNew: AlmacenMovimiento = new AlmacenMovimiento();
        almacenNew.idAlmacenMovimiento = 0;
        almacenNew.tecnico = this.userRegistro;
        almacenNew.clienteProveedor = this.userRegistro.name;
        almacenNew.fecha = this.form.value['fecha'];
        almacenNew.documento = 'SD';
        almacenNew.referencia = 'ASIGNACION DIRECTA DE ONU';
        almacenNew.tipoMovimiento = 'SALIDA';
        almacenNew.items = items;

        this.almacenMovimientoService
            .asignadasOntDirecta(almacenNew, this.abonado.idAbonado)
            .subscribe((data: AlmacenMovimiento) => {
                this.abonadoService.setAbonadoChange(data);
                this.abonadoService.setMessageChange({
                    key: "tc",
                    severity: 'success',
                    summary: 'Success',
                    detail: 'ONU asiganda con éxito',
                    life: 3000,
                });

                this.close();
            });
    }

    close() {
        this.ref.close();
    }
}
