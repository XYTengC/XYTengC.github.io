# 文件图标出现黑底

解决办法，右键桌面-显示设置，把缩放比例调到150%以下  
打开 命令提示符 (CMD) 并以管理员身份运行，输入以下命令 


> taskkill /f /im explorer.exe  

> del /f /s /q %LocalAppData%\Microsoft\Windows\Explorer\thumbcache_*.db 

> start explorer.exe  