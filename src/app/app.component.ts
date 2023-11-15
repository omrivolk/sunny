import { Component, OnInit } from '@angular/core';
import { Router, NavigationStart } from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {

//   constructor(private router: Router) {
//   router.events.forEach((event) => {
//     if(event instanceof NavigationStart) {
//       if (event.navigationTrigger === 'popstate') {
//         console.log('back')
//       }
//     }
//   });
// }

  title = 'Sunny';

  countries =[]
  areas = []

  inputText = ''
  filtered_areas = []
  selectedCountry = null
  selectedArea = null

  shade_data = {}
  sort_type = 'shade'

  ngOnInit(): void {

    var url = `./assets/countries/countries_list.json`
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        this.countries = data;
      });

    // this.router.events.subscribe( e => {
    //   if(e instanceof NavigationStart) {
    //     console.log('Navigation type: ', e);
    //   }
    // })
    // const urlParams = new URLSearchParams(window.location.search);
    // if (urlParams.get('country')){
    //   var nameFromUrl = this.normName(urlParams.get('country'))
    //   for (var country of this.countries){
    //     if (nameFromUrl == this.normName(country.name)){
    //       this.selectedCountry = country
    //       this.filtered_areas = this.areas
    //     }
    //   }
    // }

  }
 
  getFilteredAreas(){
    this.filtered_areas = []
    for (var area of this.areas){
      if (this.isInArea(area)){
        this.filtered_areas.push(area)
      }
    }
  }

  isInArea(area){

    var str = this.inputText.toLowerCase()
    if (str == ''){
      return true
    }

    if (area.name.toLowerCase().includes(str)){
      return true
    }

    if (area.localName.toLowerCase().includes(str)){
      return true
    }

    return false
  }

  normName(s: string): string {
      s = s.trim();
      s = s.toLowerCase();
      s = s.split(' ').join('_');
      return s;
  }

  addQueryParam(key: string, value: string): void {
    // Get the current URL
    const currentUrl = new URL(window.location.href);

    // Add or update the query parameter
    currentUrl.searchParams.set(key, value);

    // Set the new URL
    // window.location.href = currentUrl.toString();
    // window.history.pushState({}, '', currentUrl.toString());

  }

  countryClicked(country){

    this.selectedCountry = country

    var n_country_name = this.normName(this.selectedCountry.name)

    this.addQueryParam('country',n_country_name)

    var url = `./assets/countries/${n_country_name}/areas_list.json`
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        this.areas = data;
        this.filtered_areas = this.areas
      });
    
  }

  areaClick(area_name){
    
    this.selectedArea = area_name
    var n_country_name = this.normName(this.selectedCountry.name)
    var n_area_name = this.normName(area_name)
    var url = `./assets/countries/${n_country_name}/${n_area_name}.json`
    fetch(url)
    .then((res) => res.json())
    .then((shadeData) => {
      this.shade_data = shadeData;
      (<HTMLInputElement>document.getElementById("datePicker")).value = '2023-02-21';
      this.dateChanged()
    });
  }

  sortBy(v){
        if (v == 'sector_name'){
            if (this.sort_type=='a_to_z'){
                this.sort_type = 'z_to_a'
            } else {
                this.sort_type = 'a_to_z'
            }
        } else if (v == 'shade'){
            if (this.sort_type=='shade'){
                this.sort_type = 'sun'
            } else {
                this.sort_type = 'shade'
            }
        } 
        this.dateChanged()
    }

    dateChanged(){


        var selectedDateValue = (<HTMLInputElement>document.getElementById("datePicker")).value;
        var selectedDate = new Date(selectedDateValue);
        // Extract the month and day of the month
        var month = selectedDate.getMonth() + 1; // Month is 0-based, so add 1
        var dayOfMonth = selectedDate.getDate();

        // Display the result
        var result = "Month: " + month + ", Day of Month: " + dayOfMonth;
        var day_shade_data = this.shade_data[month][dayOfMonth]
        var tz_offset = day_shade_data['day_shade_data']
        var times = day_shade_data['times']
        var n_hours = day_shade_data['n_hours']
        var min_hour = Math.floor(times[0])
        var max_hour =  Math.ceil(times[times.length-1])
        var table_rows = ''

        var svg_texts = ''
        for (var h = min_hour; h < max_hour+1; h += 2) {
          svg_texts+=`<text font-size="0.5" text-anchor="middle" x="${h}" y="0.9">
               ${h}
            </text>`
        }
        var th_svg = `<svg viewbox="${min_hour-1} 0 ${max_hour-min_hour+2} 1">
            ${svg_texts}
        </svg>`


        document.getElementById("time_line").innerHTML = th_svg

        var sortedKeys;
        if (this.sort_type == 'shade'){
            sortedKeys = Object.keys(day_shade_data['sectors']).sort(function(a, b) {
                return day_shade_data['sectors'][b].total_shade_hours - day_shade_data['sectors'][a].total_shade_hours;
            });
        } else if (this.sort_type == 'sun'){
            sortedKeys = Object.keys(day_shade_data['sectors']).sort(function(a, b) {
                return day_shade_data['sectors'][a].total_shade_hours - day_shade_data['sectors'][b].total_shade_hours;
            });
        } else if (this.sort_type == 'a_to_z'){
            sortedKeys = Object.keys(day_shade_data['sectors']).sort()
        } else if (this.sort_type == 'z_to_a'){
            sortedKeys = Object.keys(day_shade_data['sectors']).sort().reverse();
        }

        for (var sector_name of sortedKeys){
            var _shades = day_shade_data['sectors'][sector_name]['sector_shade_times']
            var points_str = `${max_hour.toFixed(2)},1 ${min_hour.toFixed(2)},1 ${_shades[0][0].toFixed(2)},${1-_shades[0][1].toFixed(2)} `

            for (var i = 0; i < _shades.length; i++) {

                if (i>0){
                    points_str += `${(_shades[i][0] - 0.04).toFixed(2)},${1-_shades[i - 1][1].toFixed(2)} `;
                }
                points_str += `${(_shades[i][0] + 0.04).toFixed(2)},${1-_shades[i][1].toFixed(2)} `;
            }
            points_str += `${max_hour.toFixed(2)},${1-_shades[_shades.length - 1][1].toFixed(2)} `;


            var polylines=''
            for (var h = min_hour + 2; h < max_hour; h += 2) {
              polylines+=`<polyline points="${h},1 ${h},0" fill="none" stroke="white" stroke-width="0.02" stroke-dasharray="0.1"/>`
            }

            var svg = ` 
            <svg viewBox="${min_hour-1} 0 ${max_hour - min_hour+2} 1">
              <polygon points='${max_hour},1 ${min_hour},1 ${min_hour},0 ${max_hour},0'/>
              <polygon points='${points_str}'/>
              ${polylines}
            </svg>
            `
            table_rows += `<tr><td>${sector_name}</td><td>${svg}</td></tr>`

        }
        document.getElementById("tbody_el").innerHTML = table_rows
    } 


}
