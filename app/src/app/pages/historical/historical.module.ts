import { NgModule } from '@angular/core';
import { SearchModule } from 'src/app/components/search/search.module';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { HistoricalPage } from './historical.page';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { OrderPipeModule } from 'src/app/pipes/order/order.module';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FilterDataDialog } from './filter/filter.dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { HistoricalRoutingModule } from './historical-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
    imports: [
        FormsModule,
        CommonModule,
        SearchModule,
        MatIconModule,
        MatInputModule,
        MatTableModule,
        OrderPipeModule,
        MatButtonModule,
        MatSelectModule,
        MatDialogModule,
        MatToolbarModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        MatProgressBarModule,
        HistoricalRoutingModule
    ],
    declarations: [
        HistoricalPage,
        FilterDataDialog
    ]
})

export class HistoricalModule {}