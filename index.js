const fs = require("fs");
const parse = require("csv-parse");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const _ = require("lodash");

// this will help create the finished csv
const csvWriter = createCsvWriter({
  path: __dirname + "/deduped-company-list.csv",
  header: [{ id: "Company Names", title: "Company Names" }],
});

// remove duplicate values
function removeDuplicates(arr) {
  // empty array to store unique company names
  let cleaned = [];

  // iterate through each item in the array
  arr.forEach((item) => {
    let unique = true;

    // for each item in the array, iterate through the cleaned array
    cleaned.forEach((item2) => {
      // if the item in the array is equal to one in the cleaned array
      if (_.isEqual(item, item2)) {
        // mark it as not unique
        unique = false;
      }
    });

    // otherwise
    if (unique) {
      // then push it to the unique company list
      cleaned.push(item);
    }
  });

  return cleaned;
}

// creates readable stream
let parser = parse({ columns: true }, async (err, companies) => {
  let uniqueCompanies = await removeDuplicates(companies);
  csvWriter.writeRecords(uniqueCompanies);
});

// take csv file and parse it
fs.createReadStream(__dirname + "/original-company-list.csv").pipe(parser);
