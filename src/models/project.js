const ObjectID = require('bson-objectid');

function Project(options) {
  this.id = options.id ? ObjectID(options.id) : undefined;
  this.name = options.name;
  this.isOwner = options.isOwner;
  this.color = options.color;
  this.closed = options.closed || false;
  this.muted = options.muted || false;
  this.groupId = options.groupId ? ObjectID(options.id) : undefined;
}

module.exports = Project;

// Project structure from api response
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
