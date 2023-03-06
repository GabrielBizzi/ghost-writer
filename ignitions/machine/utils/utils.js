"use strict";

import natural from "natural";

export const textContains = (text, phrase) => {
  if (!text) return false;
  if (!phrase) return true;

  text = text.toLowerCase();
  var words = phrase.toLowerCase().split(/ +/g);

  for (var word of words) {
    if (!text.includes(word)) return false;
  }
  return true;
};

export const makeId = (db) => {
  var maxId = db.length - 1;
  var lenId = maxId.toString(2).length;
  var prefix = "0".repeat(lenId);

  for (var i = 0; i <= maxId; i++) {
    db[i].id = i / maxId;
  }
};

export const getPost = (db, id) => {
  for (var post of db) {
    if (post.id === id) return post;
  }
  return null;
};

export const makeDict = (db, num) => {
  num = num || 1;
  var dict = {};
  var words = [];

  for (var post of db) {
    for (var stem of natural.NGrams.ngrams(post.content, 1)) {
      var word = stem[0];
      if (word.length < 3) continue;
      if (words.includes(word)) continue;
      words.push(word);
    }
  }

  var wMax = words.length;
  for (var i = 1; i <= wMax; i++) {
    dict[words[i - 1]] = i / wMax;
  }

  return dict;
};

export const makeSet = (db, dict) => {
  var set = [];

  for (var post of db) {
    var words = [];
    for (var stem of natural.NGrams.ngrams(post.content, 1)) {
      var word = stem[0];
      if (word.length < 3) continue;
      words.push(word);
    }

    var phrase = words.join(" ");

    for (var stems of natural.NGrams.ngrams(phrase, 10)) {
      var input = [];
      for (var word of stems) {
        input.push(dict[word]);
      }
      set.push({
        input: input,
        output: [post.id],
      });
    }
  }

  return set;
};

export const makeInput = (str, dict) => {
  var input = [];
  for (var stem of natural.NGrams.ngrams(str, 1)) {
    var word = stem[0];
    if (word.length < 3) continue;
    if (!dict[word]) continue;
    input.push(dict[word]);
  }

  var i = 0;
  while (input.length < 10) {
    input.push(input[i++]);
  }
  return input;
};

export const joinWords = (a1, a2) => {
  for (var i = 0; i < a1.length; i++) {
    a1[i] = a1[i] | a2[i];
  }
  return a1;
};

export const getStems = (str, num) => {
  var stems = [];
  var ngrams = natural.NGrams.ngrams(str, num);
  for (var ngram of ngrams) {
    var stem = "";
    for (var ng of ngram) {
      stem += natural.PorterStemmer.stem(ng);
    }
    stems.push(stem);
  }
  return stems;
};
