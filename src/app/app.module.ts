import { SocketService } from './socket.service';
import { MapService } from './map.service';
import { MapComponent } from './maps/map.component';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { fromEventPattern } from 'rxjs';
import { AgmCoreModule } from '@agm/core';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';

//const config: SocketIoConfig = {url: 'http://localhost:3000', options: {}};

@NgModule({
  declarations: [
    AppComponent,
    MapComponent
  ],
  schemas:  [ CUSTOM_ELEMENTS_SCHEMA ],
  imports: [
    BrowserModule,
    HttpClientModule,
    //SocketIoModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyA84HPzgNU3diTHdoJzb33Q4iOppgWLYr4',
      libraries: ['places']
    })
  ],
  providers: [MapService, SocketService],
  bootstrap: [AppComponent]
})
export class AppModule { }
