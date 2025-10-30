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

    const { protocol, hostname, port } = window.location;
    const baseDomain = process.env.NEXT_PUBLIC_DOMAIN;

    if (!baseDomain) {
        console.error('NEXT_PUBLIC_DOMAIN is not defined.');
        return;
    }

    const isLocalhost = baseDomain.includes('localhost');
    const currentIsSubdomain = hostname.startsWith(`${subdomain}.`);
    let newHost: string;

    if (currentIsSubdomain) {
        newHost = isLocalhost ? baseDomain : baseDomain;
    } else {
        newHost = isLocalhost
            ? `${subdomain}.${baseDomain}`
            : `${subdomain}.${baseDomain}`;
    }
    const portPart =
        isLocalhost && !newHost.includes(':') && port ? `:${port}` : '';

    const url = `${protocol}//${newHost}${portPart}/`;

    if (openNewTab) {
        window.open(url, '_blank', 'noopener,noreferrer');
    } else {
        window.location.assign(url);
    }
};
