@echo off

rem タイピングのスコアをエクセルとテーブルに記録するバッチ(21時に自動で実行される)

rem ↓これがないとスケジューラに登録できない
cd %~dp0

node regist

echo.