/** @module Services */

const Task = require('./task');
const conn = require('./connection');

/**
 * Task Service
 */
class Tasks {
  /**
   * Get all tasks that are uncompleted.
   * @private
   * @returns {Task[]} Tasks with status equal to TODO
   */
  async getUncompleted(/* filter */) {
    const options = {
      uri: `${conn.baseUri}/project/all/tasks`,
      json: true,
    };

    const rawTasks = await conn.request(options);
    const objectTasks = rawTasks.map(task => new Task(task));

    // For some reason some completed tasks are included in the response,
    // we must filter them out
    return objectTasks.filter(task => task.status === Task.Status.TODO);
  }
}

const tasks = new Tasks();
module.exports = tasks;
