/** @module Models */

const ObjectID = require('bson-objectid');
const conn = require('./connection');
const utils = require('./utils');

/**
 * Task model
 * @class
 * @param {Object} properties - Properties of the {@link Task}
 * @param {string} [properties.id=ObjectID()] - Object ID of the tasks, only defined when this is an
 * instantiation of a pre-existing tasks. On new taskss this must be empty in order
 * to generate a new ObjectID
 * @param {string} properties.title - Title of the task
 * @param {string=} properties.content - Description of the task
 * @param {Date|string} [properties.startDate=] - When the task is set to start. If it is a string
 * it must have the format YYYY-MM-DDTHH:mm:ss.sss+0000 or YYYY-MM-DDTHH:mm:ss.sssZ
 * @param {Date|string} [properties.dueDate=] - When the task is set to end. If it is a string
 * it must have the format YYYY-MM-DDTHH:mm:ss.sss+0000 or YYYY-MM-DDTHH:mm:ss.sssZ
 * @param {string=} properties.timeZone - Timezone used for the triggering of the task reminders
 * and assigned date. If empty it will be set to the account's default.
 * @param {boolean} [properties.isAllDay=False] - Whether the task is set to take the entire day
 * @param {Task.Priority} [properties.priority=Task.Priority.NONE] - Priority of the task
 * @param {Task.Status} [properties.status=Task.Status.TODO] - Status of the task
 * @param {Object[]} [properties.items=[]] - Items of the task
 * @param {Reminder=} properties.reminder - Closest reminder
 * @param {Reminder[]} [properties.reminders=[]] - Reminders of the task
 * @param {Number=} properties.progress - Progress of items, from 0 to 100
 * @param {Task.Kind} [properties.kind=Task.Kind.TEXT] - Task kind
 * @param {string=} properties.creator - User id of the task creator
 * @param {string=} properties.listId - List in which the task belongs
 * @param {string=} properties.repeatFlag - A set of flags that make a task repeatable
 */
function Task(properties) {
  this.id = properties.id || ObjectID();
  this.title = properties.title;
  this.content = properties.content;
  this.startDate = utils.formatDate(properties.startDate);
  this.dueDate = utils.formatDate(properties.dueDate);
  this.timeZone = properties.timeZone;
  this.isAllDay = properties.isAllDay || false;
  this.priority = properties.priority || Task.Priority.NONE;
  this.status = properties.status || Task.Status.TODO;
  this.items = properties.items || []; // && properties.items.map(item => new Item(item));
  this.reminder = properties.reminder;
  this.reminders = properties.reminders || [];
  this.progress = properties.progress;
  this.kind = properties.kind || Task.Kind.TEXT; // defaults to text unless told otherwise
  this.creator = properties.creator; // || loggedinUserId
  this.projectId = properties.projectId || properties.listId; // || inbox
  this.listId = properties.projectId || properties.listId; // || inbox
  this.repeatFlag = properties.repeatFlag;
}

/**
 * Current status of the task
 * @enum {Number}
 */
Task.Status = {
  TODO: 0,
  UNKNOWN: 1, // TODO - Discover  what is status 1
  COMPLETED: 2,
};

/**
 * Priority of the task
 * @enum {Number}
 */
Task.Priority = {
  NONE: 0,
  LOW: 1,
  MEDIUM: 3,
  HIGH: 5,
};

/**
 * Task kind
 * @enum {string}
 */
Task.Kind = {
  TEXT: 'TEXT',
  CHECKLIST: 'CHECKLIST',
};

/**
 * Saves task in TickTick by sending a request to TickTick's API
 * @private
 * @returns Request response
 */
Task.prototype.save = async function _save() {
  const options = {
    method: 'POST',
    uri: `${conn.baseUri}/task`,
    json: true,
    body: this,
  };

  return conn.request(options);
};

/**
 * Update a task in TickTick by sending a request to TickTick's API using the task ID
 * @private
 * @returns Request response
 */
Task.prototype.update = async function _update() {
  const options = {
    method: 'PUT',
    uri: `${conn.baseUri}/task/${this.id}`,
    json: true,
    body: this,
  };

  return conn.request(options);
};

module.exports = Task;

// Task structure from api response
// {
//   id: '5c336b84b4fb395ec6529b79',
//   projectId: '5c0eee65e4b00d057d2e5499',
//   sortOrder: -25838523252736,
//   title: 'Lançar nightly para testar últimas mudanças',
//   content: '',
//   startDate: '2019-01-08T11:00:00.000+0000',
//   dueDate: '2019-01-08T11:00:00.000+0000',
//   timeZone: 'America/Sao_Paulo',
//   isAllDay: false,
//   reminder: 'TRIGGER:PT0S',
//   reminders: [ [Object] ],
//   repeatFirstDate: '2019-01-08T11:00:00.000+0000',
//   exDate: [],
//   completedTime: '2019-01-08T14:09:54.222+0000',
//   completedUserId: 114837412,
//   priority: 0,
//   status: 2,
//   items: [],
//   progress: 0,
//   modifiedTime: '2019-01-08T14:09:54.223+0000',
//   etag: '9fumekc5',
//   deleted: 0,
//   createdTime: '2019-01-07T15:08:59.021+0000',
//   creator: 114837412,
//   kind: 'TEXT'
// }
