/** @module Models */

const ObjectID = require('bson-objectid');

/**
 * Class that represents a Reminder used in {@link Task}s.
 * @class
 * @param {Object} properties - Properties of the {@link Reminder}.
 * @param {string=} properties.id - Object ID of the Reminder, only defined when this is an
 * instantiation of a pre-existing reminder. On new reminders this must be empty in order
 * to generate a new ObjectID
 * @param {string=} properties.trigger - Custom trigger in the pre-defined format
 * /^TRIGGER:-?PT[0-9]+[SMHD]$/
 */
function Reminder(properties) {
  this.id = properties.id || ObjectID();
  this.trigger = properties.trigger || 'TRIGGER:PT0S';
}

/**
 * Enum for the time unit used in the creation of a reminder
 * @readonly
 * @enum {Number}
 */
Reminder.TimeUnit = {
  /** Used when the reminder is set in seconds */
  SECONDS: 0,
  /** Used when the reminder is set in minutes */
  MINUTES: 1,
  /** Used when the reminder is set in hours */
  HOURS: 2,
  /** Used when the reminder is set in days */
  DAYS: 3,
};

/**
 * Error thrown when a call to create a {@link Reminder} is made
 * with an invalid time unit parameter.
 */
Reminder.InvalidUnitError = class extends Error {
  constructor(unit) {
    super(`The unit "${unit}" is invalid`);
  }
};

/**
 * Creates a reminder object to be used when creating a {@link Task}. The reminder
 * will go off at {quantity} {units} before the date set for the {@link Task}.
 * @param {Number} quantity - Quantity of unit.
 * @param {Reminder.TimeUnit} unit - Unit of time
 */
Reminder._create = function _create(quantity, unit) {
  let trigger;

  if (!quantity) { // undefined or 0
    trigger = 'TRIGGER:PT0S';
  } else {
    const unitLc = unit.toLowerCase();
    let unitChar;

    if (unitLc === Reminder.TimeUnit.SECONDS) {
      unitChar = 'S';
    } else if (unitLc === Reminder.TimeUnit.MINUTES) {
      unitChar = 'M';
    } else if (unitLc === Reminder.TimeUnit.HOURS) {
      unitChar = 'H';
    } else if (unitLc === Reminder.TimeUnit.DAYS) {
      unitChar = 'D';
    } else {
      throw new Reminder.InvalidUnitError();
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
