const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {

  counter.getNextUniqueId(function(extra, idVar) {
    id = idVar;

    let fileName = `${id}.txt`;
    let fullPath = path.join(exports.dataDir, fileName);

    fs.writeFile(fullPath, text, (err) => {
      if (err) {
        console.log('Write File Error');
      } else {
        console.log('This file has been saved');
        callback(null, { id, text });
      }
    });
  });


};




exports.readAll = (callback) => {


  fs.readdir(exports.dataDir, (err, items) => {
    if (err) {
      console.log('Found error reading dir');
    } else {
      var data = _.map(items, (text, id) => {
        return ( {id: text.slice(0, 5), text: text.slice(0, 5) });
      });
      callback(null, data);
    }
  });
};

exports.readOne = (id, callback) => {

  let fileName = `${id}.txt`;
  let fullPath = path.join(exports.dataDir, fileName);

  fs.readFile(fullPath, (err, data) => {

    if (err) {
      console.log('error');
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback(null, { id, text: data.toString() });
    }
  });

};

exports.update = (id, text, callback) => {

  let fileName = `${id}.txt`;
  let fullPath = path.join(exports.dataDir, fileName);
  fs.readFile(fullPath, (err, data) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      fs.writeFile(fullPath, text, (err) => {
        if (err) {
          callback(new Error(`No item with id: ${id}`));
        } else {
          callback(null, { id, text});
        }
      });
    }
  });


  // fs.writeFile(fullPath, text, (err) => {

  //   if (err) {
  //     callback(new Error(`No item with id: ${id}`));
  //   } else {
  //     console.log('Success in updating file');
  //     callback(null, { id, text });
  //   }
  // });




  // var item = items[id];
  // if (!item) {
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   items[id] = text;
  //   callback(null, { id, text });
  // }
};

exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
