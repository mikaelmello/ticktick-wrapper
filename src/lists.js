/** @module Services */

const conn = require('./connection');
const List = require('./list');

const getAll = async function _getAll(/* filter */) {
  const options = {
    uri: `${conn.baseUri}/projects`,
    json: true,
  };

  const rawLists = await conn.request(options);

  // map raw lists to object lists
  return rawLists.map(list => new List(list));
};

module.exports = {
  getAll,
};
