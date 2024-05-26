@echo off
cd %~dp0
call node removeBOM.js
call notepad group.json
call formatGroup.js
call parse2.bat