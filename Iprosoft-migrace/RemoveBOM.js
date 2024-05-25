const fs = require("fs");
const csv = require("csv-parser");
const path = require("path");

const inputFile = path.join(__dirname, "input.csv");
const outputFile = path.join(__dirname, "out.csv");
const DELIMITER = "\t";

// Function to remove BOM if it exists
function removeBOM(buffer) {
  if (buffer[0] === 0xef && buffer[1] === 0xbb && buffer[2] === 0xbf) {
    return buffer.slice(3);
  }
  return buffer;
}

const processCSV = (inputFile, outputFile) => {
  //Write Header
  const writeStream = fs.createWriteStream(outputFile);
  writeStream.write(
    ["ean", "name", "price", "group", "amount", "unit"].join(DELIMITER)
  );
  writeStream.write("\n");

  // Read the CSV file
  fs.readFile(inputFile, (err, data) => {
    if (err) {
      console.error("Error reading the file:", err);
      return;
    }

    // Remove BOM if present
    const dataWithoutBOM = removeBOM(data);

    // Process the CSV data
    const results = [];
    const readableStream = require("stream").Readable.from(dataWithoutBOM);

    readableStream
      .pipe(csv())
      .on("data", (row) => {
        if (Number(row["Ma vach"]) > 1000 && row["Ma vach"].length <= 20) {
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
        console.log(results);
      });
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
