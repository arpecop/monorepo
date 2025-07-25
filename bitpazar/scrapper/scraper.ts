async function fetchProperties() {
  const properties = await fetch(
    "https://www.olx.bg/nedvizhimi-imoti/?search%5Border%5D=created_at%3Adesc",
  )
    .then((response) => response.text())
    .then((data) => data);

  console.log(properties);

  return properties;
}

fetchProperties();
