#!/usr/bin/env bash
# shadow create - 跨平台项目脚手架 (Unix)
# 用法: shadow create [type] [project_name]
# type: web | flutter | springboot

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

get_repo() {
  case "$1" in
    web) echo "192114/front-template" ;;
    flutter) echo "192114/flutter_mvvm_template" ;;
    springboot) echo "192114/template" ;;
    *) echo "" ;;
  esac
}

interactive_mode() {
  if [[ -z "$TYPE" ]]; then
    echo "请选择项目类型:"
    echo "  1) web"
    echo "  2) flutter"
    echo "  3) springboot"
    read -rp "输入数字 (1-3): " choice
    case "$choice" in
      1) TYPE="web" ;;
      2) TYPE="flutter" ;;
      3) TYPE="springboot" ;;
      *) echo "无效选择"; exit 1 ;;
    esac
  fi
  if [[ -z "$PROJECT_NAME" ]]; then
    read -rp "输入项目名称: " PROJECT_NAME
    if [[ -z "$PROJECT_NAME" ]]; then
      echo "项目名称不能为空"
      exit 1
    fi
  fi
}

# 解析参数: $1=create, $2=type, $3=project_name
CMD="${1:-}"
TYPE="${2:-}"
PROJECT_NAME="${3:-}"

if [[ "$CMD" != "create" ]]; then
  echo "用法: shadow create [web|flutter|springboot] <project_name>"
  echo "  或: shadow create  (交互式)"
  exit 1
fi

if [[ -z "$TYPE" || -z "$PROJECT_NAME" ]]; then
  interactive_mode
fi

REPO=$(get_repo "$TYPE")
if [[ -z "$REPO" ]]; then
  echo "未知类型: $TYPE (支持: web, flutter, springboot)"
  exit 1
fi

echo "正在创建项目 $PROJECT_NAME (模板: $REPO)..."
if ! npx degit "$REPO" "$PROJECT_NAME"; then
  echo "创建失败"
  exit 1
fi

node "$SCRIPT_DIR/update-workspace.js" "$PROJECT_NAME"
echo "完成! 已添加至 workspace。"
