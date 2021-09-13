export function isValidSpeed(speed) {
    const SPEED_PATTERN = /^\d*([.,]\d{0,4})?$/g
    const TWO_OR_MORE_LEADING_ZEROS = /^0{2,}(?![.,])/g
    return SPEED_PATTERN.test(speed) && !TWO_OR_MORE_LEADING_ZEROS.test(speed)
}

export function formatSpeed(speed) {
    return speed.replace(/([.,]\d{4})\d*/, "$1")
}