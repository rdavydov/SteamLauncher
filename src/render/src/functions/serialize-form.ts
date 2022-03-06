const serializeForm = (form: HTMLFormElement) => {
  const objects: Record<string, boolean | string> = {};
  const formData = new FormData(form);

  for (const pair of formData) {
    const key = pair[0];
    let value: boolean | string = pair[1] as string;

    if (value === 'true' || value === 'false') {
      value = value === 'true';
    }

    objects[key] = value;
  }

  return objects;
};

export default serializeForm;
