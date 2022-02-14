const iteratorToObject = (n: URLSearchParams) => {
  const b: Record<string, string> = {};
  for (const p of n) {
    b[p[0]] = p[1];
  }

  return b;
};

export default iteratorToObject;
