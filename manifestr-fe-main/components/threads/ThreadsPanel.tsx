/**
 * UNIFIED THREADS PANEL
 * Works across all 5 editors: image, presentation, spreadsheet, document, chart
 * 
 * Features:
 * - Document-specific threads
 * - Status tracking (TOTAL, DONE, OPEN, ALERT)
 * - Threaded replies
 * - Reactions (like, love, happy)
 * - Filters & search
 * - Assignees & priority
 */

import React, { useState, useEffect } from 'react';
import { X, Send, ThumbsUp, Heart, Smile, MoreHorizontal, Filter } from 'lucide-react';
import api from '../../lib/api';

interface Thread {
  id: string;
  document_id: string;
  document_type: string;
  title: string;
  location_context?: string;
  status: 'open' | 'in_progress' | 'done' | 'alert';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  assigned_to: string[];
  created_by: string;
  created_at: string;
  messages: ThreadMessage[];
}

interface ThreadMessage {
  id: string;
  thread_id: string;
  content: string;
  user_id: string;
  user_name: string;
  user_avatar?: string;
  created_at: string;
  reactions: ThreadReaction[];
}

interface ThreadReaction {
  id: string;
  message_id: string;
  reaction_type: 'like' | 'love' | 'happy';
  user_id: string;
  user_name: string;
}

interface ThreadsPanelProps {
  documentId: string;
  documentType: 'image' | 'presentation' | 'spreadsheet' | 'document' | 'chart';
  onClose: () => void;
}

export default function ThreadsPanel({ documentId, documentType, onClose }: ThreadsPanelProps) {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [stats, setStats] = useState({ total: 0, done: 0, open: 0, alert: 0 });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'my' | 'all'>('my');
  const [searchQuery, setSearchQuery] = useState('');
  const [newThreadContent, setNewThreadContent] = useState('');
  const [showNewThread, setShowNewThread] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');

  // Load threads on mount
  useEffect(() => {
    if (documentId) {
      fetchThreads();
    }
  }, [documentId]);

  const fetchThreads = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/threads/document/${documentId}`);
      
      if (response.data.status === 'success') {
        setThreads(response.data.data.threads);
        setStats(response.data.data.stats);
      }
    } catch (error) {
      console.error('Failed to fetch threads:', error);
    } finally {
      setLoading(false);
    }
  };

  const createThread = async () => {
    if (!newThreadContent.trim()) return;

    try {
      const response = await api.post('/threads/create', {
        documentId,
        documentType,
        initialMessage: newThreadContent,
        priority: 'normal'
      });

      if (response.data.status === 'success') {
        setNewThreadContent('');
        setShowNewThread(false);
        fetchThreads();
      }
    } catch (error) {
      console.error('Failed to create thread:', error);
    }
  };

  const addReply = async (threadId: string) => {
    if (!replyContent.trim()) return;

    try {
      const response = await api.post('/threads/message', {
        threadId,
        content: replyContent
      });

      if (response.data.status === 'success') {
        setReplyContent('');
        setReplyingTo(null);
        fetchThreads();
      }
    } catch (error) {
      console.error('Failed to add reply:', error);
    }
  };

  const toggleReaction = async (messageId: string, reactionType: 'like' | 'love' | 'happy') => {
    try {
      await api.post('/threads/reaction', {
        messageId,
        reactionType
      });
      fetchThreads();
    } catch (error) {
      console.error('Failed to toggle reaction:', error);
    }
  };

  const updateThreadStatus = async (threadId: string, status: Thread['status']) => {
    try {
      await api.patch(`/threads/${threadId}`, { status });
      fetchThreads();
    } catch (error) {
      console.error('Failed to update thread status:', error);
    }
  };

  const filteredThreads = threads.filter(thread => {
    const matchesSearch = searchQuery === '' || 
      thread.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      thread.messages.some(m => m.content.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesSearch;
  });

  const getReactionCount = (message: ThreadMessage, type: 'like' | 'love' | 'happy') => {
    return message.reactions.filter(r => r.reaction_type === type).length;
  };

  const hasUserReacted = (message: ThreadMessage, type: 'like' | 'love' | 'happy', userId?: string) => {
    // TODO: Get current user ID from auth context
    return message.reactions.some(r => r.reaction_type === type);
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    return `${days}d`;
  };

  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50 w-[380px] h-[85vh] bg-white rounded-[20px] shadow-2xl flex flex-col">
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-200">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-lg font-semibold text-gray-900">Threads</h2>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={18} className="text-gray-600" />
          </button>
        </div>
        <p className="text-sm text-gray-500">Design feedback & comments</p>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-2 mt-4">
          <div className="bg-gray-50 rounded-lg px-3 py-2 border border-gray-200">
            <div className="text-xs text-gray-500 font-medium mb-1">TOTAL</div>
            <div className="text-xl font-bold text-gray-900">{stats.total}</div>
          </div>
          <div className="bg-green-50 rounded-lg px-3 py-2 border border-green-200">
            <div className="text-xs text-green-600 font-medium mb-1">DONE</div>
            <div className="text-xl font-bold text-green-700">{stats.done}</div>
          </div>
          <div className="bg-orange-50 rounded-lg px-3 py-2 border border-orange-200">
            <div className="text-xs text-orange-600 font-medium mb-1">OPEN</div>
            <div className="text-xl font-bold text-orange-700">{stats.open}</div>
          </div>
          <div className="bg-red-50 rounded-lg px-3 py-2 border border-red-200">
            <div className="text-xs text-red-600 font-medium mb-1">ALERT</div>
            <div className="text-xl font-bold text-red-700">{stats.alert}</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => setActiveTab('my')}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'my'
                ? 'bg-black text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            My Threads
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'all'
                ? 'bg-black text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            All Project
          </button>
        </div>

        {/* Search */}
        <div className="mt-4">
          <input
            type="text"
            placeholder="Search threads..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Threads List */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : filteredThreads.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <p className="text-gray-500 text-sm mb-4">No threads yet</p>
            <button
              onClick={() => setShowNewThread(true)}
              className="px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
            >
              Start a conversation
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredThreads.map((thread) => (
              <div key={thread.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                {/* Thread Header */}
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-600">
                      {thread.messages[0]?.user_name?.charAt(0).toUpperCase() || '?'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-gray-900 text-sm">
                        {thread.messages[0]?.user_name || 'Anonymous'}
                      </span>
                      <span className="text-xs text-gray-500">
                        {getTimeAgo(thread.created_at)}
                      </span>
                    </div>
                    {thread.location_context && (
                      <div className="text-xs text-gray-500 mb-2">{thread.location_context}</div>
                    )}
                    <p className="text-sm text-gray-700 break-words">
                      {thread.messages[0]?.content}
                    </p>
                  </div>
                </div>

                {/* Reactions */}
                <div className="flex items-center gap-2 mb-3">
                  <button
                    onClick={() => toggleReaction(thread.messages[0]?.id, 'like')}
                    className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-colors ${
                      hasUserReacted(thread.messages[0], 'like')
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <ThumbsUp size={14} />
                    <span>{getReactionCount(thread.messages[0], 'like')}</span>
                  </button>
                  <button
                    onClick={() => toggleReaction(thread.messages[0]?.id, 'love')}
                    className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-colors ${
                      hasUserReacted(thread.messages[0], 'love')
                        ? 'bg-red-100 text-red-700'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <Heart size={14} />
                    <span>{getReactionCount(thread.messages[0], 'love')}</span>
                  </button>
                  <button
                    onClick={() => toggleReaction(thread.messages[0]?.id, 'happy')}
                    className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-colors ${
                      hasUserReacted(thread.messages[0], 'happy')
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <Smile size={14} />
                    <span>{getReactionCount(thread.messages[0], 'happy')}</span>
                  </button>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setReplyingTo(thread.id)}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Reply
                  </button>
                  <select
                    value={thread.status}
                    onChange={(e) => updateThreadStatus(thread.id, e.target.value as Thread['status'])}
                    className="text-xs border border-gray-200 rounded px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="open">Open</option>
                    <option value="in_progress">In Progress</option>
                    <option value="done">Done</option>
                    <option value="alert">Alert</option>
                  </select>
                </div>

                {/* Reply Box */}
                {replyingTo === thread.id && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <textarea
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      placeholder="Write a reply..."
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={2}
                    />
                    <div className="flex justify-end gap-2 mt-2">
                      <button
                        onClick={() => setReplyingTo(null)}
                        className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => addReply(thread.id)}
                        className="px-3 py-1.5 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors flex items-center gap-2"
                      >
                        <Send size={14} />
                        Reply
                      </button>
                    </div>
                  </div>
                )}

                {/* Replies */}
                {thread.messages.length > 1 && (
                  <div className="mt-3 pt-3 border-t border-gray-200 space-y-3">
                    {thread.messages.slice(1).map((message) => (
                      <div key={message.id} className="flex items-start gap-2">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center">
                          <span className="text-xs font-medium text-gray-600">
                            {message.user_name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-medium text-gray-900">
                              {message.user_name}
                            </span>
                            <span className="text-xs text-gray-500">
                              {getTimeAgo(message.created_at)}
                            </span>
                          </div>
                          <p className="text-xs text-gray-700 break-words">{message.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* New Thread FAB */}
      {!showNewThread && (
        <div className="absolute bottom-6 right-6">
          <button
            onClick={() => setShowNewThread(true)}
            className="w-14 h-14 bg-black text-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-800 transition-all hover:scale-105"
          >
            <Send size={24} />
          </button>
        </div>
      )}

      {/* New Thread Modal */}
      {showNewThread && (
        <div className="absolute inset-0 bg-white rounded-[20px] flex flex-col p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">New Thread</h3>
            <button
              onClick={() => setShowNewThread(false)}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={18} className="text-gray-600" />
            </button>
          </div>
          <textarea
            value={newThreadContent}
            onChange={(e) => setNewThreadContent(e.target.value)}
            placeholder="Start a conversation about this design..."
            className="flex-1 px-4 py-3 border border-gray-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            autoFocus
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setShowNewThread(false)}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 font-medium"
            >
              Cancel
            </button>
            <button
              onClick={createThread}
              className="px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors flex items-center gap-2"
            >
              <Send size={16} />
              Create Thread
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
