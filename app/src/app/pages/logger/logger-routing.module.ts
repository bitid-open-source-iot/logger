import { NgModule } from '@angular/core';
import { LoggerPage } from './logger.page';
import { LoggerEditorPage } from './editor/editor.page';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
    {
        'path':         '',
        'component':    LoggerPage
    },
    {
        'path':         ':mode',
        'component':    LoggerEditorPage
    },
    {
        'path':         ':mode/:loggerId',
        'component':    LoggerEditorPage
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class LoggerRoutingModule {}