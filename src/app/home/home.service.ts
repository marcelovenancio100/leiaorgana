import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class HomeService {
    private url: string = "https://www.reddit.com/new.json";

    constructor(private httpClient : HttpClient) {}

    getFeeds(): Observable<any> {
        return this.httpClient.get<any>(this.url);
    }

    getNewFeeds(name: string): Observable<any> {
        return this.httpClient.get<any>(this.url + '?before=' + name);
    }

    getOldFeeds(name: string): Observable<any> {
        return this.httpClient.get<any>(this.url + '?after=' + name);
    }
}