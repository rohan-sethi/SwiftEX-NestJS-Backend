import axios from "axios";

export const convertCurrencies = async (
  from: string,
  to: string,
  amount: number,
): Promise<number> => {
  const url = `https://api.exchangerate.host/convert?from=${from}&to=${to}`;
  const { data } = await axios.get(url);
  const rate = +data.result;

  return amount * rate;
};
