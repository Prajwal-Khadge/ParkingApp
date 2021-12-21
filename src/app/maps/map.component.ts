import { Component, OnInit } from "@angular/core";
import { AgmMap, GoogleMapsAPIWrapper, MapsAPILoader } from "@agm/core";
import { AgmCoreModule } from '@agm/core';
import { Variable } from "@angular/compiler/src/render3/r3_ast";


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})

export class MapComponent implements OnInit {
  text = 'Parking App';
  
  lat=32.5288594036806343;
  long=-92.07093364324432;
  flag=true; //User location validation 
  location=0;
  userLatitude: any;
  userLongitude: any;
  
  ulmArea={
    x1: 32.531512,  
    y1: -92.072328,
    x2: 32.531908,
    y2: -92.059782
  }

  ngOnInit(): void {
    //Get user location on loading of the component
    navigator.geolocation.getCurrentPosition((position) => {
      this.userLatitude = position.coords.latitude;
      this.userLongitude = position.coords.longitude; 

      //Verify user location
      const totalDistance = this.calculateDistance(this.ulmArea.x1, this.ulmArea.y1, this.ulmArea.x2, this.ulmArea.y2);
      const userDistance = this.calculateDistance(this.ulmArea.x1, this.ulmArea.y1, this.userLatitude, this.userLongitude);
      
      if(userDistance > totalDistance){
        this.flag=false;
      }     
      console.log("distance from center",totalDistance, userDistance);
    });    
   }

   //Calculates distance
   calculateDistance(lat1: number , lon1: number , lat2: number, lon2: number) {
    if ((lat1 == lat2) && (lon1 == lon2)) {
      return 0;
    }
    else {
      var radlat1 = Math.PI * lat1/180;
      var radlat2 = Math.PI * lat2/180;
      var theta = lon1-lon2;
      var radtheta = Math.PI * theta/180;
      var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
      if (dist > 1) {
        dist = 1;
      }
      dist = Math.acos(dist);
      dist = dist * 180/Math.PI;
      dist = dist * 60 * 1.1515;
      dist = dist * 1.609344; //Converting to kilometers
      return dist;
    }
  }
  
  
  

}



