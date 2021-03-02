const fs = require("fs");
const parse = require("csv-parse");

let parser = parse({ columns: true }, (err, companies) => {
  console.log(companies);
});

// take csv file and parse it
fs.createReadStream(__dirname + "/original-company-list.csv").pipe(parser);
