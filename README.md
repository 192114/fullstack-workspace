# Fullstack Workspace

本工作空间提供 `shadow create` 交互式命令，用于从模板快速创建 web/flutter/springboot 项目。

## 前置要求

- Node.js（用于 `npx degit` 和 `shadow.js`）
- 需在**工作空间根目录**执行命令（项目会创建在当前目录）

## 执行方式

| 平台 | 命令 | 说明 |
|------|------|------|
| 全平台 | `node bin/shadow.js create [type] [name]` | 推荐，Node 根据系统调用对应脚本 |
| macOS/Linux | `./bin/shadow.sh create [type] [name]` | 需 `chmod +x bin/shadow.sh` |
| Windows CMD | `bin\shadow.cmd create [type] [name]` | 需在 CMD 中执行 |

## 使用示例

```bash
# 直接指定类型和项目名
node bin/shadow.js create web admin
node bin/shadow.js create flutter my_app
node bin/shadow.js create springboot backend

# 交互式（缺省参数时选择类型并输入项目名）
node bin/shadow.js create

# 只指定类型（会提示输入项目名）
node bin/shadow.js create web
```

## 模板映射

| type | 模板仓库 |
|------|----------|
| web | 192114/front-template |
| flutter | 192114/flutter_mvvm_template |
| springboot | 192114/template |

## 执行结果

- 使用 `npx degit` 拉取模板到当前目录
- 自动更新 `fullstack-workspace.code-workspace`，将新项目加入 `folders`

## 可选：添加快捷方式到 PATH

若希望在任何目录执行 `shadow create`，可将 `bin` 加入 PATH，或创建软链接。
