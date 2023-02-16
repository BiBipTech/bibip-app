import { Car } from "../../models";

export interface ListCarsResult {
  listCars: {
    items: Car[];
  };
}
