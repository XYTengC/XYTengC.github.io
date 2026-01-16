<#
.SYNOPSIS
  自动将本地修改上传到GitHub仓库

.DESCRIPTION
  该脚本会执行以下操作：
  1. 进入项目目录
  2. 检查Git状态
  3. 添加所有修改的文件
  4. 提交更改（使用指定的提交信息或默认信息）
  5. 推送到远程仓库

.PARAMETER CommitMessage
  可选参数，指定提交信息。如果不提供，将使用默认信息。

.EXAMPLE
  .\deploy.ps1 -CommitMessage "更新文章内容"
  使用指定的提交信息提交更改

.EXAMPLE
  .\deploy.ps1
  使用默认提交信息提交更改
#>

param (
    [string]$CommitMessage = "Update content"
)

# 设置项目目录
$ProjectDir = "e:\hducc\git_process\xytengc.github.io"

# 进入项目目录
Write-Host "进入项目目录: $ProjectDir" -ForegroundColor Cyan
Set-Location -Path $ProjectDir

# 检查Git状态
Write-Host "检查Git状态..." -ForegroundColor Yellow
git status

# 添加所有修改的文件
Write-Host "添加所有修改的文件..." -ForegroundColor Yellow
git add .

# 提交更改
Write-Host "提交更改，提交信息: $CommitMessage" -ForegroundColor Yellow
git commit -m "$CommitMessage"

# 推送到远程仓库
Write-Host "推送到远程仓库..." -ForegroundColor Yellow
git push origin master

# 检查操作结果
if ($LASTEXITCODE -eq 0) {
    Write-Host "部署成功！" -ForegroundColor Green
} else {
    Write-Host "部署失败，请检查错误信息。" -ForegroundColor Red
}

# 暂停以查看结果
Write-Host "按任意键退出..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey('NoEcho,IncludeKeyDown')
