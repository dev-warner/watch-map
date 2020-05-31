import convertCountryCode from "country-iso-3-to-2";
import { scaleLinear } from "d3-scale";

const formatCurrency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export async function get(url, value) {
  const URL = url;

  function countryModel(data) {
    const number = data[value];
    const id = getId(data);
    const name = getCountryName(id);

    return {
      value: number,
      currency: number ? formatCurrency.format(number.toFixed(0)) : 0,
      id: getId(data),
      name,
    };
  }

  function getCountryName(id) {
    const { features } = am4geodata_worldLow;
    const found = features.find(({ properties }) => {
      return properties.id === id;
    });

    return (found && found.properties.name) || "";
  }

  function getId(value) {
    return convertCountryCode(value.origin_id.slice(2).toUpperCase());
  }

  let max = Number.MIN_SAFE_INTEGER,
    min = Number.MAX_SAFE_INTEGER;

  const res = await fetch(URL);
  const { data: countrys } = await res.json();

  const models = countrys
    .map((value) => {
      const data = countryModel(value);

      if (data.value) {
        if (max < data.value) {
          max = data.value;
        }
        if (min > data.value) {
          min = data.value;
        }
        return data;
      }
    })
    .filter(Boolean)
    .sort((a, b) => (a.value > b.value ? -1 : 1));

  const colorScale = scaleLinear()
    .domain([0, max / 3.5])
    .range(["#ffedea", "green"]);

  const data = models.map((value) => {
    return { ...value, fill: am4core.color(colorScale(value.value)) };
  });

  return {
    data,
    max,
    min,
  };
}
