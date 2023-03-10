"use strict";
// タイピングのスコアをエクセルとテーブルに記録

// SQLite3導入
const sqlite3 = require("sqlite3");
const db      = new sqlite3.Database("typing_score.db");

// モジュール導入
const xlsxPopulate = require("xlsx-populate");
const fs           = require("fs");

// スコア計算の関数
function scoreCalc(perSec, miss){
  let wpm            = perSec * 60;
  let correctPercent = 400 / (400 + miss);
  correctPercent   **= 3;
  let result         = Math.floor(wpm * correctPercent);

  return [Math.floor(wpm), result];
}

// タイピングのスコアをエクセルとテーブルに記録する
let now         = new Date();
let today_year  = now.getFullYear();
let today_month = now.getMonth() + 1;
let today_date  = now.getDate();
let formatYear  = today_year.toString().slice(-2);
let formatMonth = today_month.toString().padStart(2, "0");
let formatDate  = today_date.toString().padStart(2, "0");
let fileName    = formatYear + formatMonth + formatDate + "t.txt";
let today       = today_month + "月" + today_date + "日";

fs.readdir("E:/タイプウェル国語R/JR全履歴", (err, files) => {
  files.forEach(file => {
      if(file === fileName){
        let highScores;
        let highScore  = 0;
        let text       = fs.readFileSync("E:/タイプウェル国語R/JR全履歴/" + file);
        let lines      = text.toString().split("\n");
        lines.pop();

        lines.forEach(line => {
          let datas  = line.split(",");
          let miss   = Number(datas[13].trim());
          let time   = parseFloat(datas[3].trim());
          let perSec = Math.floor((400 / time) * 100) / 100;
          let scores = scoreCalc(perSec, miss);

          if(highScore < scores[1]){
            highScore  = scores[1];
            highScores = [scores[0], miss, scores[1]];
          }
        });

        // 最高スコアをエクセルとテーブルに記録する
        xlsxPopulate.fromFileAsync("data.xlsx").then(workbook => {
          let rowIndex = 3;

          while(true){
            if(workbook.sheet("タイピング").cell("B" + String(rowIndex)).value()){
              // すでに記録されてたら記録しないように
              if(workbook.sheet("タイピング").cell("B" + String(rowIndex)).value() === today){
                break;
              }else{
                rowIndex++;
              }
            }else{
              // 新しく記録(row_index の行に結果を記録)
              workbook.sheet("タイピング").cell("B" + String(rowIndex)).value(today);
              workbook.sheet("タイピング").cell("C" + String(rowIndex)).value(highScores[0]);
              workbook.sheet("タイピング").cell("D" + String(rowIndex)).value(highScores[1]);
              workbook.sheet("タイピング").cell("E" + String(rowIndex)).value(highScores[2]);

              // テーブルにデータ追加
              db.run("insert into scores(date, wpm, miss, score) values(?, ?, ?, ?)", today, highScores[0], highScores[1], highScores[2]);

              // 上書き保存
              workbook.toFileAsync("data.xlsx").then(result => {
                console.log("タイピングのスコアをエクセルとテーブルに記録しました！");
              });

              setTimeout(() => {
                return;
              }, 5_000);

              break;
            }
          }
        });
      }
  });
});
