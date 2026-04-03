/**
 * Accept Invite Page
 * Handles collaboration invitation acceptance
 * 
 * Flow:
 * 1. User clicks email link with token
 * 2. If logged in → Accept invite → Redirect to document
 * 3. If not logged in → Save token → Redirect to login → Auto-accept after login
 */

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import api from '../lib/api';

export default function AcceptInvite() {
    const router = useRouter();
    const { token } = router.query;
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('Processing invitation...');
    const [documentId, setDocumentId] = useState<string | null>(null);

    useEffect(() => {
        if (!token || typeof token !== 'string') return;

        const acceptInvitation = async () => {
            try {
                // Check if user is logged in
                const user = localStorage.getItem('user');
                
                if (!user) {
                    // Not logged in - save token and redirect to login
                    localStorage.setItem('pendingInviteToken', token);
                    setMessage('Redirecting to login...');
                    setTimeout(() => {
                        router.push(`/login?redirect=/accept-invite?token=${token}`);
                    }, 1000);
                    return;
                }

                // User is logged in - accept invite
                setMessage('Accepting invitation...');
                
                const response = await api.post(`/collaborations/accept/${token}`);

                if (response.data.status === 'success') {
                    setStatus('success');
                    setMessage('Invitation accepted! Redirecting to document...');
                    setDocumentId(response.data.data.documentId);
                    
                    // Redirect to document after 2 seconds
                    setTimeout(() => {
                        router.push(`/docs-editor?id=${response.data.data.documentId}`);
                    }, 2000);
                } else {
                    throw new Error('Failed to accept invitation');
                }

            } catch (error: any) {
                console.error('Accept invite error:', error);
                setStatus('error');
                
                const errorMsg = error.response?.data?.error || error.message;
                
                if (errorMsg.includes('expired')) {
                    setMessage('This invitation has expired. Please request a new one.');
                } else if (errorMsg.includes('Invalid')) {
                    setMessage('Invalid invitation link. Please check your email.');
                } else {
                    setMessage(errorMsg || 'Failed to accept invitation');
                }
            }
        };

        acceptInvitation();
    }, [token, router]);

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <Head>
                <title>Accept Invitation | Manifestr</title>
            </Head>

            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
                <div className="text-center">
                    {/* Icon */}
                    <div className="mb-6">
                        {status === 'loading' && (
                            <Loader2 className="w-16 h-16 mx-auto text-blue-600 animate-spin" />
                        )}
                        {status === 'success' && (
                            <CheckCircle className="w-16 h-16 mx-auto text-green-600" />
                        )}
                        {status === 'error' && (
                            <XCircle className="w-16 h-16 mx-auto text-red-600" />
                        )}
                    </div>

                    {/* Title */}
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        {status === 'loading' && 'Processing Invitation'}
                        {status === 'success' && 'Invitation Accepted!'}
                        {status === 'error' && 'Unable to Accept'}
                    </h1>

                    {/* Message */}
                    <p className="text-gray-600 mb-6">{message}</p>

                    {/* Actions */}
                    {status === 'error' && (
                        <button
                            onClick={() => router.push('/home')}
                            className="px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
                        >
                            Go to Home
                        </button>
                    )}

                    {status === 'success' && documentId && (
                        <button
                            onClick={() => router.push(`/docs-editor?id=${documentId}`)}
                            className="px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
                        >
                            Open Document Now
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
