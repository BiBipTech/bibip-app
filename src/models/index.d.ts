import { ModelInit, MutableModel, PersistentModelConstructor } from "@aws-amplify/datastore";



export declare class Time {
  readonly start?: number | null;
  readonly end?: number | null;
  constructor(init: ModelInit<Time>);
}

export declare class Location {
  readonly lat: number;
  readonly lng: number;
  constructor(init: ModelInit<Location>);
}

type TripMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type CarMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

export declare class Trip {
  readonly id: string;
  readonly roadTraveled?: number | null;
  readonly time?: Time | null;
  readonly user?: string | null;
  readonly carID: string;
  readonly duration?: number | null;
  readonly fee?: number | null;
  readonly paidViaCreditCard?: number | null;
  readonly paidViaWallet?: number | null;
  readonly rating?: number | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<Trip, TripMetaData>);
  static copyOf(source: Trip, mutator: (draft: MutableModel<Trip, TripMetaData>) => MutableModel<Trip, TripMetaData> | void): Trip;
}

export declare class Car {
  readonly id: string;
  readonly name?: string | null;
  readonly location?: Location | null;
  readonly inUse?: boolean | null;
  readonly battery?: number | null;
  readonly Trips?: (Trip | null)[] | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<Car, CarMetaData>);
  static copyOf(source: Car, mutator: (draft: MutableModel<Car, CarMetaData>) => MutableModel<Car, CarMetaData> | void): Car;
}