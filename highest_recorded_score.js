"use strict";
/**
 * タイピングの最高記録を出力する。
 * 1. wpmが一番速いスコアを出力
 * 2. ミス数が一番少ないスコアを出力
 * 3. スコアが一番高いスコアを出力
 */

// SQLite3導入
const sqlite3 = require("sqlite3");
const db      = new sqlite3.Database("typing_score.db");

console.log("--------------------------------------------------");
console.log("|                                                |");
console.log("| 1. wpmが一番速いスコアを出力します。           |");
console.log("|                                                |");
console.log("| 2. ミス数が一番少ないスコアを出力します。      |");
console.log("|                                                |");
console.log("| 3. スコアが一番高いスコアを出力します。        |");
console.log("|                                                |");
console.log("--------------------------------------------------");

console.log("\nどの最高スコアを表示させますか？ 1 か 2 か 3 を入力してエンターキーを押してください。");

const reader = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

reader.on("line", command => {
  // wpmが一番速いスコアを出力
  if((command === "1") || (command === "１")){
    db.all("select date, max(wpm) from scores", (err, rows) => {
      console.log("\n最速wpm： " + String(rows[0]["max(wpm)"]) + "\n最速wpm更新日時： " + String(rows[0]["date"]));
    });
  // ミス数が一番少ないスコアを出力
  }else if((command === "2") || (command === "２")){
    db.all("select max(wpm), miss, max(score) from scores where miss = (select min(miss) from scores)", (err, rows1) => {
      console.log("\n最小ミス数： " + String(rows1[0]["miss"]) + "\n最小ミス時最速wpm： " + String(rows1[0]["max(wpm)"]) + "\n最小ミス時最高スコア： " + String(rows1[0]["max(score)"]));
    });
  // スコアが一番高いスコアを出力
  }else if((command === "3") || (command === "３")){
    db.all("select date, max(score) from scores", (err, rows) => {
      console.log("\n最高スコア： " + String(rows[0]["max(score)"]) + "\n最高スコア更新日時： " + String(rows[0]["date"]));
    });
  }

  reader.close();
});
