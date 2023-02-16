import { Auth } from "aws-amplify";

export const signUp = async (formInfo: {
  phoneNumber: string;
  email: string;
  citizenId: string;
  birthday: string;
  name: string;
}) => {
  return await Auth.signUp({
    username: formInfo.phoneNumber,
    password: formInfo.phoneNumber,
    attributes: {
      name: formInfo.name,
      email: formInfo.email,
      birthdate: formInfo.birthday,
      phone_number: formInfo.phoneNumber,
      "custom:citizen_id": formInfo.citizenId,
      "custom:current_car_in_use": "none",
      "custom:current_status": "not_in_trip",
      "custom:default_card": "none",
      "custom:id_confirmed": "false",
      "custom:license_confirmed": "false",
      "custom:photo_confirmed": "false",
      "custom:trip_start_time": (+new Date()).toString(),
    },
  });
};
