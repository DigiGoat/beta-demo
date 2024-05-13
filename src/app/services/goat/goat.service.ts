import { Observable } from 'rxjs';
import { retry } from 'rxjs/operators';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class GoatService {
  constructor(private http: HttpClient) { }
  private _does: Goat[] = [];
  public does = new Observable<Goat[]>(observer => {
    if (this._does.length) {
      console.debug('Loaded Does From Cache', this._does);
      observer.next(this._does);
    } else {
      this.http.get<Goat[]>('./assets/resources/does.json')
        .pipe(
          retry(3), // retry a failed request up to 3 times
        )
        .subscribe({
          next: data => {
            this._does = data;
            console.debug('Loaded Does From Server', data);
            observer.next(data);
          },
          error: err => {
            if (err.status === 0) {
              // A client-side or network error occurred. Handle it accordingly.
              console.warn('An error occurred:', err.error);
            } else {
              // The backend returned an unsuccessful response code.
              // The response body may contain clues as to what went wrong.
              console.warn(
                `Backend returned code ${err.status}, body was: `, err.error);
            }
            // Return an observable with a user-facing error message.
            observer.error(err);
          }
        });
    }
  });
  private _bucks: Goat[] = [];
  public bucks = new Observable<Goat[]>(observer => {
    if (this._bucks.length) {
      console.debug('Loaded Bucks From Cache', this._bucks);
      observer.next(this._bucks);
    } else {
      this.http.get<Goat[]>('./assets/resources/bucks.json')
        .pipe(
          retry(3), // retry a failed request up to 3 times
        )
        .subscribe({
          next: data => {
            this._bucks = data;
            console.debug('Loaded Bucks From Server', data);
            observer.next(data);
          },
          error: err => {
            if (err.status === 0) {
              // A client-side or network error occurred. Handle it accordingly.
              console.warn('An error occurred:', err.error);
            } else {
              // The backend returned an unsuccessful response code.
              // The response body may contain clues as to what went wrong.
              console.warn(
                `Backend returned code ${err.status}, body was: `, err.error);
            }
            // Return an observable with a user-facing error message.
            observer.error(err);
          }
        });
    }
  });
}
//export type Goat = (OwnedGoats['result']['items'][number] & { nickname: string; description: string; awards: Awards['result']['items']; colorAndMarking: string; /*obtained?: string;*/ });
export type Goat = {
  nickname?: string;
  name: string;
  description?: string;
  normalizeId: string;
  dateOfBirth: string;
  colorAndMarking?: string;
  animalTattoo?: [{ tattoo?: string; tattooLocation?: { name?: string; }; }, { tattoo?: string; tattooLocation?: { name?: string; }; }];
};
export const Goat = {
  nickname: 'Your Goats Farm Name',
  name: 'YOUR GOATS ADGA NAME',
  description: 'A quick description about your goat',
  normalizeId: 'PD12345',
};
