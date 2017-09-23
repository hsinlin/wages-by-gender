import { Component } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map'
import * as _ from "lodash";

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

    if(column === 'title') {
      this.data = _.orderBy(this.data, [8], [order]);
    } else {
      this.data.sort((a, b) => {
        let index = 0, diff = 0;
        if(column === 'femaleWages') {
          index = 9;
        } else if (column === 'maleWages') {
          index = 12;
        }

        diff = a[index] - b[index];

        return (order === 'asc') ? diff : -diff;
      });
    }
  }

  private getWagesByGender() {
    return this._http.get('https://data.seattle.gov/api/views/cf52-s8er/rows.json?api_key=SCC1c0Cove7ypmBeuf3dTX2WZOk6qEfCAki6MoNi')
                .map((res: Response) => res.json())
                .subscribe(data => {
                  this.data = data.data;
                });
  }
}
