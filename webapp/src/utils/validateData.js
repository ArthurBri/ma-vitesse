export function isValidSpeed(speed) {
    const SPEED_PATTERN = /^\d*([.,]\d{0,4})?$/g
    const TWO_OR_MORE_LEADING_ZEROS = /^0{2,}(?![.,])/g
    return SPEED_PATTERN.test(speed) && !TWO_OR_MORE_LEADING_ZEROS.test(speed)
}

export function cleanSpeedInput(speed) {
    return speed.replace(/([.,]\d{4})\d*/, "$1")
}


export function isValidDistance(distance) {
    const DISTANCE_PATTERN = /^\d{0,9}([.,]\d{0,4})?$/g
    const TWO_OR_MORE_LEADING_ZEROS = /^0{2,}(?![.,])/g
    return DISTANCE_PATTERN.test(distance) && !TWO_OR_MORE_LEADING_ZEROS.test(distance)
}

export function cleanDistanceInput(distance) {
    return distance.replace(/^0([0-9]+)/g, '$1')
}

export function isValidPace(pace) {
    const PACE_PATTERN = /^(\d{1,2}:(\d{1,2})?)|^(:?\d{1,2})$|^:$/g
    return PACE_PATTERN.test(pace)
}

export function cleanDurationInput(duration) {
    return duration.replace(/[^0-9,.:hms]/g, '').replace(/^0*([1-9]*)/g, '$1')
}

export function isValidDuration(duration) {
    const DURATION_PATTERN = /^([0-9]?[0-9]([h:]|[h:]?$))?([0-5]?[0-9]([m:]|[m:]?$))?([0-5]?[0-9]([s]?$))?$/g
    return DURATION_PATTERN.test(duration)
}

export function isValidHours(hours) {
    const HOURS_PATTERN = /^([0-9]?[0-9])$/g
     return HOURS_PATTERN.test(hours)
}

export function isValidMinutes(minutes) {
    const MINUTES_PATTERN = /^([0-5]?[0-9])$/g
     return MINUTES_PATTERN.test(minutes)
}

export function isValidSeconds(seconds) {
    const SECONDS_PATTERN = /^([0-5]?[0-9])$/g
     return SECONDS_PATTERN.test(seconds)
}