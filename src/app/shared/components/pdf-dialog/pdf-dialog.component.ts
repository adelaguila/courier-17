import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PrimengModule } from 'src/app/primeng/primeng.module';

@Component({
  selector: 'app-pdf-dialog',
  templateUrl: './pdf-dialog.component.html',
  styleUrls: ['./pdf-dialog.component.scss'],
  standalone: true,
    imports: [
        PrimengModule,
        PdfViewerModule,
        NgIf,
    ],
    providers: [DialogService, MessageService],
})
export class PdfDialogComponent implements OnInit {

    pdfSrc: string;

    constructor(
        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig,
        private messageService: MessageService
    ){}
    ngOnInit(): void {
        if (this.config.data) {
            this.pdfSrc = window.URL.createObjectURL(this.config.data.pdf);
        }

    }

}
