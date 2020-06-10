import { NgModule } from '@angular/core';
import { LoggerPage } from './logger.page';
import { ShareModule } from 'src/app/components/share/share.module';
import { DeleteModule } from 'src/app/components/delete/delete.module';
import { CommonModule } from '@angular/common';
import { SearchModule } from 'src/app/components/search/search.module';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatChipsModule } from '@angular/material/chips';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { OrderPipeModule } from 'src/app/pipes/order/order.module';
import { MatToolbarModule } from '@angular/material/toolbar';
import { LoggerEditorPage } from './editor/editor.page';
import { BottomSheetModule } from 'src/app/components/bottom-sheet/bottom-sheet.module';
import { UnsubscribeModule } from 'src/app/components/unsubscribe/unsubscribe.module';
import { SubscribersModule } from 'src/app/components/subscribers/subscribers.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { LoggerRoutingModule } from './logger-routing.module';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
    imports: [
        FormsModule,
        ShareModule,
        CommonModule,
        DeleteModule,
        SearchModule,
        MatIconModule,
        MatMenuModule,
        MatInputModule,
        MatChipsModule,
        MatTableModule,
        MatSelectModule,
        MatDialogModule,
        MatButtonModule,
        OrderPipeModule,
        MatToolbarModule,
        SubscribersModule,
        UnsubscribeModule,
        BottomSheetModule,
        MatFormFieldModule,
        LoggerRoutingModule,
        ReactiveFormsModule,
        MatBottomSheetModule,
        MatProgressBarModule
    ],
    declarations: [
        LoggerPage,
        LoggerEditorPage
    ]
})

export class LoggerModule {}