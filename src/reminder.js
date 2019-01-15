/** @module Models */

const ObjectID = require('bson-objectid');

/**
 * Class that represents a Reminder used when creating a {@link Task}. The reminder
 * will go off at {propertiesOrQty} {units} before the date set for the {@link Task}. Or at  the
 * specified {propertiesOrQty.trigger}.
 * @class
 * @param {Object|Number} propertiesOrQty - Properties of the {@link Reminder} or the quantity of
 * time before the start date in which the reminder will trigger
 * @param {string=} propertiesOrQty.id - Object ID of the Reminder, only defined when this is an
 * instantiation of a pre-existing reminder. On new reminders this must be empty in order
 * to generate a new ObjectID
 * @param {string=} propertiesOrQty.trigger - Custom trigger in the pre-defined format
 * /^TRIGGER:-?PT[0-9]+[SMHD]$/
 * @param {Reminder.TimeUnit} unit - Unit of time
 */
function Reminder(propertiesOrQty, unit) {
  if (unit === undefined) {
    this.id = propertiesOrQty.id || ObjectID();
    this.trigger = propertiesOrQty.trigger || 'TRIGGER:PT0S';
  } else {
    let unitChar;
    if (unit === Reminder.TimeUnit.SECONDS) {
      unitChar = 'S';
    } else if (unit === Reminder.TimeUnit.MINUTES) {
      unitChar = 'M';
    } else if (unit === Reminder.TimeUnit.HOURS) {
      unitChar = 'H';
    } else if (unit === Reminder.TimeUnit.DAYS) {
      unitChar = 'D';
    } else {
      throw new Reminder.InvalidUnitError();
    }

    this.id = ObjectID();
    this.trigger = `TRIGGER:-PT${propertiesOrQty}${unitChar}`;
  }
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
 * @class
 * @ignore
 */
Reminder.InvalidUnitError = class extends Error {
  constructor(unit) {
    super(`The unit "${unit}" is invalid`);
  }
};

module.exports = Reminder;

// Reminder structure from api response
// {
//   id: '5c342818e4b04a7154bfea3a',
//   trigger: 'TRIGGER:PT0S',
// }
