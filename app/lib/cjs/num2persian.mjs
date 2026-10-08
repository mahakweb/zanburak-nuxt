// node_modules/num2persian/dist/num2persian.js
var delimiter = " \u0648 ";
var zero = "\u0635\u0641\u0631";
var negative = "\u0645\u0646\u0641\u06CC ";
var letters = [
  ["", "\u06CC\u06A9", "\u062F\u0648", "\u0633\u0647", "\u0686\u0647\u0627\u0631", "\u067E\u0646\u062C", "\u0634\u0634", "\u0647\u0641\u062A", "\u0647\u0634\u062A", "\u0646\u0647"],
  ["\u062F\u0647", "\u06CC\u0627\u0632\u062F\u0647", "\u062F\u0648\u0627\u0632\u062F\u0647", "\u0633\u06CC\u0632\u062F\u0647", "\u0686\u0647\u0627\u0631\u062F\u0647", "\u067E\u0627\u0646\u0632\u062F\u0647", "\u0634\u0627\u0646\u0632\u062F\u0647", "\u0647\u0641\u062F\u0647", "\u0647\u062C\u062F\u0647", "\u0646\u0648\u0632\u062F\u0647", "\u0628\u06CC\u0633\u062A"],
  ["", "", "\u0628\u06CC\u0633\u062A", "\u0633\u06CC", "\u0686\u0647\u0644", "\u067E\u0646\u062C\u0627\u0647", "\u0634\u0635\u062A", "\u0647\u0641\u062A\u0627\u062F", "\u0647\u0634\u062A\u0627\u062F", "\u0646\u0648\u062F"],
  ["", "\u06CC\u06A9\u0635\u062F", "\u062F\u0648\u06CC\u0633\u062A", "\u0633\u06CC\u0635\u062F", "\u0686\u0647\u0627\u0631\u0635\u062F", "\u067E\u0627\u0646\u0635\u062F", "\u0634\u0634\u0635\u062F", "\u0647\u0641\u062A\u0635\u062F", "\u0647\u0634\u062A\u0635\u062F", "\u0646\u0647\u0635\u062F"],
  [
    "",
    " \u0647\u0632\u0627\u0631",
    " \u0645\u06CC\u0644\u06CC\u0648\u0646",
    " \u0645\u06CC\u0644\u06CC\u0627\u0631\u062F",
    " \u0628\u06CC\u0644\u06CC\u0648\u0646",
    " \u0628\u06CC\u0644\u06CC\u0627\u0631\u062F",
    " \u062A\u0631\u06CC\u0644\u06CC\u0648\u0646",
    " \u062A\u0631\u06CC\u0644\u06CC\u0627\u0631\u062F",
    " \u06A9\u0648\u0622\u062F\u0631\u06CC\u0644\u06CC\u0648\u0646",
    " \u06A9\u0627\u062F\u0631\u06CC\u0644\u06CC\u0627\u0631\u062F",
    " \u06A9\u0648\u06CC\u0646\u062A\u06CC\u0644\u06CC\u0648\u0646",
    " \u06A9\u0648\u0627\u0646\u062A\u06CC\u0646\u06CC\u0627\u0631\u062F",
    " \u0633\u06A9\u0633\u062A\u06CC\u0644\u06CC\u0648\u0646",
    " \u0633\u06A9\u0633\u062A\u06CC\u0644\u06CC\u0627\u0631\u062F",
    " \u0633\u067E\u062A\u06CC\u0644\u06CC\u0648\u0646",
    " \u0633\u067E\u062A\u06CC\u0644\u06CC\u0627\u0631\u062F",
    " \u0627\u06A9\u062A\u06CC\u0644\u06CC\u0648\u0646",
    " \u0627\u06A9\u062A\u06CC\u0644\u06CC\u0627\u0631\u062F",
    " \u0646\u0627\u0646\u06CC\u0644\u06CC\u0648\u0646",
    " \u0646\u0627\u0646\u06CC\u0644\u06CC\u0627\u0631\u062F",
    " \u062F\u0633\u06CC\u0644\u06CC\u0648\u0646",
    " \u062F\u0633\u06CC\u0644\u06CC\u0627\u0631\u062F"
  ]
];
var decimalSuffixes = [
  "",
  "\u062F\u0647\u0645",
  "\u0635\u062F\u0645",
  "\u0647\u0632\u0627\u0631\u0645",
  "\u062F\u0647\u200C\u0647\u0632\u0627\u0631\u0645",
  "\u0635\u062F\u200C\u0647\u0632\u0627\u0631\u0645",
  "\u0645\u06CC\u0644\u06CC\u0648\u0646\u0648\u0645",
  "\u062F\u0647\u200C\u0645\u06CC\u0644\u06CC\u0648\u0646\u0648\u0645",
  "\u0635\u062F\u0645\u06CC\u0644\u06CC\u0648\u0646\u0648\u0645",
  "\u0645\u06CC\u0644\u06CC\u0627\u0631\u062F\u0645",
  "\u062F\u0647\u200C\u0645\u06CC\u0644\u06CC\u0627\u0631\u062F\u0645",
  "\u0635\u062F\u200C\u200C\u0645\u06CC\u0644\u06CC\u0627\u0631\u062F\u0645"
];
var prepareNumber = function(num) {
  var out = typeof num === "number" ? num.toString() : num;
  if (out.length % 3 === 1) {
    out = "00".concat(out);
  } else if (out.length % 3 === 2) {
    out = "0".concat(out);
  }
  return out.replace(/\d{3}(?=\d)/g, "$&*").split("*");
};
var tinyNumToWord = function(num) {
  var parsedInt = parseInt(num, 10);
  if (parsedInt === 0) {
    return "";
  }
  if (parsedInt < 10) {
    return letters[0][parsedInt];
  }
  if (parsedInt <= 20) {
    return letters[1][parsedInt - 10];
  }
  if (parsedInt < 100) {
    var one_1 = parsedInt % 10;
    var ten_1 = Math.floor((parsedInt - one_1) / 10);
    if (one_1 > 0) {
      return letters[2][ten_1] + delimiter + letters[0][one_1];
    }
    return letters[2][ten_1];
  }
  var one = parsedInt % 10;
  var hundreds = Math.floor((parsedInt - parsedInt % 100) / 100);
  var ten = Math.floor((parsedInt - (hundreds * 100 + one)) / 10);
  var out = [letters[3][hundreds]];
  var secondPart = ten * 10 + one;
  if (secondPart === 0) {
    return out.join(delimiter);
  }
  if (secondPart < 10) {
    out.push(letters[0][secondPart]);
  } else if (secondPart <= 20) {
    out.push(letters[1][secondPart - 10]);
  } else {
    out.push(letters[2][ten]);
    if (one > 0) {
      out.push(letters[0][one]);
    }
  }
  return out.join(delimiter);
};
var convertDecimalPart = function(decimalPart) {
  decimalPart = decimalPart.replace(/0*$/, "");
  if (decimalPart === "") {
    return "";
  }
  if (decimalPart.length > 11) {
    decimalPart = decimalPart.substring(0, 11);
  }
  return " \u0645\u0645\u06CC\u0632 " + num2persian(decimalPart) + " " + decimalSuffixes[decimalPart.length];
};
var convert = function(input, isMixed) {
  var cleanInput = input.toString().replace(/[^0-9.-]/g, "");
  var isNegative = false;
  var floatParse = parseFloat(cleanInput);
  if (isNaN(floatParse)) {
    return zero;
  }
  if (floatParse === 0) {
    return zero;
  }
  if (floatParse < 0) {
    isNegative = true;
    input = cleanInput.replace(/-/g, "");
  } else {
    input = cleanInput;
  }
  var decimalPart = "";
  var integerPart = input.toString();
  var pointIndex = integerPart.indexOf(".");
  if (pointIndex > -1) {
    integerPart = input.toString().substring(0, pointIndex);
    decimalPart = input.toString().substring(pointIndex + 1);
  }
  if (integerPart.length > 66) {
    return "\u062E\u0627\u0631\u062C \u0627\u0632 \u0645\u062D\u062F\u0648\u062F\u0647";
  }
  var slicedNumber = prepareNumber(integerPart);
  var out = [];
  for (var i = 0; i < slicedNumber.length; i += 1) {
    if (Number(slicedNumber[i]) === 0) {
      continue;
    }
    var converted = "";
    if (isMixed) {
      converted = en2fa(String(Number(slicedNumber[i])));
    } else {
      converted = tinyNumToWord(slicedNumber[i]);
    }
    if (converted !== "") {
      out.push(converted + letters[4][slicedNumber.length - (i + 1)]);
    }
  }
  if (out.length == 0) {
    out[0] = zero;
  }
  var decimalWords = "";
  if (decimalPart.length > 0) {
    decimalWords = convertDecimalPart(decimalPart);
  }
  return (isNegative ? negative : "") + out.join(delimiter) + decimalWords;
};
var num2persian = function(input) {
  return convert(input, false);
};
String.prototype.num2persian = function() {
  return num2persian(this);
};
Number.prototype.num2persian = function() {
  return num2persian(this.toString());
};
function en2fa(value) {
  value = String(value);
  var englishNumbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", ","], persianNumbers = ["\u06F1", "\u06F2", "\u06F3", "\u06F4", "\u06F5", "\u06F6", "\u06F7", "\u06F8", "\u06F9", "\u06F0", "\u060C"];
  for (var i = 0; i < 11; i++) {
    value = value.replace(new RegExp(englishNumbers[i], "g"), persianNumbers[i]);
  }
  return value;
}
