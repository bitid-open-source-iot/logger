import { NgModule } from '@angular/core';
import { HistoricalPage } from './historical.page';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
    {
        'path':         '',
        'component':    HistoricalPage
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class HistoricalRoutingModule {}