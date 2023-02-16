import { CognitoUser } from "@aws-amplify/auth";
import { Auth } from "aws-amplify";

export const fetchAttributes = async (user: CognitoUser) => {
  const attributes = await Auth.userAttributes(user);

  return {
    name: attributes.filter((e) => e.Name === "name")[0].Value,
    birthday: attributes.filter((e) => e.Name === "birthdate")[0].Value,
    email: attributes.filter((e) => e.Name === "email")[0].Value,
  };
};

export const fetchDocumentStatuses = async (user: CognitoUser) => {
  const attributes = await Auth.userAttributes(user);

  return {
    license: attributes.filter((e) => e.Name === "custom:license_confirmed")[0]
      .Value,
    photo: attributes.filter((e) => e.Name === "custom:photo_confirmed")[0]
      .Value,
    id: attributes.filter((e) => e.Name === "custom:id_confirmed")[0].Value,
  };
};

export const saveAttributes = async (
  user: CognitoUser,
  attributes: { name: string; birthday: string; email: string }
) => {
  return await Auth.updateUserAttributes(user, {
    name: attributes.name,
    birthdate: attributes.birthday,
    email: attributes.email,
  });
};
