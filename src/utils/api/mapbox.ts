import Mapbox from "@rnmapbox/maps";
import axios from "axios";

const accessToken =
  "pk.eyJ1IjoiZXl1YjIwMDEiLCJhIjoiY2xpeDYydThxMDR3YzNzcW10cjNoeXI2dSJ9.S8sjCUJxSfbzIbOj-7vWNA";

const directionsApi = "https://api.mapbox.com/directions/v5";
const isochroneApi = "https://api.mapbox.com/isochrone/v1";
const geocodingApi = "https://api.mapbox.com/geocoding/v5";

export const getDirections = async (origin: string, destination: string) => {
  const requestUrl = `${directionsApi}/mapbox/driving/${origin}%3B${destination}?alternatives=false&geometries=geojson&overview=simplified&steps=false&access_token=${accessToken}`;

  return (await axios.get(requestUrl)).data as unknown as {
    routes: {
      duration: number;
      distance: number;
      geometry: {
        coordinates: number[][];
      };
    }[];
  };
};

export const getIsochrone = async (origin: string, duration: number) => {
  const requestUrl = `${isochroneApi}/mapbox/driving/${origin}?contours_minutes=${duration}&polygons=true&access_token=${accessToken}`;

  return (await axios.get(requestUrl)).data as unknown;
};

export const getReverseGeocode = async (location: string) => {
  const requestUrl = `${geocodingApi}/mapbox.places/${location}.json?types=address&access_token=${accessToken}`;

  return (await axios.get(requestUrl)).data as unknown as {
    features: {
      place_name: string;
      text: string;
      context: {
        id: string;
        text: string;
      }[];
    }[];
  };
};
