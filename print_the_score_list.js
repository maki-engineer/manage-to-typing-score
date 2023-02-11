"use strict";
// タイピングのスコアリストを出力(過去7日間)

// SQLite3導入
const sqlite3 = require("sqlite3");
const db      = new sqlite3.Database("typing_score.db");

let text = "";

db.all("select * from scores where id > (select max(id) from scores) - 7", (err, rows) => {
  rows.forEach(row => {
    text += row.date + "　wpm： " + row.wpm + "　miss： " + row.miss + "　score： " + row.score + "\n";
  });

  console.log(text);
});
