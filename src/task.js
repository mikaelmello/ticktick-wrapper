const ObjectID = require('bson-objectid');
const conn = require('./connection');

class InvalidDateFormatError extends Error {
  constructor(date) {
    super(`The provided date "${date}" is invalid`);
  }
}

function formatDate(date) {
  if (date === undefined) {
    return date;
  }

  let dateString = date;
  if (date instanceof Date) {
    dateString = date.toISOString();
  } else if (typeof dateString !== 'string') {
    throw new InvalidDateFormatError();
  }

  return dateString.replace('Z', '+0000');
}

function Task(options) {
  this.id = options.id || ObjectID();
  this.title = options.title;
  this.content = options.content;
  this.startDate = formatDate(options.startDate);
  this.dueDate = formatDate(options.dueDate);
  this.timeZone = options.timeZone;
  this.isAllDay = options.isAllDay || false;
  this.priority = options.priority || Task.Priority.NONE;
  this.status = options.status || Task.Status.TODO;
  this.items = options.items || []; // && options.items.map(item => new Item(item));
  this.reminder = options.reminder;
  this.reminders = options.reminders || [];
  this.progress = options.progress;
  this.modifiedTime = formatDate(options.modifiedTime);
  this.createdTime = formatDate(options.createdTime);
  this.kind = options.kind || 'TEXT'; // defaults to text unless told otherwise
  this.creator = options.creator; // || loggedinUserId
  this.projectId = options.projectId || options.listId; // || inbox
  this.listId = options.projectId || options.listId; // || inbox
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

  console.log(options.body);
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
