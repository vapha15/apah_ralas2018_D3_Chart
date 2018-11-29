import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {IBuildings} from './IBuildings'
import {Observable} from 'rxjs';


@Injectable()
export class BuildingsService {

  private _urlString: string = "assets/buildings.json"
  constructor (private http: HttpClient){ }
 



  

    public getBuildings(){
    return this.http.get<IBuildings[]>(this._urlString)
  }
}
