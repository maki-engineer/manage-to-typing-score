"use strict";
// 打／秒とミス数を受け取って、スコアをエクセルとテーブルに更新する。その日のデータがない場合は、新しく記録する。

// SQLite3導入
const sqlite3 = require("sqlite3");
const db      = new sqlite3.Database("typing_score.db");

// モジュール導入
const xlsxPopulate = require("xlsx-populate");

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
let today_month = now.getMonth() + 1;
let today_date  = now.getDate();
let today       = today_month + "月" + today_date + "日";

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
  
  // 最高スコアをエクセルとテーブルに記録する
  xlsxPopulate.fromFileAsync("data.xlsx").then(workbook => {
    let rowIndex = 3;
  
    while(true){
      if(workbook.sheet("タイピング").cell("B" + String(rowIndex)).value()){
        if(workbook.sheet("タイピング").cell("B" + String(rowIndex)).value() === today){
          // 更新(row_index の行に結果を記録)
          workbook.sheet("タイピング").cell("B" + String(rowIndex)).value(today);
          workbook.sheet("タイピング").cell("C" + String(rowIndex)).value(wpmAndScore[0]);
          workbook.sheet("タイピング").cell("D" + String(rowIndex)).value(miss);
          workbook.sheet("タイピング").cell("E" + String(rowIndex)).value(wpmAndScore[1]);
    
          // データを更新
          db.run("update scores set wpm = ?, miss = ?, score = ? where date = ?", wpmAndScore[0], miss, wpmAndScore[1], today);

          // 上書き保存
          workbook.toFileAsync("data.xlsx").then(result => {
            console.log("タイピングのスコアをエクセルとテーブルに更新しました！");
          });

          setTimeout(() => {
            return;
          }, 5_000);
  
          break;
        }else{
          rowIndex++;
        }
      }else{
        // 新しくデータを記録
        workbook.sheet("タイピング").cell("B" + String(rowIndex)).value(today);
        workbook.sheet("タイピング").cell("C" + String(rowIndex)).value(wpmAndScore[0]);
        workbook.sheet("タイピング").cell("D" + String(rowIndex)).value(miss);
        workbook.sheet("タイピング").cell("E" + String(rowIndex)).value(wpmAndScore[1]);

        // テーブルにデータ追加
        db.run("insert into scores(date, wpm, miss, score) values(?, ?, ?, ?)", today, wpmAndScore[0], miss, wpmAndScore[1]);

        // 上書き保存
        workbook.toFileAsync("data.xlsx").then(result => {
          console.log("新しくjタイピングのスコアをエクセルとテーブルに記録しました！");
        });

        setTimeout(() => {
          return;
        }, 5_000);

        break;
      }
    }
  });

  reader.close();
});
