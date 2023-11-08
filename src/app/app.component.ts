import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  title = 'sunny';
  country = { name: 'Israel', localName: 'ישראל' }
  areas = [
    { name: 'Timna', localName: 'תמנע' , areaId: 1},
    { name: 'Gita West', localName: 'גיתה מערב' , areaId: 2},
    { name: 'Gita East', localName: 'גיתה מזרח' , areaId: 3},
    { name: 'Ein Fara', localName: 'עין פארה' , areaId: 12},
    { name: 'Zanoah', localName: 'זנוח' , areaId: 15},
    { name: 'Hayonim', localName: 'היונים' , areaId: 17},
    { name: 'The Vanishing (Haneelam)', localName: 'הנעלם', areaId: 16},
    { name: 'Beit Arye', localName: 'בית אריה' , areaId: 123}
  ] 

  inputText = ''
  filtered_areas = []
  selectedCountry = 'Israel'
  selectedArea = null

  ngOnInit(): void {
    this.filtered_areas = this.areas
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
    console.log(str)
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

  poo(e){
    console.log(e)
  }
}
