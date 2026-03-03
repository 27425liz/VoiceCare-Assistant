import audio from "@ohos:multimedia.audio";
import fs from "@ohos:file.fs";
// 2.定义日志标签，后续在日志中区分是PCM音频播放器的日志
const TAG = 'PCM_audio';
// 3.定义对象
class Options {
    offset?: number; //文件读取时的偏移量
    length?: number; //文件读取时的长度
}
// 4.定义工具类,并导出
export default class PcmPlayer {
    // 4.1未读取的音频文件
    public file: fs.File | undefined;
    // 4.2定义会被音频渲染器触发的回调函数,向渲染器写入要播放的PCM数据
    private writeDataCallback = (buffer: ArrayBuffer) => {
        let opt: Options = {
            offset: this.bufferSize,
            length: buffer.byteLength
        };
        try {
            // 4.3同步读取文件
            fs.readSync(this.file?.fd, buffer, opt);
            // 4.4更新已读取的缓冲区大小,把本次读取的字节长度加到 this.bufferSize 上，记录已读位置。
            this.bufferSize += buffer.byteLength;
            // 4.5判断是否读取完了: 如果已读取的音频大小超过音频总大小,说明读取完了
            if (this.audioDataSize < this.bufferSize) {
                this.renderModel?.off('writeData'); // 4.6移除writeData回调函数,不再触发读取
                void this.stop(); //4.7 调用stop方法停止播放（void 忽略返回值，避免异步函数未处理的警告）。
            }
            console.info(TAG, 'reading file success');
            // 系统会判定buffer有效，正常播放。
            return audio.AudioDataCallbackResult.VALID;
        }
        catch (error) {
            console.error(TAG, `Reading file failed, error code: ${error.code}, message: ${error.message}.`);
            // 系统会判定buffer无效，不播放。
            return audio.AudioDataCallbackResult.INVALID;
        }
    };
    /**
     * 缓存大小
     */
    private bufferSize: number = 0;
    /**
     * 音频总大小
     */
    private audioDataSize: number = 0;
    /**
     * 播放器
     */
    private renderModel: audio.AudioRenderer | null = null;
    /**
     * 播放状态
     */
    // 5.音频流信息配置对象，定义 PCM 音频的核心参数
    private audioStreamInfo: audio.AudioStreamInfo = {
        samplingRate: audio.AudioSamplingRate.SAMPLE_RATE_16000,
        channels: audio.AudioChannel.CHANNEL_1,
        sampleFormat: audio.AudioSampleFormat.SAMPLE_FORMAT_S16LE,
        encodingType: audio.AudioEncodingType.ENCODING_TYPE_RAW // 编码格式
    };
    // 6.音频渲染器的附加信息
    private audioRendererInfo: audio.AudioRendererInfo = {
        usage: audio.StreamUsage.STREAM_USAGE_ACCESSIBILITY,
        rendererFlags: 0 // 音频渲染器标志
    };
    // 7.创建音频渲染器的配置项，整合了音频流信息和渲染器附加信息。
    private audioRendererOptions: audio.AudioRendererOptions = {
        streamInfo: this.audioStreamInfo,
        rendererInfo: this.audioRendererInfo
    };
    // 8.异步初始化音频渲染器
    public async prepare(sampleRate: number) {
        // 8.1用传入的 sampleRate 更新音频流的采样率配置
        this.audioRendererOptions.streamInfo.samplingRate = sampleRate;
        // 8.2将音频流用途改为 MUSIC（音乐播放），适配音乐场景的音频策略。
        this.audioRendererOptions.rendererInfo.usage = audio.StreamUsage.STREAM_USAGE_MUSIC;
        // 8.3如果已有渲染器实例，先释放旧的资源（避免内存泄漏）。
        if (this.renderModel != null) {
            await this.renderModel.release();
        }
        // 8.4根据配置创建新的音频渲染器实例（异步操作）。
        let renderModel = await audio.createAudioRenderer(this.audioRendererOptions);
        if (!renderModel) {
            console.error(TAG, `failed to create audio renderer`);
        }
        console.info(TAG, "creating AudioRenderer success");
        this.renderModel = renderModel; // 8.5如果创建成功,将新创建的渲染器赋值给this.renderModel。
        this.bufferSize = await this.renderModel.getBufferSize(); //8.6获取音频渲染器的最小缓冲区大小
    }
    // 9.开始播放 PCM 音频
    public async play(data: ArrayBuffer): Promise<number> {
        this.audioDataSize = data.byteLength;
        if (this.renderModel != null) {
            try {
                this.renderModel.on('writeData', this.writeDataCallback);
            }
            catch (err) {
                console.error(`error code: ${err.code}, message: ${err.message}.`);
            }
            // 启动渲染
            await this.renderModel.start();
            console.info(TAG, "start AudioRenderer success");
        }
        return -1;
    }
    // 10.停止音频播放；先打印日志，如果渲染器不存在，直接返回。
    public async stop() {
        console.info(TAG, 'Renderer begin stop');
        if (this.renderModel == null) {
            return;
        }
        //11. 只有渲染器状态为running或paused的时候才可以停止
        if (this.renderModel.state !== audio.AudioState.STATE_RUNNING
            && this.renderModel.state !== audio.AudioState.STATE_PAUSED) {
            console.error(TAG, 'Renderer is not running or paused');
            return;
        }
        await this.renderModel.stop(); // 停止渲染
        console.info(TAG, 'Renderer stopped');
    }
    // 12.释放音频渲染器资源
    public async release() {
        // 渲染器状态不是released状态，才能release
        if (this.renderModel != null) {
            if (this.renderModel.state === audio.AudioState.STATE_RELEASED) { //如果渲染器已释放，打印错误日志并返回。
                console.error(TAG, 'Renderer already released');
                return;
            }
            await this.renderModel.release(); // 释放资源
            this.renderModel = null;
            console.info(TAG, 'Renderer released');
        }
    }
    /**
     * 13.判断当前渲染状态
     *
     * @returns running返回true，否则返回false
     */
    public isPlaying() {
        if (this.renderModel != null) {
            console.info(TAG, "player.state:" + this.renderModel.state);
            return this.renderModel.state == audio.AudioState.STATE_RUNNING;
        }
        else {
            return false;
        }
    }
}
