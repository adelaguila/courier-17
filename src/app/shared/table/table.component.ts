import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Table } from 'primeng/table';
import { MetaDataColumn } from 'src/app/interfaces/meta-data-column.interface';
import { PrimengModule } from 'src/app/primeng/primeng.module';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule, PrimengModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss'
})
export class TableComponent {
    @Input() metaData: MetaDataColumn[] = [];
    @Input() data: any = [];
    @Input() globalFilterFields: string[] = [];
    @Input() rows: number = 10;
    @Input() paginator: boolean = true;
    @Input() rowHover: boolean = true;
    @Input() showCurrentPageReport: boolean = true;
    @Input() rowsPerPageOptions: number[] = [10, 20, 30];
    @Input() title: string;

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal(
            (event.target as HTMLInputElement).value,
            'contains'
        );
    }
}
