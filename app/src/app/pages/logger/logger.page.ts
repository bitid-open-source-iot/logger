import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MenuService } from 'src/app/services/menu/menu.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import { ShareComponent } from 'src/app/components/share/share.component';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { DeleteComponent } from 'src/app/components/delete/delete.component';
import { SearchComponent } from 'src/app/components/search/search.component';
import { MatTableDataSource } from '@angular/material/table';
import { LocalstorageService } from 'src/app/services/localstorage/localstorage.service';
import { SubscribersComponent } from 'src/app/components/subscribers/subscribers.component';
import { UnsubscribeComponent } from 'src/app/components/unsubscribe/unsubscribe.component';
import { BottomSheetComponent } from 'src/app/components/bottom-sheet/bottom-sheet.component';
import { Logger, LoggerService } from 'src/app/services/logger/logger.service';
import { OnInit, Component, OnDestroy, ViewChild } from '@angular/core';

@Component({
    selector:       'app-logger-page',
    styleUrls:      ['./logger.page.scss'],
    templateUrl:    './logger.page.html'
})

export class LoggerPage implements OnInit, OnDestroy {

    @ViewChild(SearchComponent, {'static': true}) private search: SearchComponent;

    constructor(public menu: MenuService, private toast: ToastService, private sheet: MatBottomSheet, private dialog: MatDialog, private router: Router, private service: LoggerService, private localstorage: LocalstorageService) {};

    public sort:            any         = {
        'key':      'description',
        'reverse':  false
    };
    public logger:          any         = new MatTableDataSource();
    public columns:         string[]    = ['id', 'description'];
    public loading:         boolean;
    private subscriptions:  any         = {};

    private async list() {
        this.loading = true;

        const response = await this.service.list({
            'sort': {
                [this.sort.key]: (this.sort.reverse ? -1 : 1)
            },
            'filter': [
                'role',
                'loggerId',
                'description'
            ]
        });

        this.loading = false;

        if (response.ok) {
            this.logger.data = response.result;
        } else {
            this.logger.data = [];
        };
    };

    public async options(logger: Logger) {
        const sheet = await this.sheet.open(BottomSheetComponent, {
            'data': {
                'role':     logger.role,
                'title':    logger.description,
                'options': [
                    {
                        'icon':     'create',
                        'title':    'Edit',
                        'disabled': [0, 1],
                        'optionId': 0
                    },
                    {
                        'icon':     'file_copy',
                        'title':    'Copy',
                        'disabled': [0, 1, 2],
                        'optionId': 1
                    },
                    {
                        'icon':     'share',
                        'title':    'Share',
                        'disabled': [0, 1, 2, 3],
                        'optionId': 2
                    },
                    {
                        'icon':     'people',
                        'title':    'Subscribers',
                        'disabled': [0, 1, 2, 3],
                        'optionId': 3
                    },
                    {
                        'icon':     'delete',
                        'title':    'Delete',
                        'disabled': [0, 1, 2, 3, 4],
                        'optionId': 4
                    },
                    {
                        'icon':     'remove',
                        'title':    'Unsubscribe',
                        'disabled': [5],
                        'optionId': 5
                    }
                ]
            }
        });

        await sheet.afterDismissed().subscribe(async optionId => {
            if (typeof(optionId) !== "undefined") {
                switch(optionId) {
                    case(0):
                        this.router.navigate(['/logger', 'update', logger.loggerId]);
                        break;
                    case(1):
                        this.router.navigate(['/logger', 'copy', logger.loggerId]);
                        break;
                    case(2):
                        const share = await this.dialog.open(ShareComponent, {
                            'panelClass':   'share-dialog',
                            'disableClose': true
                        });

                        await share.afterClosed().subscribe(async user => {
                            if (user) {
                                this.loading = true;

                                const response = await this.service.share({
                                    'role':     user.role,
                                    'email':    user.email,
                                    'loggerId': logger.loggerId
                                });

                                this.loading = false;

                                if (response.ok) {
                                    this.toast.success('user was shared to logger!');
                                } else {
                                    this.toast.error('issue sharing user to logger!');
                                };
                            };
                        });
                        break;
                    case(3):
                        await this.dialog.open(SubscribersComponent, {
                            'data': {
                                'id':       logger.loggerId,
                                'type':     'logger',
                                'service':  this.service
                            },
                            'panelClass':   'subscribers-dialog',
                            'disableClose': true
                        });
                        break;
                    case(4):
                        const remove = await this.dialog.open(DeleteComponent, {
                            'panelClass':   'delete-dialog',
                            'disableClose': true
                        });

                        await remove.afterClosed().subscribe(async user => {
                            if (user) {
                                this.loading = true;

                                const response = await this.service.delete({
                                    'loggerId': logger.loggerId
                                });

                                this.loading = false;

                                if (response.ok) {
                                    this.toast.success('logger was deleted!');
                                    for (let i = 0; i < this.logger.data.length; i++) {
                                        if (this.logger.data[i].loggerId == logger.loggerId) {
                                            this.logger.data.splice(i, 1);
                                            break;
                                        };
                                    };
                                    this.logger.data = JSON.parse(JSON.stringify(this.logger.data));
                                } else {
                                    this.toast.error('issue deleting logger!');
                                };
                            };
                        });
                        break;
                    case(5):
                        const unsubscribe = await this.dialog.open(UnsubscribeComponent, {
                            'panelClass':   'unsubscribe-dialog',
                            'disableClose': true
                        });

                        await unsubscribe.afterClosed().subscribe(async user => {
                            if (user) {
                                this.loading = true;

                                const response = await this.service.unsubscribe({
                                    'email':    this.localstorage.get('email'),
                                    'loggerId': logger.loggerId
                                });

                                this.loading = false;

                                if (response.ok) {
                                    this.toast.success('you were unsubscribed from logger!');
                                    for (let i = 0; i < this.logger.data.length; i++) {
                                        if (this.logger.data[i].loggerId == logger.loggerId) {
                                            this.logger.data.splice(i, 1);
                                            break;
                                        };
                                    };
                                    this.logger.data = JSON.parse(JSON.stringify(this.logger.data));
                                } else {
                                    this.toast.error('issue unsubscribing from logger!');
                                };
                            };
                        });
                        break;
                };
            };
        });
    };

    ngOnInit(): void {
        this.list();

        this.subscriptions.search = this.search.change.subscribe(filter => {
            this.logger.filter = filter;
        });
    };

    ngOnDestroy(): void {
        this.subscriptions.search.unsubscribe();
    };

}