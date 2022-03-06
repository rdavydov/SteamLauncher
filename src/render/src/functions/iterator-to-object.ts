const iteratorToObject = (nn: URLSearchParams) => {
  const b: Record<string, string> = {};
  for (const pp of nn) {
    b[pp[0]] = pp[1];
  }

  return b;
};

export default iteratorToObject;
