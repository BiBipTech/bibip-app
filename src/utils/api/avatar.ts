export const getAvatar = (fullName: string) => {
  const name = fullName.split(" ").join("+");
  return `https://ui-avatars.com/api/?name=${name}&size=1920&background=23a65e&color=ffffff`;
};
