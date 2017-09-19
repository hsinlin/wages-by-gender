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

  private getWagesByGender() {
    return this._http.get('https://data.seattle.gov/api/views/cf52-s8er/rows.json?api_key=SCC1c0Cove7ypmBeuf3dTX2WZOk6qEfCAki6MoNi')
                .map((res: Response) => res.json())
                .subscribe(data => {
                  this.data = data;
                  console.log(this.data);
                });
  }
}
