const Promise = require('bluebird');
const _ = require('lodash');
const GoogleSpreadsheet = require('google-spreadsheet');
const creds = require('../googleConfig.json');

const doc = new GoogleSpreadsheet(creds.spreadsheet_id);

const init = function init() {
  return new Promise(resolve => doc.useServiceAccountAuth(creds, resolve));
};

module.exports = {
  init,
  getContent: (sheetName, columnNames) => new Promise((resolve) => {
    doc.getInfo((infoErr, info) => {
      if (infoErr) {
        throw new Error(infoErr);
      }
      const sheet = _.find(info.worksheets, workSheet => workSheet.title === sheetName);
      sheet.getRows({}, (err, rows) => {
        if (err) {
          throw new Error(err);
        }
        const content = {};
        columnNames.forEach(col => (content[col] = []));
        rows.forEach(r => columnNames.forEach((col) => {
          // Filter out empty strings and other falsy
          if (r[col]) {
            content[col].push(r[col]);
          }
        }));
        resolve(content);
      });
    });
  }),
};
