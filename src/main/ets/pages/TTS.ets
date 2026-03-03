/*
 * 文本转语音的演示页面
 * */
import { textToSpeech } from '@kit.CoreSpeechKit';
import { BusinessError } from '@kit.BasicServicesKit';
import { PromptAction } from '@kit.ArkUI'; //弹框
import { UIContext } from '@kit.ArkUI'; //UI上下文对象
import PcmPlayer from './PcmPlayer';
// 创建tts对象
let tts: textToSpeech.TextToSpeechEngine
// 是否创建引擎，默认值为false
let engineCreated: boolean = false
@Entry
@Component
struct Index {
  // 1.用户输入的文本内容
  @State originalText: string = "\n\t\t古人学问无遗力，少壮工夫老始成；\n\t\t"
    // + "纸上得来终觉浅，绝知此事要躬行。\n\t\t";
  //2. 创建引擎的次数
  @State count: number = 0
  // 3.创建上下文对象
  @State uiContext: UIContext = this.getUIContext()
  // 4.获取弹框提示
  @State promptAction: PromptAction = this.uiContext.getPromptAction()
  // 5.实例化pcm对象
  private pcmPlayer: PcmPlayer = new PcmPlayer()
  build() {
    Column() {
    //多行文本输入框组件
      TextArea({placeholder: '请输入您要播报的文本内容', text: this.originalText})
        .border({
          width: 5,
          color: Color.Red,
          style: BorderStyle.Dotted
        })
        .onChange((val) => {
          this.originalText = val
      })
      Column({space: 15}) {
        //   调用接口的按钮
        Button('创建tts引擎').width("80%").onClick(() => {
          //1.更改创建引擎的状态
          engineCreated = true
          // 2.创建次数+1
          this.count ++
        //   3.创建引擎
          this.createByCallback()
        //   4.提示创建成功
          this.promptAction.showToast({
            message: "引擎创建成功",
            duration: 2000 //提示框的显示时长，单位ms
          })
        })
        Button('开始播报').width("80%").onClick(() => {
          if(engineCreated) {
          //   在创建引擎的情况下播报
            try {
              this.speak()
              this.promptAction.showToast({
                message: "开始播报",
                duration: 2000
              })
            }catch (error) {
              this.promptAction.showToast({
                message: "开始播报异常",
                duration: 2000
              })
            }
          }
        })
        Button('stop').width("80%").onClick(() => {
          try {
            //   判断引擎是否繁忙，是否在播报中
            let isBusy: boolean = tts.isBusy()
            // 判断渲染器是否繁忙
            let isPlaying: boolean = this.pcmPlayer.isPlaying()
            //   如果引擎繁忙，先暂停
            //   stop() 临时终端的操作，仅仅停止当前的语音合成任务和播放流程，
            //   关于TTS引擎的核心资源，例如引擎实例、配置的参数不会被释放，仍然保留在内存中
            if(isBusy) tts.stop()
            if(isPlaying) this.pcmPlayer.stop()
            this.promptAction.showToast({
              message: "stop"
            })
          }catch (err) {
            this.promptAction.showToast({
              message: "stop failed"
            })
          }
        })
        Button('是否繁忙').width("80%").onClick(() => {
          try {
            //   判断引擎是否繁忙，是否在播报中
            let isBusy: boolean = tts.isBusy()
            // 判断渲染器是否繁忙
            let isPlaying: boolean = this.pcmPlayer.isPlaying()
            this.promptAction.showToast({
              message: "播报状态：" + isBusy + "渲染器：" + isPlaying
            })
          }catch (err) {
            this.promptAction.showToast({
              message: "处理异常"
            })
          }
        })
        Button('shutdown').width("80%").onClick(() => {
          try {
          //   释放音频渲染器所有资源
            this.pcmPlayer.release()
            // 释放引擎 彻底关闭TTS引擎，释放所有关联资源，是’生命周期结束‘的操作
            tts.shutdown()
            engineCreated = false
            this.promptAction.showToast({
              message: "释放成功"
            })
          }catch (err) {
            this.promptAction.showToast({
              message: "释放异常"
            })
          }
        })
      }
      .margin({top: 30})
    }
    .justifyContent(FlexAlign.Center)
    .height('100%')
    .width('100%')
  }
//   创建引擎的回调函数
  private createByCallback() {
  //   1.创建引擎的参数
    let extraParam: Record<string, Object> = {
      "style": "interaction-broadcast", //交互广播
      "locate": "CN", //位置
      "name": "EngineName" //引擎名称
    }
  //   2.初始化参数
    let initParamInfo: textToSpeech.CreateEngineParams = {
      language: 'zh-CN',
      person: 0, //女生音色
      online: 1, //离线合成
      extraParams: extraParam
    }
  //   3.创建引擎
    try {
      textToSpeech.createEngine(initParamInfo, (err: BusinessError, textTS: textToSpeech.TextToSpeechEngine) => {
        if(!err) {
          console.info('创建引擎成功')
          tts = textTS
        }else {
          console.error(`code: ${err.code}, message: ${err.message}`)
        }
      })
    }catch (error) {
      console.error(`code: ${error.code}, message: ${error.message}`)
    }
  }
//   开始播报的回调函数
  private speak() {
    let speakListener: textToSpeech.SpeakListener = {
      //   开始播报回调
      onStart(requestID: string, response: textToSpeech.StartResponse) {
        console.info(`开始播报，requestID:${requestID}，response：${JSON.stringify(response)}`)
      },
      // 合成完成及播报完成
      onComplete(requestID: string, response: textToSpeech.CompleteResponse) {
        console.info(`合成完成及播报完成，requestID:${requestID}，response：${JSON.stringify(response)}`)
      },
      //   停止播报
      onStop(requestID: string, response: textToSpeech.StopResponse) {
        console.info(`停止播报，requestID:${requestID}，response：${JSON.stringify(response)}`)
      },
      // 返回音频流
      onData(requestId: string, audio: ArrayBuffer, response: textToSpeech.SynthesisResponse) {
        console.info(`返回音频流, requestId: ${requestId} sequence: ${JSON.stringify(response)} audio: ${JSON.stringify(audio)}`);
      },
      // 错误回调
      onError(requestId: string, errorCode: number, errorMessage: string) {
        if(errorCode === 1002300007) engineCreated = false
        console.error(`错误回调, requestId: ${requestId} errorCode: ${errorCode} errorMessage: ${errorMessage}`);
      }
    }
  //   设置回调
    tts.setListener(speakListener)
  //   设置播报相关参数
    let extraParam: Record<string, Object> = {
      "queueMode": 0,
      "speed": 1,
      "volume": 2,
      "languageContext": 'zh-CN',
      "audioType": "pcm",
      "soundChannel": 3,
      "playType": 1
    }
    let speakPar: textToSpeech.SpeakParams = {
      requestId: '123456' + Date.now(), //时间戳拼接，防止id重复
      extraParams: extraParam
    }
  //   合成
    try {
      tts.speak(this.originalText, speakPar)
    }catch (error) {
      console.error(`code: ${error.code}, msg: ${error.message}`)
    }
  }
}