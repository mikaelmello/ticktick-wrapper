const ObjectID = require('bson-objectid');
const conn = require('./connection');
const Task = require('./task');

function List(properties) {
  this.id = properties.id || ObjectID();
  this.name = properties.name;
  this.isOwner = !(properties.isOwner === false);
  this.color = properties.color;
  this.closed = properties.closed || false;
  this.muted = properties.muted || false;
  this.groupId = properties.groupId;
}

List._getAll = async function _getAll(/* filter */) {
  const options = {
    uri: `${conn.baseUri}/projects`,
    json: true,
  };

  const rawLists = await conn.request(options);
  return rawLists.map(list => new List(list));
};

List.prototype.addSimpleTask = async function _addST(title, content, date, isAllDay, reminders) {
  const task = new Task({
    title,
    content,
    listId: this.id,
    startDate: date,
    isAllDay,
    reminders,
  });
  task._add();
};

module.exports = List;

// List structure from api response
// {
//   id: '5c342818e4b04a7154bfea3a',
//   name: 'Any',
//   isOwner: true,
//   color: null,
//   inAll: true,
//   sortOrder: 5634997092352,
//   sortType: 'sortOrder',
//   userCount: 1,
//   etag: 'nhkgjsie',
//   modifiedTime: '2019-01-08T14:04:43.161+0000',
//   closed: null,
//   muted: false,
//   groupId: '5c0eee2aedcd255b9cfde1c0',
// }
