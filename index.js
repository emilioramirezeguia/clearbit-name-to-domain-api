const fs = require("fs");
const parse = require("csv-parse");
const _ = require("lodash");

// remove duplicate values
function removeDuplicates(arr) {
  let cleaned = [];

  arr.forEach((item) => {
    let unique = true;

    cleaned.forEach((item2) => {
      if (_.isEqual(item, item2)) {
        unique = false;
      }
    });

    if (unique) {
      let capitalizedName = _.capitalize(item);
      console.log(capitalizedName);
      cleaned.push(item);
    }
  });

  return cleaned;
}

// creates readable stream
let parser = parse({ columns: true }, async (err, companies) => {
  let uniqueCompanies = await removeDuplicates(companies);
  console.log(uniqueCompanies);
});

// take csv file and parse it
fs.createReadStream(__dirname + "/original-company-list.csv").pipe(parser);
