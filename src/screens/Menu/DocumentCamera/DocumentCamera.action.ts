import { CognitoUser } from "@aws-amplify/auth";
import { Auth, Storage } from "aws-amplify";
import * as ImageManipulator from "expo-image-manipulator";

export const uploadPhoto = async (
  photo: {
    type: "photo" | "id" | "license";
    value: string;
  },
  user: CognitoUser
) => {
  const compressedPhotoUri = (await compressPhoto(photo.value)).uri;
  const compressedPhoto = await getPhotoBlob(compressedPhotoUri);
  const uploadResponse = await Storage.put(
    `${user.getUsername()!}/belgeler/${photo.type}`,
    compressedPhoto
  );

  console.log(uploadResponse);
  if (uploadResponse.key) {
    console.log(await updateDocumentStatus(user, photo.type));
  }
  return uploadResponse;
};

const compressPhoto = async (uri: string) => {
  return await ImageManipulator.manipulateAsync(uri, [], {
    compress: 0.25,
    format: ImageManipulator.SaveFormat.JPEG,
  });
};

const getPhotoBlob = async (uri: string) => {
  const photo = await fetch(uri);
  return await photo.blob();
};

const updateDocumentStatus = async (
  user: CognitoUser,
  document: "photo" | "id" | "license"
) => {
  switch (document) {
    case "id":
      return await Auth.updateUserAttributes(user, {
        "custom:id_confirmed": "waiting",
      });
    case "license":
      return await Auth.updateUserAttributes(user, {
        "custom:license_confirmed": "waiting",
      });
    case "photo":
      return await Auth.updateUserAttributes(user, {
        "custom:photo_confirmed": "waiting",
      });
  }
};
