@echo off
setlocal EnableDelayedExpansion
REM shadow create - 跨平台项目脚手架 (Windows)
REM 用法: shadow create [type] [project_name]
REM type: web | flutter | springboot

set "SCRIPT_DIR=%~dp0"
set "SCRIPT_DIR=%SCRIPT_DIR:~0,-1%"

set "CMD=%~1"
set "TYPE=%~2"
set "PROJECT_NAME=%~3"

if "%CMD%"=="" set "CMD=create"
if "%CMD%" neq "create" (
  echo 用法: shadow create [web^|flutter^|springboot] ^<project_name^>
  echo   或: shadow create  ^(交互式^)
  exit /b 1
)

if "%TYPE%"=="" goto interactive
if "%PROJECT_NAME%"=="" goto interactive
goto resolve_repo

:interactive
if "%TYPE%"=="" (
  echo 请选择项目类型:
  echo   1^) web
  echo   2^) flutter
  echo   3^) springboot
  set "choice="
  set /p choice=输入数字 (1-3): 
  if "!choice!"=="1" set "TYPE=web"
  if "!choice!"=="2" set "TYPE=flutter"
  if "!choice!"=="3" set "TYPE=springboot"
  if "!TYPE!"=="" (
    echo 无效选择
    exit /b 1
  )
)
if "%PROJECT_NAME%"=="" (
  set "PROJECT_NAME="
  set /p PROJECT_NAME=输入项目名称: 
  if "!PROJECT_NAME!"=="" (
    echo 项目名称不能为空
    exit /b 1
  )
)
goto resolve_repo

:resolve_repo
if "%TYPE%"=="web" set "REPO=192114/front-template"
if "%TYPE%"=="flutter" set "REPO=192114/flutter_mvvm_template"
if "%TYPE%"=="springboot" set "REPO=192114/template"

if "%REPO%"=="" (
  echo 未知类型: %TYPE% (支持: web, flutter, springboot^)
  exit /b 1
)

echo 正在创建项目 %PROJECT_NAME% (模板: %REPO%)...
call npx degit %REPO% %PROJECT_NAME%
if errorlevel 1 (
  echo 创建失败
  exit /b 1
)

node "%SCRIPT_DIR%\update-workspace.js" "%PROJECT_NAME%"
echo 完成! 已添加至 workspace。
exit /b 0
