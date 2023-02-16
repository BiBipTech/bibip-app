// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { Trip, Car, Time, Location } = initSchema(schema);

export {
  Trip,
  Car,
  Time,
  Location
};