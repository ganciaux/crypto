import React from "react";
import { cryptoFiatGet } from "../services/cryptoFiat";
import millify from "millify";

const CryptoData = ({ label, value, isEuro, isMillify, toFixed }) => {
  let formatedValue='-'
  const symbol = isEuro === undefined ? "" : cryptoFiatGet(isEuro, "symbol");
  if (value!==null)
    formatedValue = isMillify === undefined ? value : millify(value);
  if (toFixed!==undefined && typeof formatedValue === 'number'){
    formatedValue = formatedValue.toFixed(toFixed)
  }
  return (
    <p>
      {label}: {formatedValue} {symbol}
    </p>
  );
};

export default CryptoData;
