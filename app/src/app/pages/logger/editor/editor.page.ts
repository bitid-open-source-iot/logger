import { MatDialog } from '@angular/material/dialog';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { ToastService } from 'src/app/services/toast/toast.service';
import { LoggerService } from 'src/app/services/logger/logger.service';
import { FormErrorService } from 'src/app/services/form-error/form-error.service';
import { MatChipInputEvent } from '@angular/material/chips';
import { Router, ActivatedRoute} from '@angular/router';
import { OnInit, Component, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
    selector:       'app-logger-editor',
    styleUrls:      ['./editor.page.scss'],
    templateUrl:    './editor.page.html'
})

export class LoggerEditorPage implements OnInit, OnDestroy {

    readonly keycodes: number[] = [ENTER, COMMA];
    
    constructor(private route: ActivatedRoute, private toast: ToastService, private dialog: MatDialog, private router: Router, private service: LoggerService, private formerror: FormErrorService) {};

    public form:            FormGroup   = new FormGroup({
        'description':          new FormControl('', [Validators.required]),
        'whitelist_hosts':      new FormControl(''),
        'organizationOnly':     new FormControl(0, [Validators.required]),
        'whitelist_enabled':    new FormControl(false, [Validators.required])
    });
    public errors:          any         = {
        'description':          '',
        'organizationOnly':     '',
        'whitelist_enabled':    ''
    };
    public mode:            string;
    public hosts:           string[]    = [];
    public loading:         boolean;
    public loggerId:        string;
    private subscriptions:  any         = {};

    private async get() {
        this.loading = true;

        const response = await this.service.get({
            'filter': [
                'role',
                'loggerId',
                'whitelist',
                'description',
                'organizationOnly'
            ],
            'loggerId': this.loggerId
        });

        this.loading = false;

        if (response.ok) {
            if (response.result.role < 3) {
                this.router.navigate(['/logger']);
                this.toast.error('you do not have permission to access this logger!');
            };
            this.hosts = response.result.whitelist.hosts;
            this.form.controls['description'].setValue(response.result.description);
            this.form.controls['whitelist_hosts'].setValue("");
            this.form.controls['organizationOnly'].setValue(response.result.organizationOnly);
            this.form.controls['whitelist_enabled'].setValue(response.result.whitelist.enabled);
        } else {
            this.router.navigate(['/logger']);
            this.toast.error('issue loading logger!');
        };
    };

    public async submit() {
        this.loading = true;

        let mode = this.mode;

        if (mode == 'copy') {
            mode = 'add';
        };
        
        let params = JSON.parse(JSON.stringify({
            'whitelist': {
                'hosts':    this.hosts,
                'enabled':  this.form.value.whitelist_enabled
            },
            'loggerId':         this.loggerId,
            'description':      this.form.value.description,
            'organizationOnly': this.form.value.organizationOnly
        }));

        this.form.disable();

        const response = await this.service[mode](params);
        
        this.form.enable();

        this.loading = false;

        if (response.ok) {
            this.router.navigate(['/logger']);
            if (mode == 'add') {
                this.toast.success('logger was added!');
            } else {
                this.toast.success('logger was updated!');
            };
        } else {
            if (mode == 'add') {
                this.toast.success('there was an issue adding logger!');
            } else {
                this.toast.success('there was an issue updating logger!');
            };
        };
    };
    
    public async remove(host) {
        const index = this.hosts.indexOf(host);
    
        if (index >= 0) {
            this.hosts.splice(index, 1);
        };
    };

    public async add(event: MatChipInputEvent) {
        const input = event.input;
        const value = event.value;
        if ((value || '').trim()) {
            this.hosts.push(value.trim());
        };
        if (input) {
            input.value = '';
        };
    };

    ngOnInit(): void {
        this.subscriptions.form = this.form.valueChanges.subscribe(data => {
            this.errors = this.formerror.validateForm(this.form, this.errors, true);
        });

        this.subscriptions.route = this.route.params.subscribe(params => {
            this.mode   = params.mode;
            this.loggerId = params.loggerId;

            if (this.mode != 'add') {
                this.get();
            };
        });
    };

    ngOnDestroy(): void {
        this.subscriptions.form.unsubscribe();
        this.subscriptions.route.unsubscribe();
    };

}