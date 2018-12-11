import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalSearchService {
  searchFilterValue: any;
  constructor() { }
  setGlobalSearchFilterValue(value){
    this.searchFilterValue = value;
  }
}
