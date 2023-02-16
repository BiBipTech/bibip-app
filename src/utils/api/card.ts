export const matchMaskedPan = (maskedPan: string, cardNo: string) => {
  // 494314***4086
  // 4943141433834086

  const maskedPanSplit = maskedPan.split("***");

  const firstSixMaskedPan = maskedPanSplit[0];
  const lastFourMaskedPan = maskedPanSplit[1];

  const firstSixCardNo = cardNo.slice(0, 6);
  const lastFourCardNo = cardNo.slice(12, cardNo.length);

  if (
    firstSixMaskedPan === firstSixCardNo &&
    lastFourMaskedPan === lastFourCardNo
  ) {
    return true;
  }

  return false;
};
