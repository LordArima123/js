const fs = require("fs");
const inputFileName = process.argv[2];

if (!fs.existsSync(inputFileName)) {
  console.log("Input file not found");
  process.exit();
}

Number.prototype.formatMoney = function (c, d, t) {
  var n = this,
    c = isNaN((c = Math.abs(c))) ? 2 : c,
    d = d === undefined ? "." : d,
    t = t === undefined ? "" : t,
    s = n < 0 ? "-" : "",
    i = parseInt((n = Math.abs(+n || 0).toFixed(c))) + "",
    j = (j = i.length) > 3 ? j % 3 : 0;
  var retval =
    s +
    (j ? i.substr(0, j) + t : "") +
    i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) +
    (c
      ? d +
        Math.abs(n - i)
          .toFixed(c)
          .slice(2)
      : "");
  if (retval === "-0.00") {
    retval = "0.00";
  }
  return retval;
};

const items = JSON.parse(fs.readFileSync(inputFileName));
let out = "ean\tname\tprice\tgroup\tamount\tunit";
items.forEach((article) => {
  if (article.SalePrice < 99999) {
    out +=
      "\n" +
      article.Value.trim().replace(/[^\d]/g, "") +
      "\t" +
      article.Name.trim().replace(/[";\t]/g, "") +
      "\t" +
      article.SalePrice.formatMoney() +
      "\t" +
      article["Name:1"].trim() +
      "\t" +
      "" +
      "\t" +
      "";
  }
});

fs.writeFileSync("out.csv", out);
