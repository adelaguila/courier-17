import { Component, Input } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { PrimengModule } from 'src/app/primeng/primeng.module';

@Component({
    selector: 'app-confirm',
    standalone: true,
    imports: [PrimengModule],
    templateUrl: './confirm.component.html',
    styleUrl: './confirm.component.scss',
})
export class ConfirmComponent {
    @Input() messageToShow: string = 'Are your sure?';

    constructor(
        private confirmationService: ConfirmationService,
        private messageService: MessageService,
        public ref: DynamicDialogRef,
    ) {}

    confirm1(event: Event) {
        this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: 'Are you sure that you want to proceed?',
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            acceptIcon: 'none',
            rejectIcon: 'none',
            rejectButtonStyleClass: 'p-button-text',
            accept: () => {
                this.ref.close('Yes');
            },
            reject: () => {
                this.ref.close('No');
            },
        });
    }
}
