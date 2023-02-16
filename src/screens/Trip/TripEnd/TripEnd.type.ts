import { Car } from "../../../models";

export type PhotoType = "BACK" | "RIGHT" | "LEFT" | "FRONT";

export type UpdateCarResult = {
  updateCar: Car;
};

interface CarWithVersion extends Car {
  _version?: number | null;
}

export type GetCarResult = {
  getCar: CarWithVersion;
};
