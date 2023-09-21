import { Car } from "../../models";

export interface ListCarsResult {
  listCars: {
    items: (Car & { _version: number })[];
  };
}

export interface ReserveCarResult {}
