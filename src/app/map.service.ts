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

    this.http.post<{a: string, b: string}>("http://localhost:3000/verifyLocation", location)
    .subscribe(result =>{
      const a = result;
      console.log(a);
    });

  }    

  //It returns an object of type string and array containing object of following type
  //data: [{id: string, name: string, a: Decimal128, b: Decimal128, c: number, d: number}]
  getMarkers(){

    this.http.get<{data: Location[]}>("http://localhost:3000/").pipe(map(temp =>{
      return temp.data.map(temp1 => {
        return{
          id: temp1.id,
          name: temp1.name,
          centerX: temp1.centerX,
          centerY: temp1.centerY,
          numOfParkingUsed: temp1.numOfParkingUsed,
          totalParkingCapacity: temp1.totalParkingCapacity
        };
      });
    }))
    .subscribe(result => {
      this.markers = result;
      this.markersRecieved.next([...this.markers]);

    });
  }

  getMarkerSentListener(){
    return this.markersRecieved.asObservable();
  }
}
