import { Injectable, Output, EventEmitter} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalSearchService {
  searchFilterValue: any;
  @Output() globalSearch = new EventEmitter<Event>();
  constructor() { }

  globalSearchFunc(value){
    this.globalSearch.emit(value);
  }
}
