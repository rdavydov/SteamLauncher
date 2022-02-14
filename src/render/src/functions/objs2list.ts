function objs2list(p: Record<string, unknown>) {
  const r = [];
  for (const k in p) {
    if (Object.prototype.hasOwnProperty.call(p, k)) {
      r.push({'@key': k, '@val': p[k]});
    }
  }

  return r;
}

export default objs2list;
