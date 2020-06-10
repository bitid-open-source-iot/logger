import { User } from 'src/app/interfaces/user';
import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/services/api/api.service';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})

export class LoggerService {

    constructor(private api: ApiService) {};

    public async add(params) {
        return await this.api.post(environment.logger, '/api/logger/add', params);
    };

    public async get(params) {
        return await this.api.post(environment.logger, '/api/logger/get', params);
    };

    public async list(params) {
        return await this.api.post(environment.logger, '/api/logger/list', params);
    };

    public async share(params) {
        return await this.api.post(environment.logger, '/api/logger/share', params);
    };

    public async update(params) {
        return await this.api.post(environment.logger, '/api/logger/update', params);
    };

    public async delete(params) {
        return await this.api.post(environment.logger, '/api/logger/delete', params);
    };

    public async historical(params) {
        return await this.api.post(environment.logger, '/api/logger/historical', params);
    };

    public async unsubscribe(params) {
        return await this.api.post(environment.logger, '/api/logger/unsubscribe', params);
    };

    public async updatesubscriber(params) {
        return await this.api.post(environment.logger, '/api/logger/updatesubscriber', params);
    };

}

export interface Logger {
    'whitelist'?: {
        'hosts':    string[];
        'enabled':  boolean;
    };
    'role'?:                number;
    'users'?:               User[];
    'loggerId'?:            string;
    'description'?:         string;
    'organizationOnly'?:    number;
}