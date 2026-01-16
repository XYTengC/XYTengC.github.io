@echo off

:: 显示欢迎信息
echo =======================================
echo   GitHub 自动部署脚本
echo =======================================
echo.

:: 检查是否提供了提交信息
if "%1"=="" (
    set "COMMIT_MESSAGE=Update content"
) else (
    set "COMMIT_MESSAGE=%*"
)

echo 提交信息: %COMMIT_MESSAGE%
echo.

:: 进入项目目录
echo 进入项目目录...
cd /d "e:\hducc\git_process\xytengc.github.io"

echo.
echo 检查Git状态...
git status
echo.

echo 添加所有修改的文件...
git add .
echo.

echo 提交更改...
git commit -m "%COMMIT_MESSAGE%"
echo.

echo 推送到远程仓库...
git push origin master
echo.

:: 检查操作结果
if %ERRORLEVEL%==0 (
    echo 部署成功！
) else (
    echo 部署失败，请检查错误信息。
)

echo.
echo 按任意键退出...
pause > nul
