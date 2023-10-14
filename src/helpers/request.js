/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */
export const buildQueryString = (filter) => {
  const qs = [];
  Object.keys(filter).forEach((key) => {
    if (!["", null, undefined].includes(filter[key])) {
      qs.push(`${key}=${filter[key]}`);
    }
  });
  return `?${qs.join("&")}`;
};
