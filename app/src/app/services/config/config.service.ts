import { DOCUMENT } from '@angular/common';
import { environment } from 'src/environments/environment';
import { Meta, Title } from '@angular/platform-browser';
import { BehaviorSubject } from 'rxjs';
import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})

export class ConfigService {

    public application: BehaviorSubject<Application> = new BehaviorSubject(APPLICATION);

    constructor(private http: HttpClient, private title: Title, private meta: Meta, @Inject(DOCUMENT) private document: Document) {};

    public async load() {
        const options = {
            'headers': new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };

        return await this.http.put(environment.auth + '/clients/load', {
            'hostname': window.location.hostname
        }, options)
        .toPromise()
        .then((response: any) => {
            this.application.next({
                'theme': {
                    'color':        response.theme.color,
                    'background':   response.theme.background
                },
                'name':     response.name,
                'icon':     response.icon,
                'favicon':  response.favicon
            });
            // environment.scopes          = response.scopes;
            environment.appName         = response.name;
            environment.appId    = response.appId;

            this.title.setTitle(response.name);

            if (typeof(response.theme) != "undefined") {
                this.meta.updateTag({'name': 'theme-color', 'content': response.theme.background});
                let style       = this.document.createElement('style');
                style.type      = 'text/css';
                style.innerText = theme_default.split('FONT_COLOR').join(response.theme.color).split('BACKGROUND_COLOR').join(response.theme.background);
                this.document.body.appendChild(style);    
            };
            return {
                'ok':     true,
                'result': response
            };
        })
        .catch(error => {
            return {
                'ok':     false,
                'result': error
            };
        });
    };

}

export const APPLICATION = {
    'theme': {
        'color':        '#FFFFFF',
        'background':   '#3860AD'
    },
    'name':     'OpenThings',
    'icon':     './assets/icons/icon-512x512.png',
    'favicon':  './favicon.ico',
}

export interface Application {
    'theme': {
        'color':        string;
        'background':   string;
    };
    'name':     string;
    'icon':     string;
    'favicon':  string;
}

const theme_default = `
    mat-toolbar {
        color:              FONT_COLOR !important;
        background-color:   BACKGROUND_COLOR !important;
        button.mat-icon-button.mat-primary {
            color: FONT_COLOR !important;
        }
    }
    mat-list mat-list-item.active,
    mat-list mat-list-item:hover {
        color: BACKGROUND_COLOR !important;
    }
    .small .active {
        color:              FONT_COLOR !important;
        background-color:   BACKGROUND_COLOR !important;
    }
    button.mat-icon-button.mat-primary {
        color: BACKGROUND_COLOR !important;
    }
    button.mat-flat-button.mat-primary {
        color:              FONT_COLOR !important;
        background-color:   BACKGROUND_COLOR !important;
    }
    button.mat-stroked-button.mat-primary {
        color: BACKGROUND_COLOR !important;
    }
`;