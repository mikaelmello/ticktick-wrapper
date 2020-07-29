/** @module Models */

const ObjectID = require('bson-objectid');
const conn = require('./connection');
const Task = require('./task');

/**
 * List model
 * @class
 * @param {Object} properties - Properties of the {@link List}
 * @param {string} [properties.id=ObjectID()] - Object ID of the list, only defined when this is an
 * instantiation of a pre-existing list. On new lists this must be empty in order
 * to generate a new ObjectID
 * @param {string} properties.name - Name of the list
 * @param {bool} [properties.isOwner=True] - Whether the authenticated user is the owner of the
 * list,defaults to true when creating new lists.
 * @param {string=} properties.color - Color of the list
 * @param {bool} [properties.closed=False] - Whether the list is closed
 * @param {muted} [properties.muted=False] - Whether the list is muted
 * @param {string=} properties.groupId - If the list belongs to a group, this is its id.
 */
class List {
  constructor(properties) {
    this.id = properties.id || ObjectID();
    this.name = properties.name;
    this.isOwner = !(properties.isOwner === false);
    this.color = properties.color;
    this.closed = properties.closed || false;
    this.muted = properties.muted || false;
    this.groupId = properties.groupId;
  }

  /**
   * Adds a task to the current List
   * @param {string} title - Title of the task
   * @param {string=} content - Description of the task
   * @param {Date=} date - Date assigned to the task
   * @param {boolean=} isAllDay - Whether the task is assigned for date's entire day or the
   * specifc time
   * @param {Reminder[]} reminders - Reminders of the task
   */
  async addSimpleTask(title, content, date, isAllDay, reminders) {
    const task = new Task({
      title,
      content,
      listId: this.id,
      startDate: date,
      isAllDay,
      reminders,
    });
    task.save();
  }

  /**
   * Get all tasks from the list that are uncompleted
   * @private
   * @returns {Task[]} Tasks with status equal to TODO
   */
  async getTodoTasks(/* filter */) {
    const options = {
      uri: `${conn.baseUri}/project/${this.id}/tasks`,
      json: true,
    };
    const rawTasks = await conn.request(options);
    const objectTasks = rawTasks.map(task => new Task(task));

    // For some reason some completed tasks are included in the response,
    // we must filter them out
    return objectTasks.filter(task => task.status === Task.Status.TODO);
  }

  /**
   * Get all tasks from the list that are completed
   * @private
   * @returns {Task[]} Tasks with status equal to COMPLETED
   */
  async getCompletedTasks(/* filter */) {
    const options = {
      uri: `${conn.baseUri}/project/${this.id}/completed`,
      json: true,
    };
    const rawTasks = await conn.request(options);
    const objectTasks = rawTasks.map(task => new Task(task));

    // For some reason some completed tasks are included in the response,
    // we must filter them out
    return objectTasks.filter(task => task.status === Task.Status.COMPLETED);
  }
}

module.exports = List;
