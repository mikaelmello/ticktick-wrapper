/** @module Services */

const Task = require('./task');
const conn = require('./connection');

/**
 * Get all tasks that are uncompleted.
 * @private
 * @returns {Task[]} Tasks with status equal to TODO
 */
const getUncompleted = async function _getUncompleted(/* filter */) {
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

module.exports = {
  getUncompleted,
};
