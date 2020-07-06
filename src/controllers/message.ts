import { MessageChannel } from "worker_threads";

const Message = require('../models/message');

exports.addMsg = ({ title, text }) => new Promise(async (resolve, reject) => {
  console.log(text)
  try {
    if (!title) {
      resolve({
        success: false,
        message: 'title is required'
      });
      return;
    }

    const newMsg = new Message({
      title,
      text
    });

    const messg = await newMsg.save();

    resolve({
      success: true,
      data: messg
    })

    resolve({
      success: true
    });
  }
  catch (err) {
    reject(err);
  }
});

exports.getMsg = ({ id }) => new Promise(async (resolve, reject) => {
  try {
    if (!id) {
      resolve({
        success: false,
        message: 'ID is required'
      });
      return;
    }

    const message = await Message.findById(id);

    resolve({
      success: true,
      data: message
    })
  }
  catch (err) {
    reject(err);
  }
});

exports.getAllMsg = () => new Promise(async (resolve, reject) => {
  try {
    const messages = await Message.find();

    resolve({
      success: true,
      data: messages
    })
  }
  catch (err) {
    reject(err);
  }
});

exports.updateMsg = ({ id, title, text }) => new Promise(async (resolve, reject) => {
  try {
    if (!id) {
      resolve({
        success: false,
        message: 'ID is required'
      });
      return;
    }

    const message = await Message.findById(id)

    if (!title) {
      message.set({ text });
      await message.save();
    }

    if (!text) {
      message.set({ title });
      await message.save();
    }

    resolve({
      success: true,
      data: message
    })
  }
  catch (err) {
    reject(err);
  }
});

exports.deleteMsg = ({ id }) => new Promise(async (resolve, reject) => {
  try {
    if (!id) {
      resolve({
        success: false,
        message: 'ID is required'
      });
      return;
    }

    const message = await Message.findByIdAndDelete(id);

    resolve({
      success: true,
      data: message
    })
  }
  catch (err) {
    reject(err);
  }
});