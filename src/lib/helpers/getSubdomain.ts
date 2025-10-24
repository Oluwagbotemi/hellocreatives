export const getSubdomain = (
    host: string
): 'blog' | 'podcast' | 'merches' | 'sponsorships' | undefined => {
    if (!host) return undefined;

    const parts = host.split('.');
    const sub = parts[0];

    // Handle localhost for local testing
    if (host.includes('localhost')) {
        if (sub === 'blog') return 'blog';
        if (sub === 'podcast') return 'podcast';
        if (sub === 'merches') return 'merches';
        if (sub === 'sponsorships') return 'sponsorships';
        return undefined;
    }

    // Handle production/staging subdomains
    if (sub === 'blog') return 'blog';
    if (sub === 'podcast') return 'podcast';
    if (sub === 'merches') return 'merches';
    if (sub === 'sponsorships') return 'sponsorships';

    return undefined;
};


export const toggleDomain = (
    subdomain: string,
    openNewTab: boolean = false
) => {
    if (typeof window === 'undefined') return;

    const host = window.location.hostname;
    const baseDomain = process.env.NEXT_PUBLIC_DOMAIN;

    if (!baseDomain) {
        console.error(' NEXT_PUBLIC_DOMAIN is not defined.');
        return;
    }

    const isCurrent = host.startsWith(`${subdomain}.`);

    const newHost = isCurrent
        ? baseDomain
        : `${subdomain}.${baseDomain}`;

    const newUrl = `${window.location.protocol}//${newHost}/`;

    if (openNewTab) {
        window.open(newUrl, '_blank', 'noopener,noreferrer');
    } else {
        window.location.href = newUrl;
    }
};

