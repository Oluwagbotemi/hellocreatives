import type { EventPlatform } from './types'

export const PLATFORMS: Record<
    EventPlatform,
    { label: string; color: string; icon: string; iconWidth: number; iconHeight: number }
> = {
    googleMeet: {
        label: 'Google Meet',
        color: '#F8A71A',
        icon: '/icons/events/google-meet.svg',
        iconWidth: 23,
        iconHeight: 18,
    },
    microsoftTeams: {
        label: 'Microsoft Teams',
        color: '#6253E4',
        icon: '/icons/events/microsoft-teams.svg',
        iconWidth: 17,
        iconHeight: 18,
    },
}

export const DIRECTIONS_COLOR = '#8B50EA'
