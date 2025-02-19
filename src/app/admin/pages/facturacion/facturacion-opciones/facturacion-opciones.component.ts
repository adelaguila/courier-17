import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Facturacion } from 'src/app/admin/models/facturacion';
import { FacturacionService } from 'src/app/admin/services/facturacion.service';
import { PrimengModule } from 'src/app/primeng/primeng.module';

@Component({
  selector: 'app-facturacion-opciones',
  templateUrl: './facturacion-opciones.component.html',
  styleUrls: ['./facturacion-opciones.component.scss'],
  standalone: true,
    imports: [PrimengModule],
    providers: [DialogService, MessageService],
})
export class FacturacionOpcionesComponent {

    facturacion: Facturacion;

    constructor(
        private messageService: MessageService,
        public dialogService: DialogService,
        private facturacionService: FacturacionService,
        private router: Router,
        public config: DynamicDialogConfig,
        public ref: DynamicDialogRef,
    ){
        this.facturacion = this.config.data;
        console.log(this.facturacion);
    }

    generarNuevoComprobante(){
        this.router.navigate(['/pages/facturacion/nuevo']);
        this.close();
    }

    imprimirA4(){
        this.facturacionService.imprimir(this.facturacion.idFacturacion, "A4").subscribe((data) => {
            const url = window.URL.createObjectURL(data);
            window.open(
                url,
                "COMPROBANTE ELECTRONICO",
                "width=500,height=500,menubar=no"
            );
            this.close();
        });
    }

    imprimirTicket(){
        this.facturacionService.imprimir(this.facturacion.idFacturacion, "TICKET").subscribe((data) => {
            const url = window.URL.createObjectURL(data);
            window.open(
                url,
                "COMPROBANTE ELECTRONICO",
                "width=500,height=500,menubar=no"
            );
            this.close();
        });
    }

    irListado(){
        this.router.navigate(['/pages/facturacion/lista'])
        this.close();
    }

    close() {
        this.ref.close();
    }

}
