# VoiceCare-Assistant
专为老年人和视障人群设计的HarmonyOS语音助手关怀版应用，提供TTS/STT、紧急呼救、无障碍交互等功能。
# 语音助手关怀版 (VoiceCare Assistant)

![HarmonyOS](https://img.shields.io/badge/HarmonyOS-3.0+-blue)
![API Version](https://img.shields.io/badge/API-9+-green)
![License](https://img.shields.io/badge/License-MIT-orange)

# 鸿蒙AI助手 - HarmonyOS AI Assistant

## 🛠️ 技术栈
- **前端**：HarmonyOS (ArkTS, ArkUI)
- **后端**：Spring Boot / Java
- **数据库**：MySQL / Redis
- **AI能力**：通义千问API / ChatGPT API
- **特色功能**：JWT鉴权、流式输出、对话历史

## 🚀 核心功能
- ✅ 用户注册与登录（Token鉴权）
- ✅ AI智能问答（流式输出）
- ✅ 对话历史管理
- ✅ 异常处理与加载动画

## 🧠 项目亮点与难点解决
1. **AI响应优化**：针对AI接口响应慢的问题，实现了流式输出，提升用户体验
2. **状态管理**：在HarmonyOS中管理登录状态和对话上下文
3. **错误处理**：完善的异常捕获机制，API调用失败时给予友好提示

## 🔧 如何运行
1. 下载本项目到本地
2. 用DevEco Studio打开
3. 配置API密钥（在`entry/src/main/ets/common/Constants.ets`中）
4. 运行到模拟器或真机

## 📝 待改进
- 增加本地数据库存储对话历史
- 优化UI动画效果
- 支持多轮对话上下文理解

## 📧 联系我
- 邮箱：2875787830@qq.com
