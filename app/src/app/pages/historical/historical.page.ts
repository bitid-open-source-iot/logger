import * as moment from 'moment';
import { ngxCsv } from 'ngx-csv/ngx-csv';
import { ObjectId } from 'src/app/id';
import { MatDialog } from '@angular/material/dialog';
import { MenuService } from 'src/app/services/menu/menu.service';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { SearchComponent } from 'src/app/components/search/search.component';
import { MatTableDataSource } from '@angular/material/table';
import { OnInit, Component, OnDestroy, ViewChild } from '@angular/core';
import { FilterDataDialog } from './filter/filter.dialog';

@Component({
    selector:       'app-historical-page',
    styleUrls:      ['./historical.page.scss'],
    templateUrl:    './historical.page.html'
})

export class HistoricalPage implements OnInit, OnDestroy {

    @ViewChild(SearchComponent, {'static': true}) private search: SearchComponent;

    constructor(public menu: MenuService, private dialog: MatDialog, private service: LoggerService) {};

    public to:              any;
    public from:            any;
    public sort:            any         = {
        'key':      'date',
        'reverse':  false
    };
    public limit:           number      = 500;
    public table:           any         = new MatTableDataSource();
    public columns:         string[]    = [];
    public loading:         boolean;
    public loggerId:        string[]    = [];
    private subscriptions:  any         = {};

    private async list() {
        this.loading = true;

        let params = {
            'sort': {
                [this.sort.key]: (this.sort.reverse ? -1 : 1)
            },
            'filter': [
                'date',
                'data',
                'catagory'
            ],
            'to':       this.to,
            'from':     this.from,
            'limit':    this.limit,
            'loggerId': this.loggerId
        };

        if (params.loggerId.length == 0) {
            delete params.loggerId;
        };

        if (typeof(params.to) != "undefined" && params.to != null) {
            params.to = new Date(params.to);
            params.to.setHours(23);
            params.to.setMinutes(59);
            params.to.setSeconds(59);
            params.to = new Date(params.to);
        } else {
            delete params.to;
        };

        if (typeof(params.from) != "undefined" && params.from != null) {
            params.from = new Date(params.from);
            params.from.setHours(0);
            params.from.setMinutes(0);
            params.from.setSeconds(0);
            params.from = new Date(params.from);
        } else {
            delete params.from;
        };

        const response = await this.service.historical(params);

        if (response.ok) {
            let data = response.result.map(row => {
                let tmp: any = {
                    'date':     moment(row.date).format('YYYY/MM/DD HH:mm:ss'),
                    'catagory': row.catagory
                };
                Object.keys(row.data).map(key => {
                    tmp[key] = row.data[key];
                });
                return tmp;
            });

            data = data.map(row => {
                Object.keys(row).map(key => {
                    if (!this.columns.includes(key)) {
                        this.columns.push(key);
                    };
                });
                let tmp: any = {};
                Object.keys(row).sort().map(key => {
                    tmp[key] = row[key];
                });
                return tmp;
            });

            this.columns = this.columns.sort();

            data = data.map(row => {
                this.columns.map(key => {
                    if (typeof(row[key]) == "undefined" || row[key] === null) {
                        row[key] = " ";
                    };
                });
                let tmp: any = {};
                Object.keys(row).sort().map(key => {
                    tmp[key] = row[key];
                });
                return tmp;
            });

            setTimeout(() => {
                this.table.data = data;
            }, 1000);
        } else {
            this.table.data = [];
        };

        this.loading = false;
    };

    public async export() {
        new ngxCsv(this.table.data, ObjectId(), { 
            'headers':    this.columns,
            'showLabels': true
        });
    };

    public async OpenFilter() {
        const dialog = await this.dialog.open(FilterDataDialog, {
            'data': {
                'to':       this.to,
                'from':     this.from,
                'sort':     this.sort,
                'limit':    this.limit,
                'loggerId': this.loggerId
            },
            'panelClass':   'filter-data-dialog',
            'disableClose': true
        });

        await dialog.afterClosed().subscribe(async result => {
            if (result) {
                if (typeof(result.to) != "undefined") {
                    this.to = result.to;
                } else {
                    delete this.to;
                };
                if (typeof(result.from) != "undefined") {
                    this.from = result.from;
                } else {
                    delete this.from;
                };
                this.sort       = result.sort;
                this.limit      = result.limit;
                this.loggerId   = result.loggerId;

                this.list();
            };
        });
    };

    ngOnInit(): void {
        this.list();

        this.subscriptions.search = this.search.change.subscribe(filter => {
            this.table.filter = filter;
        });
    };

    ngOnDestroy(): void {
        this.subscriptions.search.unsubscribe();
    };

}