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
    { name: 'Timna', localName: 'תמנע' },
    { name: 'Gita West', localName: 'גיתה מערב' },
    { name: 'Gita East', localName: 'גיתה מזרח' },
    { name: 'Ein Fara', localName: 'עין פארה' },
    { name: 'Zanoah', localName: 'זנוח' },
    { name: 'Hayonim', localName: 'היונים' },
    { name: 'The Vanishing (Haneelam)', localName: 'הנעלם' },
    { name: 'Beit Arye', localName: 'בית אריה' }
  ] 

  inputText = ''
  filtered_areas = []

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
}
