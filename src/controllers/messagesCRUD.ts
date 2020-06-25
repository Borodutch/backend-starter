import { result } from 'lodash';
import { error } from 'console';

const Message = require('../models/messages');
const mongoose = require('mongoose');

// create new entry object to add to the DB
let entry = new Message({
  content: 'user message',
  user: 'Alex',
});

let CRUD = async () => {
  try {
    await logConnection();

    // saving
    let entrySaved = await entry.save();
    if (!entrySaved) throw new Error('saving unsuccessful');

    // finding
    let entryFound = await findingEntry({ user: 'Alex' });
    if (!entryFound) throw new Error('search unsuccessful');

    // updating
    let entryUpdated = await updatingEntry(
      { user: 'Alex' },
      { content: 'new content' }
    );
    if (!entryUpdated) throw new Error('finding and updating unsuccessful');

    // deleting
    await deletingEntry({ user: 'Alex' });

    console.log('CRUD cycle ended');
  } catch (err) {
    console.error(err);
  }
};

const logConnection = async () => {
  await mongoose.connection
    .once('open', () => {
      console.log('successfully connected to messagesDB');
    })
    .on('error', err => {
      console.log('Error occured: ', err);
    });
};

const findingEntry = async (query: object) => {
  console.log('finding...');
  return Message.findOne(query);
};

const updatingEntry = async (oldEntry: object, newENtry: object) => {
  console.log('finding and updating...');
  return await Message.findOneAndUpdate(oldEntry, newENtry);
};

const deletingEntry = async (query: object) => {
  console.log('deleting...');
  await Message.findOneAndRemove(query);
};

CRUD();
