/* --- MODULES --- */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

/* --- SERVICES --- */
import { AuthManager } from './services/account/account.manager';

const routes: Routes = [
    {
        'path':         'logger',
        'canActivate':  [AuthManager],
        'loadChildren': () => import('./pages/logger/logger.module').then(m => m.LoggerModule)
    },
    {
        'path':         'historical',
        'canActivate':  [AuthManager],
        'loadChildren': () => import('./pages/historical/historical.module').then(m => m.HistoricalModule)
    },
    {
        'path':         'signin',
        'loadChildren': () => import('./pages/signin/signin.module').then(m => m.SigninModule)
    },
    {
        'path':         '**',
        'redirectTo':   'logger'
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class AppRoutingModule {}