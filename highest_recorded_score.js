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
console.log("| 2. ミス数が一番少ないスコアを出力します。      |");
console.log("| 3. スコアが一番高いスコアを出力します。        |");
console.log("|                                                |");
console.log("|                                                |");
console.log("|                                                |");
console.log("--------------------------------------------------");

const reader = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

reader.on("line", input => {
  const data   = input.split(" ");
  const perSec = parseFloat(data[0]);
  const miss   = Number(data[1]);

  const wpmAndScore = scoreCalc(perSec, miss);

  // スコアをエクセルとテーブルに更新する。

  reader.close();
});
