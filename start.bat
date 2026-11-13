@echo off
rem Double-click to run the site on a local server and open it in the browser.
cd /d "%~dp0"
start "" http://localhost:5173
node serve.mjs
