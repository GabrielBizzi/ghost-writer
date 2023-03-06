import natural from "natural";
import db from "./db.json" assert {type: "json"};
import { textContains } from "./utils.js";

export const search = (phrase) => {
  var result = [];

  phrase = natural.NGrams.ngrams(phrase, 1)
    .map((i) => natural.PorterStemmer.stem(i[0]))
    .join(" ");

  for (var post of db) {
    if (!textContains(post.content, phrase)) continue;
    result.push(post.url);
  }

  console.log(result);

  return result;
};

search("how to make coffee")