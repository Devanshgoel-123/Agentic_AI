import { ethers } from "ethers";

/**
 * Function to trim value and adjust decimal places.
 * @param value Value to be trimmed
 * @returns Trimmed value with decimal places adjusted.
 */
const trimDecimalPlaces = (value: string) => {
  const [whole, fraction] = value.split(".");
  return fraction && fraction?.length ? whole : value;
};

/**
 * Function to convert BigInt -> UI format.
 * @param value Value to be converted to UI format.
 * @param decimal Decimal of token.
 * @returns Formatted value from BigInt -> UI format.
 */
export const convertBigIntToUIFormat = (value: string, decimal: number) => {
  const bigIntValue = BigInt(value);
  let valueStr = bigIntValue.toString();
  if (valueStr.length <= decimal) {
    valueStr = "0".repeat(decimal - valueStr.length + 1) + valueStr;
  }
  const decimalPointIndex = valueStr.length - decimal;
  const formattedValue =
    valueStr.slice(0, decimalPointIndex) +
    "." +
    valueStr.slice(decimalPointIndex);
  return formattedValue;
};

/**
 * Function to convert the values into presentable text
 * @param volume 
 * @returns 
 */

export function formatDisplayText(volume:number,precision:number){
  if (volume < 1000) {
    return `$${volume.toFixed(precision)}`;
  }
  const suffix = volume >= 1000000 ? 'M' : 'K';
  const formattedVolume = new Intl.NumberFormat().format(volume / (suffix === 'M' ? 1000000 : 1000));
  return `$${Number(formattedVolume).toFixed(precision)}${suffix}`;
}




/**
 * Function to convert scientific notation to normal format.
 * @param num value to be checked.
 * @returns formatted value.
 */
function convertToDecimal(num: number) {
  const str = num.toString();
  if (str.includes("e")) {
    const [base, exponent] = str.split("e");
    const exp = parseInt(exponent, 10);
    let decimalValue;

    if (exp > 0) {
      decimalValue =
        base.replace(".", "") +
        "0".repeat(exp - (base.split(".")[1]?.length || 0));
    } else {
      decimalValue =
        "0." + "0".repeat(Math.abs(exp) - 1) + base.replace(".", "");
    }

    return decimalValue;
  } else {
    return str;
  }
}

/**
 * Function to convert UI format -> BigInt
 * @param value Value in string
 * @param decimal Decimal of Token
 * @returns BigInt Format.
 */
export const convertUIFormatToBigInt = (value: string, decimal: number) => {
  const valeForEthers = value.includes("e")
    ? convertToDecimal(Number(value))
    : value;
  return ethers
    .parseUnits(
      value ? trim_decimal_overflow(valeForEthers, decimal) : "0",
      decimal
    )
    .toString();
};

/**
 * Function to return fixed decimal places value.
 * @param value Value to be formatted.
 * @param decimalPlaces Desired decimal places.
 * @returns Trimmed value to fixed decimal places.
 */
export const formattedValueToDecimals = (
  value: string,
  decimalPlaces: number
): string => {
  const valueToDecimal =
    decimalPlaces > 100 || decimalPlaces < 0 ? 4 : decimalPlaces;
  return parseFloat(parseFloat(value).toFixed(valueToDecimal)).toString();
};

/**
 *
 * @param n Amount to be trimmed in string.
 * @param decimals Desired decimals places.
 * @returns Trimmed amount
 */
export const trim_decimal_overflow = (n: string, decimals: number): string => {
  n += "";

  if (n.indexOf(".") === -1) return n;

  const arr = n.split(".");
  const fraction = arr[1].slice(0, decimals);
  return arr[0] + "." + fraction;
};

/**
 *
 * @param seconds Seconds to be converted
 * @returns Corresponding minutes value
 */
export const formatSecondsToMinutesAndSeconds = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  const formattedTime = `${minutes}m ${
    remainingSeconds < 10 ? "0" : ""
  }${remainingSeconds}s`;

  return formattedTime;
};

/**
 * Converts 1000 -> 1K.
 * @param num Number to be formatted
 * @returns Returns number in grouped format.
 */
export const formatNumberWithDecimals = (num: number, isCompact = false) => {
  const formatOutput = Intl.NumberFormat("en-US", {
    notation: isCompact ? "compact" : "standard",
    maximumFractionDigits: isCompact ? 0 : 7,
  }).format(num);

  return formatOutput;
};

export const convertTickToPrice = (
  tick: number,
  token0Decimal: number,
  token1Decimal: number
) => {
  const price = Math.pow(1.0001, tick);
  return (price * Math.pow(10, token0Decimal)) / Math.pow(10, token1Decimal);
};

/**
 * Function to return price range from tick.
 * @param lowerTick
 * @param upperTick
 * @param token0Decimal
 * @param token1Decimal
 * @returns
 */
export const convertTickToPriceRange = (
  lowerTick: number,
  upperTick: number,
  token0Decimal: number,
  token1Decimal: number
) => {
  // Function to convert tick to normalized price
  const convertTickToPrice = (tick: number) => {
    const price = Math.pow(1.0001, tick);
    return (price * Math.pow(10, token0Decimal)) / Math.pow(10, token1Decimal);
  };

  // Calculate prices at lower and upper ticks
  const priceLower = convertTickToPrice(lowerTick);
  const priceUpper = convertTickToPrice(upperTick);

  // Return the price range in terms of token0 and token1
  return {
    priceRangeToken0: {
      lower: priceLower, // Price of token0 in terms of token1
      upper: priceUpper, // Price of token0 in terms of token1
    },
    priceRangeToken1: {
      lower: 1 / priceUpper, // Price of token1 in terms of token0
      upper: 1 / priceLower, // Price of token1 in terms of token0
    },
  };
};

/**
 * Debounce function.
 * @param func
 * @param delay
 * @returns
 */
export function debounce(func: (...args: any[]) => void, delay: number) {
  let timer: NodeJS.Timeout | null;
  return (...args: any[]) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
}

/**
 *
 * @param tick
 */
export const convertTickToPriceValue = (
  tick: number,
  token0Decimal: number,
  token1Decimal: number
) => {
  const price = Math.pow(1.0001, tick);
  const token0_price =
    (price * Math.pow(10, token0Decimal)) / Math.pow(10, token1Decimal);
  const token1_price = 1 / token0_price;
  return token1_price;
};

/**
 * Converts a token1 price back to its corresponding tick value.
 *
 * @param token1_price The price of token1.
 * @returns The corresponding tick value.
 */
export const convertPriceValueToTick = (
  token1_price: number,
  token0Decimal: number,
  token1Decimal: number
): number => {
  const token0_price = 1 / token1_price;
  const price =
    (token0_price * Math.pow(10, token1Decimal)) / Math.pow(10, token0Decimal);
  const tick = Math.log(price) / Math.log(1.0001);
  return Math.round(tick);
};

export const returnFormattedValue = (value: number) => {
  if (value === 0) {
    return value.toFixed(2);
  } else if (value < 0.00001) {
    return value.toFixed(10);
  } else {
    return value.toFixed(4);
  }
};
