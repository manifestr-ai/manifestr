import { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../contexts/AuthContext';

const UNPROTECTED_ROUTES = [
    '/',
    '/login',
    '/demo-page',
    '/signup',
    '/forgot-password',
    '/verify-email',
    '/about',
    '/blog',
    '/blog/[slug]',
    '/pricing',
    '/tools',
    '/tools/[slug]',
    '/careers',
    '/affiliates',
    '/playbook',
    '/playbook/knowledge-base',
    '/playbook/demo-videos',
    '/playbook/glossary',
    '/playbook/product-updates',
    '/playbook/faqs',
    '/playbook/submit-ticket',
    '/faqs',
    '/playbook/getting-started',
    '/contact',
    '/terms',
    '/terms-of-service',
    '/security',
    '/security/data-protection',
    '/security/compliance-certifications',
    '/security/user-responsibility',
    '/security/incident-reporting',
    '/security/continuous-monitoring',
    '/security/investor-trust-center',
    '/privacy',
    '/cookies',
    '/support',
];

export default function AuthGuard({ children }) {
    const { user, loading } = useAuth();
    const router = useRouter();
    const lastRedirectTime = useRef(0);
    const lastRedirectPath = useRef('');

    const GUEST_ONLY_ROUTES = [
        '/login',
        '/signup',
        '/forgot-password'
    ];

    useEffect(() => {
        if (!loading) {
            const now = Date.now();
            const isUnprotected = UNPROTECTED_ROUTES.includes(router.pathname);
            const isGuestOnly = GUEST_ONLY_ROUTES.includes(router.pathname);

            if (now - lastRedirectTime.current < 2000 && lastRedirectPath.current === router.pathname) {
                return;
            }

            if (user && typeof window !== 'undefined' && !localStorage.getItem('accessToken')) {
                localStorage.removeItem('user');
                return;
            }

            if (!isUnprotected && !user) {
                lastRedirectTime.current = now;
                lastRedirectPath.current = '/login';
                router.replace('/login');
            } else if (isGuestOnly && user) {
                lastRedirectTime.current = now;
                lastRedirectPath.current = '/home';
                router.replace('/home');
            }
        }
    }, [user, loading, router.pathname]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-white">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    const isUnprotected = UNPROTECTED_ROUTES.includes(router.pathname);
    const isGuestOnly = GUEST_ONLY_ROUTES.includes(router.pathname);

    if (!user && !isUnprotected) {
        return null;
    }

    if (user && isGuestOnly) {
        return null;
    }

    return children;
}
