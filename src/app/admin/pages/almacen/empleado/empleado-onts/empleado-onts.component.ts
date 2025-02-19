import { Component } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { PrimengModule } from 'src/app/primeng/primeng.module';

@Component({
  selector: 'app-empleado-onts',
  templateUrl: './empleado-onts.component.html',
  styleUrls: ['./empleado-onts.component.scss'],
  standalone: true,
  imports: [PrimengModule],
  providers: [MessageService, ConfirmationService, DialogService],
})
export class EmpleadoOntsComponent {

}
