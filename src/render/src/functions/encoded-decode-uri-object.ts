export const encodeUriObject = (queryString: Record<string, string>) => {
  const encoded: Record<string, string> = {};
  for (const key in queryString) {
    if (Object.prototype.hasOwnProperty.call(queryString, key)) {
      encoded[key] = encodeURIComponent(queryString[key]);
    }
  }

  return encoded;
};

export const decodeUriObject = (queryString: Record<string, string> | undefined) => {
  const decoded: Record<string, string> = {};
  for (const key in queryString) {
    if (Object.prototype.hasOwnProperty.call(queryString, key)) {
      decoded[key] = decodeURIComponent(queryString[key]);
    }
  }

  return decoded;
};

const def = {encodeUriObject, decodeUriObject};

export default def;
