const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");

const inputFile = path.join(__dirname, "input.csv");
const outputFile = path.join(__dirname, "out.csv");
const DELIMITER = "\t";
const processCSV = (inputFile, outputFile) => {
  const writeStream = fs.createWriteStream(outputFile);
  writeStream.write(
    ["ean", "name", "price", "group", "amount", "unit"].join(DELIMITER)
  );
  writeStream.write("\n");

  fs.createReadStream(inputFile, "utf-8")
    .pipe(csv())
    .on("data", (row) => {
      if (Number(row["Ma vach"]) > 1000) {
        const ean = removeNonNumericChars(row["Ma vach"]);

        const name = removeSpecialCharacters(row["Ten"]);

        const price = formatToTwoDecimalPlaces(row["Gia ban"]);
        // console.log(price);
        const group = row["Nhom"].trim();
        // const line = `${ean}, ${name}, ${price}, ${group},,\n`;
        // writeStream.write(line);
        if (!ean || !name || !price || !group) {
          return false;
        }
        const line = [ean, name, price, group].join(DELIMITER);
        writeStream.write(line);
        writeStream.write("\n");
      }
    })
    .on("end", () => {
      console.log("CSV file successfully processed");
      writeStream.end();
    });
};

function removeSpecialCharacters(str) {
  return str.trim().replace(/[";\t]/g, "");
}

function formatToTwoDecimalPlaces(numStr) {
  return Number(numStr).toFixed(2);
}

function removeNonNumericChars(str) {
  return str.trim().replace(/\D/g, "");
}

processCSV(inputFile, outputFile);
