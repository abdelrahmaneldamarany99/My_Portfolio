import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  X,
  Radio,
  Sparkles,
  Wifi,
  WifiOff,
  Activity,
  AlertCircle,
} from 'lucide-react';
import type { Language } from '../types/index.ts';

interface LiveVoiceAgentProps {
  language: Language;
  isOpen: boolean;
  onClose: () => void;
}

function floatTo16BitPCM(input: Float32Array): ArrayBuffer {
  const output = new DataView(new ArrayBuffer(input.length * 2));
  for (let i = 0; i < input.length; i++) {
    const s = Math.max(-1, Math.min(1, input[i]));
    output.setInt16(i * 2, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }
  return output.buffer;
}

function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binaryString = window.atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

export function LiveVoiceAgent({ language, isOpen, onClose }: LiveVoiceAgentProps) {
  const isAr = language === 'ar';
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [audioLevel, setAudioLevel] = useState<number>(0);
  const [hasApiKey, setHasApiKey] = useState<boolean>(true);

  const wsRef = useRef<WebSocket | null>(null);
  const inputAudioCtxRef = useRef<AudioContext | null>(null);
  const outputAudioCtxRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const activeSourcesRef = useRef<AudioBufferSourceNode[]>([]);
  const animFrameRef = useRef<number | null>(null);

  const stopAudioTracks = () => {
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    if (inputAudioCtxRef.current && inputAudioCtxRef.current.state !== 'closed') {
      inputAudioCtxRef.current.close().catch(() => {});
      inputAudioCtxRef.current = null;
    }
    if (outputAudioCtxRef.current && outputAudioCtxRef.current.state !== 'closed') {
      outputAudioCtxRef.current.close().catch(() => {});
      outputAudioCtxRef.current = null;
    }
    activeSourcesRef.current.forEach((src) => {
      try {
        src.stop();
      } catch {
        void 0;
      }
    });
    activeSourcesRef.current = [];
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }
  };

  const playAudioChunk = useCallback((base64Data: string) => {
    if (!outputAudioCtxRef.current) {
      outputAudioCtxRef.current = new (window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)({
        sampleRate: 24000,
      });
    }

    const ctx = outputAudioCtxRef.current;
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    const arrayBuffer = base64ToArrayBuffer(base64Data);
    const dataView = new DataView(arrayBuffer);
    const float32Data = new Float32Array(arrayBuffer.byteLength / 2);

    for (let i = 0; i < float32Data.length; i++) {
      const int16 = dataView.getInt16(i * 2, true);
      float32Data[i] = int16 < 0 ? int16 / 0x8000 : int16 / 0x7fff;
    }

    const audioBuffer = ctx.createBuffer(1, float32Data.length, 24000);
    audioBuffer.getChannelData(0).set(float32Data);

    const source = ctx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(ctx.destination);

    const now = ctx.currentTime;
    const startTime = Math.max(now, nextStartTimeRef.current);
    source.start(startTime);
    nextStartTimeRef.current = startTime + audioBuffer.duration;

    activeSourcesRef.current.push(source);
    setIsSpeaking(true);

    source.onended = () => {
      const idx = activeSourcesRef.current.indexOf(source);
      if (idx !== -1) {
        activeSourcesRef.current.splice(idx, 1);
      }
      if (activeSourcesRef.current.length === 0) {
        setIsSpeaking(false);
      }
    };
  }, []);

  const connectWebSocket = useCallback(() => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) return;

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/api/live`;

    setStatusMessage(isAr ? 'جاري الاتصال بجلسة Gemini Live...' : 'Connecting to Gemini Live session...');
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      setIsConnected(true);
      setStatusMessage(
        isAr ? 'متصل بمساعد الصوت المباشر. انقر لبدء التحدث' : 'Connected to the live voice assistant. Click to speak'
      );
    };

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.hasApiKey === false) {
          setHasApiKey(false);
        }
        if (msg.audio) {
          playAudioChunk(msg.audio);
        }
        if (msg.interrupted) {
          activeSourcesRef.current.forEach((s) => {
            try {
              s.stop();
            } catch {
              void 0;
            }
          });
          activeSourcesRef.current = [];
          if (outputAudioCtxRef.current) {
            nextStartTimeRef.current = outputAudioCtxRef.current.currentTime;
          }
          setIsSpeaking(false);
        }
        if (msg.error) {
          setStatusMessage(msg.error);
        }
      } catch (err) {
        console.error('Failed to parse WebSocket live message:', err);
      }
    };

    ws.onerror = () => {
      setIsConnected(false);
      setStatusMessage(isAr ? 'تعذر الاتصال بـ Live API' : 'Failed to connect to Live API bridge');
    };

    ws.onclose = () => {
      setIsConnected(false);
      setIsListening(false);
      setIsSpeaking(false);
    };
  }, [isAr, playAudioChunk]);

  const startListening = async () => {
    try {
      if (!inputAudioCtxRef.current) {
        inputAudioCtxRef.current = new (window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)({
          sampleRate: 16000,
        });
      }

      const ctx = inputAudioCtxRef.current;
      if (ctx.state === 'suspended') {
        await ctx.resume();
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          sampleRate: 16000,
          echoCancellation: true,
          noiseSuppression: true,
        },
      });
      mediaStreamRef.current = stream;

      const source = ctx.createMediaStreamSource(stream);
      const processor = ctx.createScriptProcessor(4096, 1, 1);
      processorRef.current = processor;

      processor.onaudioprocess = (e) => {
        const channelData = e.inputBuffer.getChannelData(0);

        let sum = 0;
        for (let i = 0; i < channelData.length; i++) {
          sum += channelData[i] * channelData[i];
        }
        const rms = Math.sqrt(sum / channelData.length);
        setAudioLevel(Math.min(1, rms * 5));

        const pcmBuffer = floatTo16BitPCM(channelData);
        const base64 = arrayBufferToBase64(pcmBuffer);

        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
          wsRef.current.send(JSON.stringify({ audio: base64 }));
        }
      };

      source.connect(processor);
      processor.connect(ctx.destination);

      setIsListening(true);
      setStatusMessage(isAr ? 'الميكروفون نشط: استمع إليك الآن...' : 'Microphone active: Listening live...');
    } catch (err) {
      console.error('Microphone error:', err);
      setStatusMessage(
        isAr ? 'يرجى السماح بالوصول إلى الميكروفون' : 'Microphone access denied or unavailable'
      );
    }
  };

  const stopListening = () => {
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      mediaStreamRef.current = null;
    }
    setIsListening(false);
    setAudioLevel(0);
    setStatusMessage(
      isAr ? 'تم إيقاف الميكروفون. انقر للتحدث مجدداً' : 'Microphone paused. Click to speak again'
    );
  };

  useEffect(() => {
    if (isOpen) {
      connectWebSocket();
    } else {
      stopListening();
      stopAudioTracks();
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    }

    return () => {
      stopListening();
      stopAudioTracks();
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl border dark:border-white/10 border-slate-300 dark:bg-[#0B101E] bg-white p-6 shadow-2xl overflow-hidden text-center">
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono dark:bg-blue-950/60 bg-blue-50 text-blue-600 dark:text-blue-400 border border-blue-500/20 mb-4">
          <Radio className="w-3.5 h-3.5 animate-pulse" />
          <span>Gemini Live API</span>
        </div>

        <h3 className="text-xl font-bold dark:text-white text-slate-900 mb-1">
          {isAr ? 'محادثة صوتية فورية' : 'Real-Time Voice Assistant'}
        </h3>
        <p className="text-xs dark:text-slate-400 text-slate-500 max-w-md mx-auto mb-6">
          {isAr
            ? 'تحدث صوتياً في الوقت الفعلي مع المساعد الذكي للاستفسار عن خبرات عبد الرحمن ومعماريات مشاريعه.'
            : 'Converse in real-time using low-latency PCM audio streaming.'}
        </p>

        <div className="relative w-48 h-48 mx-auto my-6 flex items-center justify-center">
          <div
            className={`absolute inset-0 rounded-full transition-transform duration-150 ${
              isSpeaking
                ? 'bg-blue-500/20 animate-ping'
                : isListening
                ? 'bg-emerald-500/20 animate-pulse'
                : 'bg-slate-500/10'
            }`}
            style={{
              transform: `scale(${1 + audioLevel * 0.4})`,
            }}
          />
          <div
            className={`w-36 h-36 rounded-full flex items-center justify-center border-2 shadow-2xl transition-all duration-200 ${
              isSpeaking
                ? 'border-blue-400 bg-gradient-to-tr from-blue-600 to-indigo-500 shadow-blue-500/50'
                : isListening
                ? 'border-emerald-400 bg-gradient-to-tr from-emerald-600 to-teal-500 shadow-emerald-500/50'
                : 'border-slate-300 dark:border-white/10 dark:bg-slate-800 bg-slate-100 shadow-slate-900/20'
            }`}
          >
            {isSpeaking ? (
              <Volume2 className="w-14 h-14 text-white animate-bounce" />
            ) : isListening ? (
              <Mic className="w-14 h-14 text-white animate-pulse" />
            ) : (
              <MicOff className="w-12 h-12 text-slate-400" />
            )}
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 mb-6">
          {isConnected ? (
            <span className="inline-flex items-center gap-1.5 text-xs font-mono text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
              <Wifi className="w-3.5 h-3.5" />
              Live WebSocket Connected
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-xs font-mono text-amber-500 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
              <WifiOff className="w-3.5 h-3.5" />
              Connecting...
            </span>
          )}
        </div>

        <p className="text-xs font-mono dark:text-slate-300 text-slate-600 mb-6 min-h-[20px]">
          {statusMessage}
        </p>

        {!hasApiKey && (
          <div className="mb-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-500 text-left flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>
              {isAr
                ? 'ملاحظة: يتطلب البث الصوتي المباشر ضبط متغير البيئة GEMINI_API_KEY على الخادم.'
                : 'Note: Live audio streaming requires the GEMINI_API_KEY environment variable to be set on the server.'}
            </span>
          </div>
        )}

        <div className="flex items-center justify-center gap-4">
          {!isListening ? (
            <button
              onClick={startListening}
              disabled={!isConnected}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold text-sm shadow-lg hover:shadow-emerald-500/30 transition-all cursor-pointer active:scale-95"
            >
              <Mic className="w-4 h-4" />
              <span>{isAr ? 'بدء التحدث المباشر' : 'Start Live Speaking'}</span>
            </button>
          ) : (
            <button
              onClick={stopListening}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-red-600 hover:bg-red-500 text-white font-semibold text-sm shadow-lg hover:shadow-red-500/30 transition-all cursor-pointer active:scale-95"
            >
              <MicOff className="w-4 h-4" />
              <span>{isAr ? 'كتم الميكروفون' : 'Mute Microphone'}</span>
            </button>
          )}

          <button
            onClick={onClose}
            className="px-5 py-3 rounded-full dark:bg-slate-800 bg-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700 dark:text-slate-200 text-slate-700 text-sm font-semibold transition-colors"
          >
            {isAr ? 'إنهاء' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
}
