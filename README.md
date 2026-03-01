# VoiceCare-Assistant
专为老年人和视障人群设计的HarmonyOS语音助手关怀版应用，提供TTS/STT、紧急呼救、无障碍交互等功能。
# 语音助手关怀版 (VoiceCare Assistant)

![HarmonyOS](https://img.shields.io/badge/HarmonyOS-3.0+-blue)
![API Version](https://img.shields.io/badge/API-9+-green)
![License](https://img.shields.io/badge/License-MIT-orange)


### 🎯 目标用户
- 老年人（视力下降、操作不便）
- 视障人士
- 需要语音辅助的各类用户

## ✨ 核心功能

### 🗣️ 文本转语音 (TTS)
- 输入文本自动转换为语音播报
- 智能分段处理长文本
- 支持语速、音量、音色调节
- 暂停/继续/停止播放控制

### 🎤 语音转文本 (STT)
- 实时语音识别与命令控制
- 内置常用语音命令（"打开首页"、"打电话"等）
- 识别历史记录保存
- 语音命令智能解析

### 🆘 紧急呼救系统
- 一键拨打紧急联系人
- 自动发送求助短信
- 多重确认防止误触
- 联系人便捷管理

### ⚙️ 个性化设置
- 语音参数定制（语速1-5档）
- 无障碍设置（字体大小16-24sp）
- 高对比度模式
- 语音引导开关

### 🔍 快捷功能
- 实时时间/日期显示
- 常用短语快捷按钮
- 使用帮助语音引导

## 🏗️ 项目结构
VoiceCare-Assistant/
├── entry/
│ └── src/
│ └── main/
│ ├── ets/
│ │ ├── pages/ # 页面文件
│ │ │ ├── Login.ets # 登录/欢迎页
│ │ │ ├── Home.ets # 主页面
│ │ │ ├── TTS.ets # 文本转语音
│ │ │ ├── STT.ets # 语音转文本
│ │ │ └── Settings.ets # 设置页面
│ │ ├── service/ # 服务层
│ │ │ ├── TTSManager.ts # TTS管理
│ │ │ └── STTManager.ts # STT管理
│ │ ├── utils/ # 工具类
│ │ │ ├── Emergency.ts # 紧急呼救
│ │ │ └── SpeechUtil.ts # 语音工具
│ │ └── model/ # 数据模型
│ │ └── LocalStorageManager.ts
│ └── resources/ # 资源文件

## 🚀 快速开始

### 环境要求
- DevEco Studio 3.1+
- HarmonyOS SDK API 9+
- Node.js 16+
技术栈
开发语言：ArkTS (TypeScript)
UI框架：HarmonyOS ArkUI 3.0
语音服务：@kit.CoreSpeechKit
状态管理：LocalStorage + @StorageProp
数据持久化：localStorage
