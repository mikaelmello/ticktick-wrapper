const ObjectID = require('bson-objectid');

class InvalidUnitError extends Error {
  constructor(unit) {
    super(`The unit "${unit}" is invalid`);
  }
}

function Reminder(options) {
  this.id = options.id || ObjectID();
  this.trigger = options.trigger || 'TRIGGER:PT0S';
}

Reminder._create = function _create(quantity, unit) {
  let trigger;

  if (!quantity) { // undefined or 0
    trigger = 'TRIGGER:PT0S';
  } else {
    const unitLc = unit.toLowerCase();
    let unitChar;

    if (unitLc === 'seconds' || unitLc === 's') {
      unitChar = 'S';
    } else if (unitLc === 'minutes' || unitLc === 'm') {
      unitChar = 'M';
    } else if (unitLc === 'hours' || unitLc === 'h') {
      unitChar = 'H';
    } else if (unitLc === 'days' || unitLc === 'd') {
      unitChar = 'D';
    } else {
      throw new InvalidUnitError();
    }

    trigger = `TRIGGER:-PT${quantity}${unitChar}`;
  }

  return new Reminder({ trigger });
};

module.exports = Reminder;

// Reminder structure from api response
// {
//   id: '5c342818e4b04a7154bfea3a',
//   trigger: 'TRIGGER:PT0S',
// }