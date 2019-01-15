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
  this.modifiedTime = formatDate(properties.modifiedTime);
  this.kind = properties.kind || 'TEXT'; // defaults to text unless told otherwise
  this.creator = properties.creator; // || loggedinUserId
  this.projectId = properties.projectId || properties.listId; // || inbox
  this.listId = properties.projectId || properties.listId; // || inbox
}

Task.Status = {
  TODO: 0,
  UNKNOWN: 1, // TODO - Discover  what is status 1
  COMPLETED: 2,
};

Task.Priority = {
  NONE: 0,
  LOW: 1,
  MEDIUM: 3,
  HIGH: 5,
};

Task.prototype._getAllUncompleted = async function _getAll(/* filter */) {
  const options = {
    uri: `${conn.baseUri}/project/all/tasks`,
    json: true,
  };

  const rawTasks = await conn.request(options);
  const objectTasks = rawTasks.map(task => new Task(task));

  // For some reason some completed tasks are included in the response,
  // we must filter them out
  return objectTasks.filter(task => task.status === Task.Status.TODO);
};

Task.prototype._add = async function _add() {
  const options = {
    method: 'POST',
    uri: `${conn.baseUri}/task`,
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
