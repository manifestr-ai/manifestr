/**
 * Supabase Y.js Provider
 * 
 * Connects Y.js (CRDT for conflict-free collaboration) with Supabase Realtime
 * Enables Google Docs-style real-time collaboration without a dedicated WebSocket server
 * 
 * SAFE: This is a NEW file, doesn't modify existing code
 */

import * as Y from 'yjs';
import { SupabaseClient, RealtimeChannel } from '@supabase/supabase-js';

export class SupabaseProvider {
    private ydoc: Y.Doc;
    private documentId: string;
    private supabase: SupabaseClient;
    private channel: RealtimeChannel | null = null;
    private connected: boolean = false;
    private awareness: Map<number, any> = new Map();
    
    constructor(ydoc: Y.Doc, documentId: string, supabase: SupabaseClient) {
        this.ydoc = ydoc;
        this.documentId = documentId;
        this.supabase = supabase;
        
        this.connect();
    }

    private connect() {
        try {
            // Create Supabase Realtime channel for this document
            this.channel = this.supabase.channel(`doc:${this.documentId}`, {
                config: {
                    broadcast: { self: true }, // Receive own messages for confirmation
                    presence: { key: this.documentId }
                }
            });

            // Listen for Y.js updates from other users
            this.channel.on('broadcast', { event: 'yjs-update' }, (payload: any) => {
                try {
                    if (payload.payload?.update) {
                        const update = new Uint8Array(payload.payload.update);
                        Y.applyUpdate(this.ydoc, update);
                    }
                } catch (error) {
                    console.error('❌ Collaboration sync error:', error);
                }
            });

            // Listen for awareness updates (cursors, selections)
            this.channel.on('broadcast', { event: 'awareness' }, (payload: any) => {
                try {
                    if (payload.payload?.clientId && payload.payload?.state) {
                        this.awareness.set(payload.payload.clientId, payload.payload.state);
                        this.onAwarenessChange();
                    }
                } catch (error) {
                    console.error(' Failed to process awareness update:', error);
                }
            });

            // Send local Y.js updates to other users
            this.ydoc.on('update', (update: Uint8Array) => {
                if (this.connected && this.channel) {
                    this.channel.send({
                        type: 'broadcast',
                        event: 'yjs-update',
                        payload: { update: Array.from(update) }
                    });
                }
            });

            // Subscribe to channel
            this.channel.subscribe((status) => {
                if (status === 'SUBSCRIBED') {
                    this.connected = true;
                    this.onConnect();
                } else if (status === 'CLOSED') {
                    this.connected = false;
                    this.onDisconnect();
                } else if (status === 'CHANNEL_ERROR') {
                    this.onError();
                }
            });

        } catch (error) {
            console.error('❌ Failed to connect to Supabase Realtime:', error);
        }
    }

    // Broadcast awareness (cursor position, selection, user info)
    public setAwareness(state: any) {
        if (this.connected && this.channel) {
            this.channel.send({
                type: 'broadcast',
                event: 'awareness',
                payload: {
                    clientId: this.ydoc.clientID,
                    state: state
                }
            });
        }
    }

    // Get all aware clients
    public getAwareness(): Map<number, any> {
        return this.awareness;
    }

    // Disconnect and cleanup
    public destroy() {
        try {
            if (this.channel) {
                this.supabase.removeChannel(this.channel);
                this.channel = null;
            }
            this.connected = false;
            console.log('🔌 Provider destroyed');
        } catch (error) {
            console.error('❌ Error destroying provider:', error);
        }
    }

    // Event handlers (can be overridden)
    public onConnect = () => {};
    public onDisconnect = () => {};
    public onError = () => {};
    public onAwarenessChange = () => {};
}
