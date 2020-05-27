export const formatEventDate = (d: Date): string => {
  const month = d.getMonth() < 9 ? `0${d.getMonth() + 1}` : `${d.getMonth() + 1}`;
  const date = d.getUTCDate() < 10 ? `0${d.getUTCDate()}` : `${d.getUTCDate()}`;

  return `${d.getFullYear()}${month}${date}`;
};

export const getTargetEventDate = (now: Date): string => {
  if (now.getUTCHours() < 10) {
    now.setDate(now.getDate() - 1);
  }
  return formatEventDate(now);
};
