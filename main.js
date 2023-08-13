import inquirer from "inquirer";
import DocumentGenerator from "./utils/docx.js";
import Bing from "./ignitions/bing.js";
import Google from "./ignitions/google.js";
import Wikipedia from "./ignitions/wikipedia.js";
import Yahoo from "./ignitions/yahoo.js";

const sugestions = [
  "do a barrel roll",
  "askew",
  "atari breakout",
  "Super Mario Bros",
  "zerg rush",
  "anagrama",
  "graph for sin(x) + cos(y)",
  "the answer to life, the universe and everything",
  "i'm feeling curious",
  "pac man doodle",
  "thanos",
  "cara ou coroa",
  "random number generator",
  "exercício de respiração",
  "roll a dice",
  "jogo da velha",
  "color picker",
  "sons de animais",
];

const random = Math.floor(Math.random() * sugestions.length);

inquirer
  .prompt([
    {
      type: "input",
      name: "search",
      message: "What do you want to search?",
    },
    {
      type: "list",
      name: "ignition",
      message: "What ignition would you like to use?",
      choices: [
        "Wikipedia",
        {
          name: "Google",
          value: "Google"
        },
        {
          name: "Yahoo",
          value: "Yahoo",
          disabled: "Unavailable at this time",
        },
        {
          name: "Bing",
          value: "Bing",
          disabled: "Unavailable at this time",
        },
        {
          name: "Koda (Native option, he does a complete search with all ignitions)",
          value: "Koda",
          disabled: "Unavailable at this time",
        },
        {
          name: "Deep-Web (this option is released if you have an IPV4 encrypted to access)",
          value: "deepweb",
          disabled: "Unavailable at this time",
        },
      ],
      filter(val) {
        return val.toLowerCase();
      },
    },
    {
      type: "confirm",
      name: "format",
      message: "Format the file in ABNT standards?",
    },
  ])
  .then(async (answers) => {
    const text = answers.search || sugestions[random];
    const ignition = answers.ignition || "wikipedia";
    const format = answers.format || true;

    switch (ignition) {
      case "google":
        new Google({
          q: text,
          oq: text,
        }).search();

        return;
      case "bing":
        new Bing({
          q: text,
        }).search();

        return;
      case "yahoo":
        new Yahoo({
          p: text,
        }).search();

        return;
      case "wikipedia":
        const textFounded = await new Wikipedia({
          q: text,
        }).search();

        if (textFounded) {
          if (format) {
            new DocumentGenerator({
              content: textFounded,
              title: text,
            }).createWithFormatABNT();
          } else {
            new DocumentGenerator({
              content: textFounded,
              title: text,
            }).createWithoutFormatABNT();
          }
        }

        return;
    }
  });
