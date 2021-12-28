import { Decimal128 } from "mongoose";

export interface Location{
    id: string;
    name: string;
    centerX: Decimal128;
    centerY: Decimal128;
    numOfParkingUsed: number;
    totalParkingCapacity: number;
}