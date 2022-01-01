import { Injectable, OnInit } from "@angular/core";
import { Socket } from 'ngx-socket-io';

@Injectable({
    providedIn: 'root'
})
export class SocketService implements OnInit{

    constructor(private socket: Socket){

    }
    ngOnInit(): void {
    
    }

}

