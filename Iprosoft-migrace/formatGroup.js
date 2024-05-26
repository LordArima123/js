const fs = require("fs");

const inputFile = "inputGroup.csv";
// const outputFile = path.join(__dirname, "out.csv");
const DELIMITER = "\t";

const items = JSON.parse(fs.readFileSync("group.json"));
// console.log(typeof items);
const processCSV = (inputFile) => {
  fs.readFile(inputFile, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading the file:", err);
      return;
    }

    // Split the data into rows
    const rows = data.split("\n");

    // Split each row into columns using tab as the delimiter
    const lines = rows.map((row) => row.split("\t"));
    res = "";
    lines.forEach((line) => {
      line[3] = items[line[3]];
      res = res + line.join(DELIMITER) + "\r\n";
    });
    fs.writeFileSync("input.csv", res);
  });
};

processCSV(inputFile);
