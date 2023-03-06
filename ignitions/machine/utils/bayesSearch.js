"use strict";

import natural from "natural";
import db from "./db.json" assert {type: "json"};
import { getPost, makeId } from "./utils.js";

makeId(db);

var classifier = new natural.BayesClassifier();

for (var post of db) {
  classifier.addDocument(post.content, post.id);
}
classifier.train();

export const search = (str) => {
  var result = [];
  var classified = classifier.getClassifications(str).slice(0, 5);

  for (var cls of classified) {
    var post = getPost(db, cls.label);
    if (post) result.push(post.url);
  }
  console.log(result);
  return result;
};

search("how to make coffee");