import { Location } from './../location.model';
import { MapService } from './../map.service';
import { Component, OnDestroy, OnInit } from "@angular/core";
import { AgmMap, GoogleMapsAPIWrapper, MapsAPILoader } from "@agm/core";
import { AgmCoreModule } from '@agm/core';
import { Variable } from "@angular/compiler/src/render3/r3_ast";

import { Subscription } from 'rxjs';
import { resolve } from 'dns';
import { rejects } from 'assert';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})

export class MapComponent implements OnInit, OnDestroy {
  text = 'Parking App';
  
  lat=32.5288594036806343;
  long=-92.07093364324432;
  flag=true; //User location validation 
  location=0;
 
  //Variables used for marker logic
  markers: any =[];
  private markerSub: Subscription = new Subscription;
  parkingID: string = "";

  ulmArea={
    x1: 32.531512,  
    y1: -92.072328,
    x2: 32.531908,
    y2: -92.059782
  }

  constructor(public mapService: MapService){

  }

  ngOnInit(): void {

    //Get marker data from server  
    this.mapService.getMarkers();

    //Check if the async event of getting markers have finished. Returns an observable
    this.markerSub = this.mapService.getMarkerSentListener().subscribe((marker: Location[]) => {
      this.markers=marker;
      });
  }

  ngOnDestroy(): void{
    this.markerSub.unsubscribe();
  }
  //Records last clicked record
  logLocation(_id: string, index: number){
    this.parkingID = _id;
  }

  //Send parking request to the server
  park(){
    //Get user location to pass it on
    //Using promise to finish async methods first
    var promise = new Promise((resolve, rejects) => {
      var userLatitude;
      var userLongitude;

      //Getting user location from Google maps API
      navigator.geolocation.getCurrentPosition((position) => {
        userLatitude = position.coords.latitude;
        userLongitude = position.coords.longitude;
        
        //Resolving promise
        resolve({userLatitude, userLongitude});
      });
    });

    //Checking if async operation is completed
    promise.then((promiseReturned: any) =>{
      this.mapService.parkRequest(this.parkingID, promiseReturned);
    });
  }
  
}


//Verify user location
   // const totalDistance = this.calculateDistance(this.ulmArea.x1, this.ulmArea.y1, this.ulmArea.x2, this.ulmArea.y2);
   // const userDistance = this.calculateDistance(this.ulmArea.x1, this.ulmArea.y1, this.userLatitude, this.userLongitude);
   
   // if(userDistance > totalDistance){
   //   this.flag=false;
   // } 
