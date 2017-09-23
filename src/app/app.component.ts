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
  data = null;
  filteredData = null;
  fullData = null;

  loading = false;
  total = 0;
  page = 1;
  limit = 25;

  constructor(private _http: Http) {
    this.getWagesByGender();
  }

  sortBy(column, order = 'asc') {
    if(!['title', 'femaleWages', 'maleWages'].includes(column)) return;

    let data = (this.filteredData) ? this.filteredData : this.fullData;

    if(column === 'title') {
      data = _.orderBy(this.fullData, [8], [order]);
    } else {
      data.sort((a, b) => {
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

    this.getWagesData(data);
  }

  filterBy(type) {
    if(type === 'menMore') {
       this.filteredData = this.fullData.filter((d) => d[12] > d[9]);
    } else if(type === 'womenMore') {
      this.filteredData = this.fullData.filter((d) => d[9] > d[12]);
    }

    this.total = this.filteredData.length;
    this.page = 1;
    this.getWagesData(this.filteredData);
  }

  goToPage(n: number): void {
    this.page = n;
    this.getWagesData();
  }

  onNext(): void {
    if(this.page >= this.total / this.limit) return;
    this.page++;
    this.getWagesData();
  }

  onPrev(): void {
    if(this.page <= 1) return;
    this.page--;
    this.getWagesData();
  }

  getWagesData(data = this.fullData) {
    let s = (this.page - 1) * this.limit;
    this.data = data.slice(s, s+this.limit-1);
  }

  private getWagesByGender() {
    return this._http.get('https://data.seattle.gov/api/views/cf52-s8er/rows.json?api_key=SCC1c0Cove7ypmBeuf3dTX2WZOk6qEfCAki6MoNi')
                .map((res: Response) => res.json())
                .subscribe(data => {
                  this.fullData = data.data;
                  this.total = this.fullData.length || 0;
                  this.getWagesData();
                });
  }
}