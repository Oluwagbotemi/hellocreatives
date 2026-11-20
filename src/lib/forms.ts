// Small helpers shared by the site's forms.

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export const isValidEmail = (value: string) => EMAIL_PATTERN.test(value.trim())

export const countWords = (value: string) => {
    const trimmed = value.trim()
    return trimmed ? trimmed.split(/\s+/).length : 0
}

export const EMAIL_ERROR = 'Please enter a valid email address, e.g. name@example.com'
