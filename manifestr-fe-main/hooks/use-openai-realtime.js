import { useEffect, useRef, useState, useCallback } from 'react';

export function useOpenAIRealtime({
    onTranscriptUpdate,
    onStateChange,
    onClose,
    onGenerate // Add this
}) {
    const [isConnected, setIsConnected] = useState(false);
    const [isAiSpeaking, setIsAiSpeaking] = useState(false);
    const peerConnectionRef = useRef(null);
    const dataChannelRef = useRef(null);
    const audioElRef = useRef(null);
    const analyserRef = useRef(null);
    const audioContextRef = useRef(null);
    const streamRef = useRef(null);
    const isConnectingRef = useRef(false);
    const isActiveRef = useRef(false);

    // Keep fresh refs to callbacks to avoid dependency cycles
    const callbacksRef = useRef({ onTranscriptUpdate, onStateChange, onClose, onGenerate });
    useEffect(() => {
        callbacksRef.current = { onTranscriptUpdate, onStateChange, onClose, onGenerate };
    }, [onTranscriptUpdate, onStateChange, onClose, onGenerate]);

    // Audio element setup
    useEffect(() => {
        const audio = new Audio();
        audio.autoplay = true;
        audioElRef.current = audio;
        return () => {
            audio.pause();
            audio.srcObject = null;
        };
    }, []);

    const disconnect = useCallback(() => {
        isActiveRef.current = false;
        isConnectingRef.current = false;

        if (audioContextRef.current) {
            audioContextRef.current.close();
            audioContextRef.current = null;
        }

        // 1. Close PeerConnection
        if (peerConnectionRef.current) {
            peerConnectionRef.current.close();
            peerConnectionRef.current = null;
        }

        // 2. Stop Local Stream (Microphone)
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(t => t.stop());
            streamRef.current = null;
        }

        // 3. Stop Remote Audio
        if (audioElRef.current) {
            audioElRef.current.pause();
            audioElRef.current.srcObject = null;
        }

        setIsConnected(false);
        setIsAiSpeaking(false);

        if (callbacksRef.current.onStateChange) {
            callbacksRef.current.onStateChange('idle');
        }
    }, []);

    const connect = useCallback(async () => {
        if (isConnectingRef.current || isConnected) return;

        isConnectingRef.current = true;
        isActiveRef.current = true;

        try {
            // 1. Get ephemeral token
            const tokenResponse = await fetch('/api/realtime-session', { method: 'POST' });
            const data = await tokenResponse.json();

            if (!isActiveRef.current) return; // Abort if disconnected during fetch
            if (!tokenResponse.ok) throw new Error(data.error || 'Failed to get token');

            const EPHEMERAL_KEY = data.client_secret.value;

            // 2. Initialize PC
            const pc = new RTCPeerConnection();
            peerConnectionRef.current = pc;

            // 3. Set up Audio Element for AI playback
            pc.ontrack = (event) => {
                if (audioElRef.current && event.streams[0]) {
                    audioElRef.current.srcObject = event.streams[0];
                }
            };

            // 4. Add User Mic
            const ms = await navigator.mediaDevices.getUserMedia({
                audio: {
                    channelCount: 1,
                    echoCancellation: true,
                    autoGainControl: true,
                    noiseSuppression: true
                }
            });

            // Audio Analysis Setup
            try {
                const AudioContext = window.AudioContext || window.webkitAudioContext;
                const audioCtx = new AudioContext();
                // Ensure context is running (it should be since this is triggered by click, but good to be safe)
                await audioCtx.resume();

                const analyser = audioCtx.createAnalyser();
                analyser.fftSize = 256;
                // Connect User Mic
                const source = audioCtx.createMediaStreamSource(ms);
                source.connect(analyser);

                analyserRef.current = analyser;
                audioContextRef.current = audioCtx;
            } catch (e) {
            }

            if (!isActiveRef.current) { // Abort if disconnected
                ms.getTracks().forEach(t => t.stop());
                pc.close();
                return;
            }

            streamRef.current = ms;
            // Check if PC is still open before adding track
            if (pc.signalingState !== 'closed') {
                pc.addTrack(ms.getTracks()[0]);
            } else {
                return;
            }

            // 5. Data Channel Setup
            const dc = pc.createDataChannel("oai-events");
            dataChannelRef.current = dc;

            dc.onopen = () => {
                if (!isActiveRef.current) return;
                setIsConnected(true);

                // 1. Configure Session
                sendEvent({
                    type: "session.update",
                    session: {
                        instructions: `You are Manny, an expert document creation assistant. 
Your GOAL: Gather requirements to generate a Presentation, Document, or Spreadsheet.

FLOW:
1. Greet and ask what they want to create.
2. Ask for TOPIC and STYLE.
3. Once clear, ask to PROCEED.
4. If confirmed, call 'generate_document' IMMEDIATELY.

CONSTRAINTS:
- Keep it brief.
- Stay on topic.`,
                        turn_detection: { type: 'server_vad' },
                        tools: [
                            {
                                type: "function",
                                name: "generate_document",
                                description: "Calls generation API. Use this IMMEDIATELY after user says 'go ahead' or confirms.",
                                parameters: {
                                    type: "object",
                                    properties: {
                                        prompt: { type: "string" },
                                        style_guide_id: { type: "number", nullable: true },
                                        output: { type: "string", enum: ["presentation", "document", "spreadsheet"] },
                                        meta: { type: "object" }
                                    },
                                    required: ["prompt", "output"]
                                }
                            }
                        ]
                    }
                });

                // 2. Trigger Initial Greeting
                sendEvent({ type: "response.create" });
            };

            dc.onmessage = (e) => {
                if (!isActiveRef.current) return;
                const event = JSON.parse(e.data);
                // console.log("Realtime Event:", event.type); // Reduce noise

                if (event.type === 'response.audio.speech_started') {
                    setIsAiSpeaking(true);
                    if (callbacksRef.current.onStateChange) callbacksRef.current.onStateChange('speaking');
                }
                else if (event.type === 'response.audio.speech_done') {
                    setIsAiSpeaking(false);
                    if (callbacksRef.current.onStateChange) callbacksRef.current.onStateChange('listening');
                }
                else if (event.type === 'response.output_item.done') {
                    const { item } = event;
                    if (item.type === 'function_call') {
                        if (item.name === 'generate_document') {
                            try {
                                const args = JSON.parse(item.arguments);
                                if (callbacksRef.current.onGenerate) {
                                    callbacksRef.current.onGenerate(args);
                                }
                            } catch (err) {
                            }
                        }
                    }
                }
                else if (event.type === 'response.audio_transcript.delta') {
                    const delta = event.delta;
                    if (delta.includes('[CLOSE_APP]')) {
                        if (callbacksRef.current.onClose) callbacksRef.current.onClose();
                    } else {
                        if (callbacksRef.current.onTranscriptUpdate) {
                            callbacksRef.current.onTranscriptUpdate(delta);
                        }
                    }
                }
            };

            // 6. Offer / Answer - THIS IS ASYNC and MUST be here
            const offer = await pc.createOffer();
            if (pc.signalingState === 'closed') return;
            await pc.setLocalDescription(offer);

            const baseUrl = "https://api.openai.com/v1/realtime";
            const model = "gpt-4o-realtime-preview-2024-12-17";
            const sdpResponse = await fetch(`${baseUrl}?model=${model}`, {
                method: "POST",
                body: offer.sdp,
                headers: {
                    Authorization: `Bearer ${EPHEMERAL_KEY}`,
                    "Content-Type": "application/sdp",
                },
            });

            if (!isActiveRef.current) return;

            const answerSdp = await sdpResponse.text();
            if (pc.signalingState !== 'closed') {
                await pc.setRemoteDescription({
                    type: "answer",
                    sdp: answerSdp,
                });
            }

        } catch (err) {
            disconnect();
        } finally {
            isConnectingRef.current = false;
        }
    }, []);

    const sendEvent = (event) => {
        if (dataChannelRef.current && dataChannelRef.current.readyState === 'open') {
            dataChannelRef.current.send(JSON.stringify(event));
        }
    };

    return {
        connect,
        disconnect,
        isConnected,
        isAiSpeaking,
        audioAnalyser: analyserRef.current
    };
}
