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

  filterType = '';
  showingMinGapInput = false;
  minGapPlaceholder = null;

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
      this.filteredData = _.orderBy(data, [8], [order]);
    } else {
      this.filteredData = data.sort((a, b) => {
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

    this.getWagesData();
  }

  showFilterInput(flag, type) {
    this.showingMinGapInput = !!flag;
    this.filterType = type;
    if(type === 'minGapValue') {
      this.minGapPlaceholder = 'show me only those jobs where the difference in pay is at least  ___ . (please enter a number)';
    } else if(type === 'minGapPercentage') {
      this.minGapPlaceholder = 'show me only those jobs where the difference in pay is at least  ___ % . (please enter a number)';
    }
  }

  filterBy(type, val = null) {
    if(type === 'menMore') {
      this.showingMinGapInput = false;
      this.filteredData = this.fullData.filter((d) => d[12] > d[9]);
    } else if(type === 'womenMore') {
      this.showingMinGapInput = false;
      this.filteredData = this.fullData.filter((d) => d[9] > d[12]);
    } else {
      if(val <= 0) {
        this.filteredData = [];
      } else if(type === 'minGapValue') {
        this.filteredData = this.fullData.filter((d) => {
          let diff = Math.abs(d[9] - d[12]);

          return d[9] !== null && d[12] !== null
            && diff > val;
        });
      } else if(type === 'minGapPercentage') {
        val = parseFloat(val) / 100.0;

        this.filteredData = this.fullData.filter((d) => {
          let diff = Math.abs(d[9] - d[12]);

          return d[9] !== null && d[12] !== null
            && diff / Math.min(d[9], d[12]) > val;
        });
      }
    }

    this.total = this.filteredData.length;
    this.page = 1;
    this.getWagesData();
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

  getWagesData() {
    let s = (this.page - 1) * this.limit,
        data = (this.filteredData) ? this.filteredData : this.fullData;

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