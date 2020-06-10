import { LoggerService } from 'src/app/services/logger/logger.service';
import { FormErrorService } from 'src/app/services/form-error/form-error.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Inject, OnInit, Component, OnDestroy } from '@angular/core';

@Component({
    selector:       'app-filter-data',
    styleUrls:      ['./filter.dialog.scss'],
    templateUrl:    './filter.dialog.html'
})

export class FilterDataDialog implements OnInit, OnDestroy {

    constructor(private dialog: MatDialogRef<FilterDataDialog>, @Inject(MAT_DIALOG_DATA) private data: FilterProperties, private formerror: FormErrorService, private service: LoggerService) {};

    public form:            FormGroup   = new FormGroup({
        'to':	    new FormControl(this.data.to),
        'from':	    new FormControl(this.data.from),
        'sort':		new FormControl(this.data.sort.key),
        'limit':	new FormControl(this.data.limit, [Validators.required, Validators.min(1), Validators.max(100000)]),
        'reverse':	new FormControl(this.data.sort.reverse),
        'loggerId':	new FormControl(this.data.loggerId)
    });
    public sort:            any[]       = [
        {
            'value': 'date',
            'title': 'Date'
        }
    ];
    public errors:          any         = {
        'sort':     '',
        'limit':    '',
        'reverse':  '',
        'loggerId': ''
    };
    public status:          any[]       = [];
    public logger:         any[]       = [];
    public loading:         boolean;
    private subscriptions:  any         = {};

    public close() {
        this.dialog.close(false);
    };

    public submit() {
        this.dialog.close({
            'sort': {
                'key':      this.form.value.sort,
                'reverse':  this.form.value.reverse
            },
            'to':       this.form.value.to,
            'from':     this.form.value.from,
            'limit':    this.form.value.limit,
            'loggerId': this.form.value.loggerId
        });
    };
    
    private async load() {
        this.loading = true;

        const response = await this.service.list({
            'filter': [
                'loggerId',
                'description'
            ]
        });

        if (response.ok) {
            this.logger = response.result;
        } else {
            this.logger = [];
        };
        
        this.loading = false;
    };

    public reverse(event: MouseEvent) {
        event.stopPropagation();
        this.form.controls['reverse'].setValue(!this.form.value.reverse);
    };

    ngOnInit(): void {
        this.load();

        this.subscriptions.form = this.form.valueChanges.subscribe(data => {
            this.errors = this.formerror.validateForm(this.form, this.errors, true);
        });
    };

    ngOnDestroy(): void {
        this.subscriptions.form.unsubscribe();
    };

}

interface FilterProperties {
    'sort': {
        'key':      string;
        'reverse':  boolean;
    };
    'to':       Date;
    'from':     Date;
    'limit':    number;
    'loggerId': string;
}