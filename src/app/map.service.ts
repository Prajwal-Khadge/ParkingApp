import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Subject } from 'rxjs';
import { Socket } from 'socket.io-client';
import { Location } from './location.model';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  private markers: any = [];
  private markersRecieved = new Subject<Location[]>();
  private updateParking = new Subject<any>();

  constructor(private http: HttpClient) { }

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

    parkingID = parkingID;

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
      //compare message returned by server
      if(message.message === 'Success'){
    
      const updatedData = {
        id: parkingID,
        numOfParkingUsed: message.numOfParkingUsed
      } ;
    
      //Loading updated data on the observable
      this.updateParking.next(updatedData);

      }
      else if(message.message === 'Fail'){
        //Display parking full
      }
      else if(message.message === 'LocationErr'){
        //Display move closer to a zone
        console.log("move closer");
      }
    });
  }
  
  //Emitting observable containing array
  getUpdatedData(){
    return this.updateParking.asObservable();
  }




}




