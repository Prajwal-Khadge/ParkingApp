import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Decimal128 } from 'mongoose';
import { map, Subject } from 'rxjs';
import { Location } from './location.model';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  private markers: any = [];
  private markersRecieved = new Subject<Location[]>();

  constructor(private http: HttpClient) { }

  verifyLocation(userLatitude: Number, userLongitude: Number){

    const location = {
      lat: userLatitude,
      lon: userLongitude
    }
    //Sending user location
    this.http.post<{a: string, b: string}>("http://localhost:3000/verifyLocation", location)
    .subscribe(result =>{
      const a = result;
      console.log(a);
    });

  }    

  //It returns an object of type string and array containing object of following type
  getMarkers(){
   this.http.get<{data: Location[]}>("http://localhost:3000/").pipe(map(temp =>{
     return temp.data.map(result => {
       return{
         id: result._id,
         name: result.name,
         centerX: result.centerX,
         centerY: result.centerY,
         numOfParkingUsed: result.numOfParkingUsed,
         totalParkingCapacity: result.totalParkingCapacity
        };
      });
    }))
    .subscribe(transformedResult => {
      this.markers = transformedResult;
      this.markersRecieved.next([...this.markers]);

    });
  }

  //Emitting observable containing array
  getMarkerSentListener(){
    return this.markersRecieved.asObservable();
  }



  //Parking request by user
  parkRequest(parkingID: string, userLocation: object){
    //Send parking request to server
    //For dev process
    userLocation ={
      userLatitude: 32.52743442439571, 
      userLongitude: -92.07754440511565
    };

    // userLocation = {
    //   userLatidue: 0,
    //   userLongitude: 0
    // };
    this.http.post<{message: string, numOfParkingUsed: number}>("http://localhost:3000/parkRequest/" + parkingID, userLocation)
    .subscribe((message) => {
      console.log(message.message, message.numOfParkingUsed);
    });
  }    
  }




