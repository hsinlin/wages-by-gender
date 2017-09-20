import { Component } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  data: any = null;

  constructor(private _http: Http) {
    this.getWagesByGender();
  }

  public sortBy(column, order = 'asc') {
    if(!['title', 'femaleWages', 'maleWages'].includes(column)) return;
    console.info(order === 'desc')

    this.data.sort((a, b) => {
      let itemA, itemB;
      if(column === 'title') {
        if(order === 'desc') return a[8] < b[8];
        else return a[8] > b[8];
      } else if(column === 'femaleWages') {
        itemA = a[9];
        itemB = b[9];
      } else if (column === 'maleWages') {
        itemA = a[12];
        itemB = b[12];
      }

      if(order === 'desc') {
        return itemB - itemA;
      } else {
        return itemA - itemB;
      }
    });
  }

  private getWagesByGender() {
    return this._http.get('https://data.seattle.gov/api/views/cf52-s8er/rows.json?api_key=SCC1c0Cove7ypmBeuf3dTX2WZOk6qEfCAki6MoNi')
                .map((res: Response) => res.json())
                .subscribe(data => {
                  this.data = data.data;
                });
  }
}
