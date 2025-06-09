export function formatDates(dateInput) {
    const date = new Date(dateInput)

    const dateString = date.toLocaleDateString('en-GB', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: '2-digit'
    })

    const timeString = date.toLocaleTimeString('en-GB', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    })

    return `${dateString}, ${timeString}`
}