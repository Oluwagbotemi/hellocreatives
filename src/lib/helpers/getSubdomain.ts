const SUBDOMAINS = ['blog', 'events', 'podcast', 'merches', 'sponsorships'] as const
export type Subdomain = (typeof SUBDOMAINS)[number]

export const getSubdomain = (host: string): Subdomain | undefined => {
    if (!host) return undefined
    const sub = host.split('.')[0]
    return (SUBDOMAINS as readonly string[]).includes(sub) ? (sub as Subdomain) : undefined
}

// Where each section lives when subdomains aren't available
// (Vercel preview links, or local development without NEXT_PUBLIC_DOMAIN).
const FALLBACK_PATHS: Partial<Record<Subdomain, string>> = {
    blog: '/newsletter',
    events: '/events',
}

export const toggleDomain = (
    subdomain: string,
    openNewTab: boolean = false
) => {
    if (typeof window === 'undefined') return;

    const { protocol, hostname, port, pathname, origin } = window.location;
    const baseDomain = process.env.NEXT_PUBLIC_DOMAIN;

    const go = (url: string) => {
        if (openNewTab) {
            window.open(url, '_blank', 'noopener,noreferrer');
        } else {
            window.location.assign(url);
        }
    };

    // Vercel deployment URLs cannot serve arbitrary subdomains.
    // Keep previews on their own origin, even when production env vars exist.
    const fallbackPath = FALLBACK_PATHS[subdomain as Subdomain];
    if (fallbackPath && (hostname.endsWith('.vercel.app') || !baseDomain)) {
        go(new URL(pathname === fallbackPath ? '/' : fallbackPath, origin).href);
        return;
    }

    if (!baseDomain) return;

    const isLocalhost = baseDomain.includes('localhost');
    const currentIsSubdomain = hostname.startsWith(`${subdomain}.`);
    const newHost = currentIsSubdomain ? baseDomain : `${subdomain}.${baseDomain}`;
    const portPart =
        isLocalhost && !newHost.includes(':') && port ? `:${port}` : '';

    go(`${protocol}//${newHost}${portPart}/`);
};
