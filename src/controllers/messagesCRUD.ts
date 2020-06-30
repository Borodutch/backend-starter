import { result } from 'lodash';
import { error } from 'console';

const Message = require('../models/messages');
const mongoose = require('mongoose');

import { loadControllers } from 'koa-router-ts';
const router = loadControllers(`${__dirname}/../controllers`, {
  recurse: true,
});

// create new entry object to add to the DB
let entry0 = new Message({
  content: 'user message',
  user: 'Alex',
});

let CRUD = async () => {
  try {
    await logConnection();

    // find single entry by params from the query
    router.get('/findUser/:user', async ctx => {
      ctx.body = await Message.findOne({ user: ctx.params.user });
    });
    // find by id
    router.get('/findById/:id', async ctx => {
      ctx.body = await Message.findOne({
        _id: ctx.params.id,
      });
    });
    // find all entries
    router.get('/findAll', async ctx => {
      ctx.body = await Message.find({});
    });
    // post new message
    router.post('/add', ctx => {
      let entry = new Message({
        content: ctx.request.query.content,
        user: ctx.request.query.user,
      });
      if (entry.content || entry.user) entry.save();
      console.log('POST request');
      ctx.body = entry.content;
    });
    // update by id
    router.put('/putById/:id', async ctx => {
      console.log('PUT request');
      let query = { _id: ctx.params.id };
      let valuesToUpdate = ctx.query;
      ctx.body = await Message.findOneAndUpdate(query, valuesToUpdate);
    });
    // delete by id
    router.delete('/deleteById/:id', async ctx => {
      console.log('DELETE request');
      let del = await Message.findOneAndRemove({ _id: ctx.params.id });
      ctx.body = 'DELETED';
    });
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

CRUD();

// router.put('/putById/:id', async ctx => {
//   console.log('PUT request');
//   let updatedContent = await Message.findOneAndUpdate(
//     { _id: ctx.params.id },
//     { content: 'updated content' }
//   );
//   ctx.body = await updatedContent;
// });
