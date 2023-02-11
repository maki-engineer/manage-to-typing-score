"use strict";
// 打／秒とミス数を受け取って、wpmとスコアを計算して出力する。

// スコア計算の関数
function scoreCalc(perSec, miss){
  let wpm            = perSec * 60;
  let correctPercent = 400 / (400 + miss);
  correctPercent   **= 3;
  let result         = Math.floor(wpm * correctPercent);

  return [Math.floor(wpm), result];
}

console.log("\n打／秒とミス数をスペース区切りで入力してエンターキーを押してください。");

const reader = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

reader.on("line", input => {
  const data   = input.split(" ");
  const perSec = parseFloat(data[0]);
  const miss   = Number(data[1]);

  const wpmAndScore = scoreCalc(perSec, miss);

  console.log("\n--------------------------------------------------");
  console.log("|                                                |");
  console.log("| wpm   ： " + wpmAndScore[0] + "                                   |");
  console.log("|                                                |");
  console.log("| スコア： " + wpmAndScore[1] + "                                   |");
  console.log("|                                                |");
  console.log("--------------------------------------------------");

  reader.close();
});
