import { DatePipe, NgIf } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { PrimengModule } from 'src/app/primeng/primeng.module';

import { FacturacionOpcionesComponent } from '../facturacion-opciones/facturacion-opciones.component';
import { Facturacion } from 'src/app/admin/models/facturacion';
import { Comprobante } from 'src/app/admin/models/comprobante';
import { FacturacionService } from 'src/app/admin/services/facturacion.service';
import { ComprobanteService } from 'src/app/admin/services/comprobante.service';

interface TipoNota {
    code: string;
    name: string;
}

@Component({
  selector: 'app-facturacion-nota-credito',
  templateUrl: './facturacion-nota-credito.component.html',
  styleUrls: ['./facturacion-nota-credito.component.scss'],
  standalone: true,
  imports: [PrimengModule, ReactiveFormsModule, RouterLink, NgIf],
  providers: [DialogService, MessageService],
})
export class FacturacionNotaCreditoComponent implements OnInit {

    facturacion!: Facturacion;

    today = new Date();
    fechaEmision: any;
    pipe = new DatePipe("en-US");
    tiposNotas: TipoNota[];
    form!: FormGroup;
    title: string = "Nota de Credito";

    series: Comprobante[] | undefined = [];
    seriesFiltrados: Comprobante[] | undefined = [];

    constructor(
        private facturacionService: FacturacionService,
        private comprobanteService: ComprobanteService,
        public ref: DynamicDialogRef,
        private cd: ChangeDetectorRef,
        public config: DynamicDialogConfig,
        private messageService: MessageService,
        public dialogService: DialogService,
    ){}

    ngOnInit(): void {
        if (this.config.data) {
            this.facturacion = this.config.data;
        }

        this.tiposNotas = [
            { code: "01", name: "Anulación de la Operación" },
        ];

        this.fechaEmision = this.pipe.transform(this.today, "YYYY-MM-dd");

        this.comprobanteService.findAll().subscribe((data: Comprobante[]) => {
            this.series = data;
            this.seriesFiltrados = this.series.filter(
                (serie) => serie.tipo === "07"
            );
        });

        this.form = new FormGroup({
            idFacturacion: new FormControl(0),
            fechaEmision: new FormControl(this.fechaEmision),
            documentoAfectado: new FormControl(this.facturacion.externalId),
            codigoTipoNota: new FormControl("01"),
            motivoNota: new FormControl("", [Validators.required]),
            serie: new FormControl(this.seriesFiltrados, Validators.required),
        });

        this.loadFormulario();
    }

    loadFormulario(){
        this.form = new FormGroup({
            idFacturacion: new FormControl(0),
            fechaEmision: new FormControl(this.fechaEmision),
            documentoAfectado: new FormControl(this.facturacion.externalId),
            codigoTipoNota: new FormControl("01"),
            motivoNota: new FormControl("", [Validators.required]),
            serie: new FormControl(this.seriesFiltrados, Validators.required),
        });
    }
    get f() {
        return this.form.controls;
    }


    operate(){

        const data: any = {
            "idFacturacion": 0,
            "fechaEmision": this.form.value["fechaEmision"],
            "serie": this.form.value["serie"],
            "documentoAfectado": this.form.value["documentoAfectado"],
            "codigoTipoNota": this.form.value["codigoTipoNota"]["code"],
            "motivoNota": this.form.value["motivoNota"],
        }

        this.facturacionService.notaCredito(data)
            .subscribe((data: Facturacion) => {

                if(data.idFacturacion > 0){
                    this.close();
                    this.dialogOpciones(data);

                }else{
                    this.messageService.add({
                        key: "tc",
                        severity: "error",
                        summary: "Error",
                        detail: "Algo salió mal, no se guardaron los cambios",
                        life: 3000,
                    });
                }
            });
    }

    dialogOpciones(facturacion: Facturacion) {
        this.ref = this.dialogService.open(FacturacionOpcionesComponent, {
            header: "Opciones",
            width: "600px",
            contentStyle: { overflow: "auto" },
            baseZIndex: 10000,
            maximizable: false,
            data: facturacion
        });

}

    close() {
        this.ref.close();
    }
}
