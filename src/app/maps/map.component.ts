
import { Location } from './../location.model';
import { MapService } from './../map.service';
import { Component, OnDestroy, OnInit } from "@angular/core";
import { AgmMap, GoogleMapsAPIWrapper, MapsAPILoader } from "@agm/core";
import { AgmCoreModule } from '@agm/core';
import { Variable } from "@angular/compiler/src/render3/r3_ast";

import { Subscription, map, observeOn, of } from 'rxjs';
import { resolve } from 'dns';
import { rejects } from 'assert';
import { io } from 'socket.io-client';

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
  private updatedData: Subscription = new Subscription;

  //Socket variables
  private socket: any;

  //Test Variables
  
  constructor(public mapService: MapService){

  }

  ngOnInit(): void {
    //socket initialization and COOR policy
    this.socket = io("http://localhost:3000/", {
      withCredentials: true,
      extraHeaders: {
      "my-custom-header": "abcd"
      }
    });

    //Get marker data from server  
    this.mapService.getMarkers();

    //Check if the async event of getting markers have finished. Returns an observable
    let a = new Promise((resolve, rejects) => {
      this.markerSub = this.mapService.getMarkerSentListener().subscribe((marker: Location[]) => {
       this.markers = marker;
      });
    });

    this.updatedData = this.mapService.getUpdatedData().subscribe((data: {id: string, numOfParkingUsed: number}) => {
      for(let element of this.markers){
        if(element.id == data.id){
          element.numOfParkingUsed = data.numOfParkingUsed;
        }
      };
    });
    
  } 

  ngOnDestroy(): void{
    this.markerSub.unsubscribe();
  }
  //Records last clicked record
  logLocation(_id: string){
    this.parkingID = _id;
  }

  hawa():void{
    console.log(this.markers);
  };

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

    //Sending parking request
    promise.then((promiseReturned: any) =>{
        this.mapService.parkRequest(this.parkingID, promiseReturned);     
    });
  };



  
}
