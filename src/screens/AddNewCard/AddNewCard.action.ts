import { encryptCard, saveCard } from "../../utils/api/pbm";
import { UserContextType } from "../../utils/context/UserContext";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import { Auth } from "aws-amplify";
import { CognitoUser } from "@aws-amplify/auth";

export const addCard = async (
  cardNo: string,
  month: string,
  year: string,
  cvv: string,
  userContext: UserContextType,
  cardHolder: string
) => {
  const encryptedCard = (
    await encryptCard(cardNo.replaceAll(" ", ""), month, year, cvv)
  ).data;

  const saveCardUrl = await saveCard(
    userContext.user?.getUsername()!,
    encryptedCard,
    cardHolder,
    Linking.createURL("/")
  );

  const res = (await WebBrowser.openAuthSessionAsync(
    // We add `?` at the end of the URL since the test backend that is used
    // just appends `authToken=<token>` to the URL provided.
    `${saveCardUrl.data.RedirectUrl}?linkingUri=${Linking.createURL("/?")}`
  )) as WebBrowser.WebBrowserRedirectResult;
  return res.url;
};
