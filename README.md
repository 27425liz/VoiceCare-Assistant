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

## 🛠️ 技术栈

### 前端
- **开发语言**：ArkTS (TypeScript)
- **UI框架**：HarmonyOS ArkUI 3.0
- **状态管理**：LocalStorage + @StorageProp
- **网络请求**：@ohos.net.http

### 后端
- **开发语言**：Java 17
- **框架**：Spring Boot 3.x
- **数据库**：MySQL 8.0 + Redis 7.0
- **安全**：Spring Security + JWT
- **AI集成**：通义千问SDK / OpenAI API

## 🚀 快速开始

### 环境要求
- DevEco Studio 3.1+
- HarmonyOS SDK API 9+
- JDK 17+
- MySQL 8.0
- Redis 7.0
- 
### 安装步骤

1. 克隆项目
git clone https://github.com/你的用户名/VoiceCare-Assistant.git
2. 打开项目
启动 DevEco Studio
File → Open → 选择项目目录
3.运行应用
连接模拟器或真机
点击运行按钮 ▶️

## 📊 功能测试

| 测试模块 | 测试项 | 预期结果 | 实际结果 |
|---------|-------|---------|---------|
| 用户认证 | 注册新用户 | 成功创建账户 | ✅ 通过 |
| 用户认证 | 登录并获取Token | 返回有效Token | ✅ 通过 |
| AI对话 | 发送普通问题 | 流式返回回答 | ✅ 通过 |
| AI对话 | 发送长问题 | 分段流式返回 | ✅ 通过 |
| 历史管理 | 查看历史对话 | 显示历史记录 | ✅ 通过 |
| 异常处理 | 网络断开 | 友好提示重试 | ✅ 通过 |

## 📄 开源协议
本项目基于 MIT 协议开源，详情见 [LICENSE](LICENSE) 文件。

## 📧 联系我
- 邮箱：2875787830@qq.com
