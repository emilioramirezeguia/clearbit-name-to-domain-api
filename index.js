require("dotenv").config();

const fs = require("fs");
const parse = require("csv-parse");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const _ = require("lodash");
const clearbit = require("clearbit")(process.env.API_KEY);
const NameToDomain = clearbit.NameToDomain;

// this will help create the finished csv
const csvWriter = createCsvWriter({
  path: __dirname + "/deduped-company-list.csv",
  header: [
    { id: "name", title: "Company Names" },
    { id: "domain", title: "Domain" },
  ],
});

// remove duplicate values
function removeDuplicates(companies) {
  // empty array to store unique company names
  let cleaned = [];
  // iterate through each company in the companies array
  companies.forEach((company) => {
    let unique = true;
    // for each company in the array, iterate through the cleaned array
    cleaned.forEach((clean) => {
      // if the company in the array is equal to one in the cleaned array
      if (_.isEqual(company, clean)) {
        // mark it as not unique
        unique = false;
      }
    });
    // otherwise, if it's unique
    if (unique) {
      // push it to the unique company list
      cleaned.push(company);
    }
  });

  return cleaned;
}

// run unique company names through the Clearbit name-to-domain API
function nameToDomain(companies) {
  // search for the domain of that specific company
  companies.map((company) => {
    NameToDomain.find({ name: company["Company Names"] })
      .then((response) => {
        // write a new record in the deduped-company-list.csv file
        csvWriter.writeRecords([response]);
      })
      .catch((error) => {
        console.log("Domain could not be found");
      });
  });
}

// creates readable stream
let parser = parse(
  { columns: true, skip_empty_lines: true, trim: true },
  (err, companies) => {
    let uniqueCompanies = removeDuplicates(companies);
    nameToDomain(uniqueCompanies);
  }
);

// take csv file and parse it
fs.createReadStream(__dirname + "/original-company-list.csv").pipe(parser);
