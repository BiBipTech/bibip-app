import { awsGet } from "../../../utils/aws/api";
import { TRIP_API } from "@env";

export const getStartTime = (username: string, token: string) => {
  return awsGet(`${TRIP_API}/fetch-trip-start/${username}`, token);
};
