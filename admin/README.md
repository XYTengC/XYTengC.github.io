# 博客管理后台配置说明

## 1. 概述
本目录包含博客管理后台（Netlify CMS）的配置文件，用于管理博客文章。

## 2. 配置说明

### 2.1 主要配置文件
- `config.yml`：Netlify CMS的主要配置文件，定义了后端连接、媒体文件夹和文章集合
- `index.html`：CMS的入口页面，负责初始化Netlify CMS和Netlify Identity Widget

### 2.2 后端配置
配置文件中使用了以下后端设置：
- **GitHub仓库**：xytengc/xytengc.github.io
- **分支**：main
- **认证类型**：implicit
- **GitHub App ID**：Ov23liXGBUIHeygkv3Vu
- **认证端点**：https://api.netlify.com/auth
- **Netlify Identity**：已启用

### 2.3 文章集合配置
- **名称**：posts
- **标签**：博客文章
- **存储位置**：_posts
- **自动生成slug**：基于日期和标题
- **字段**：标题、发布日期、更新日期、分类、标签、头图、摘要、正文

## 3. 使用说明

### 3.1 访问管理后台
1. 访问 https://xytengc.github.io/admin/
2. 点击"Login with GitHub"按钮
3. 使用您的GitHub账号登录
4. 授权应用访问您的仓库
5. 成功登录后，您将看到Netlify CMS的管理界面

### 3.2 创建新文章
1. 在管理界面点击"New Blog Post"按钮
2. 填写文章标题、发布日期等信息
3. 在正文编辑器中编写文章内容
4. 点击"Save"按钮保存草稿
5. 点击"Publish"按钮发布文章

### 3.3 编辑现有文章
1. 在管理界面点击要编辑的文章
2. 修改文章内容
3. 点击"Save"按钮保存修改
4. 点击"Publish"按钮发布更新

## 4. 认证说明

### 4.1 GitHub OAuth配置
- 已在GitHub上注册了OAuth应用
- 回调URL设置为：https://api.netlify.com/auth/done
- 已配置正确的App ID

### 4.2 Netlify Identity
- 已启用Netlify Identity服务
- 认证端点：https://verdant-blini-6e761d.netlify.app/.netlify/identity

## 5. 本地开发

### 5.1 启动本地服务器
```bash
bundle exec jekyll serve
```

### 5.2 访问本地管理后台
1. 访问 http://localhost:4000/admin/
2. 点击"Login with GitHub"按钮
3. 完成GitHub登录授权
4. 测试管理功能

## 6. 故障排除

### 6.1 登录问题
- 检查GitHub App的回调URL是否正确配置
- 确保GitHub App的权限设置正确
- 检查Netlify Identity服务是否正常运行

### 6.2 发布问题
- 确保您对仓库有写权限
- 检查GitHub App的权限设置
- 查看浏览器控制台是否有错误信息

## 7. 安全建议

- 定期检查应用的访问日志
- 只授予应用必要的权限
- 定期更新应用的密钥
- 启用双因素认证

## 8. 联系方式

如有任何问题，请联系管理员。