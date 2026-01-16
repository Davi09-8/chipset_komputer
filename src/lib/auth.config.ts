import { NextAuthConfig } from 'next-auth';

export const authConfig = {
    pages: {
        signIn: '/login',
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
            const isOnAdmin = nextUrl.pathname.startsWith('/admin');
            const isOnCart = nextUrl.pathname.startsWith('/cart');
            const isOnCheckout = nextUrl.pathname.startsWith('/checkout');
            const isOnOrders = nextUrl.pathname.startsWith('/orders');

            if (isOnAdmin) {
                if (isLoggedIn && auth.user.role === 'ADMIN') return true;
                return false;
            }

            if (isOnDashboard || isOnCart || isOnCheckout || isOnOrders) {
                if (isLoggedIn) return true;
                return false;
            }

            return true;
        },
    },
    providers: [],
} satisfies NextAuthConfig;
