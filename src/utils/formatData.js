export function prettyDuration(duration, humanize = false) {
    let prettyDuration = ''
    let hours = duration | 0
    let minutes = ((duration % 1) * 60) | 0 >= 1 ? parseInt((duration % 1) * 60) : 0
    let seconds = (((duration % 1) * 60) % 1) * 60

    seconds = !hours && !minutes && Math.round(seconds) >= 1 
        ? parseFloat((seconds).toFixed(1)) 
        : (hours || minutes) && Math.round(seconds) >= 1 
            ? Math.round(seconds) : seconds.toFixed(1) > 0.1 ? seconds.toFixed(1) 
            : 0

    if (seconds === 60) {
        minutes++
        seconds = 0
    }
    if (minutes === 60) {
        hours++
        minutes = 0
    }

    if (humanize) {
        prettyDuration += hours && hours < 10 ? hours + 'h' : hours ? hours + 'h' : ''
        prettyDuration += hours && minutes && minutes < 10 ? '0' + minutes + 'm' : minutes ? minutes + 'm' : ''
        prettyDuration += (hours || minutes) && seconds && seconds < 10 ? '0' + seconds + 's' : seconds ? seconds + 's' : ''
    } else {
        prettyDuration += hours && hours < 10 ? '0' + hours + ':' : hours ? hours + ':' : '00:'
        prettyDuration += hours && minutes && minutes < 10 ? '0' + minutes + ':' : minutes < 10 ? '0' + minutes + ':' : minutes ? minutes + ':' : '00:'
        prettyDuration += (hours || minutes) && seconds && seconds < 10 ? '0' + seconds : seconds ? seconds : '00'
    }
    return prettyDuration
}

export function formatSpeed(speed, mode) {
    if (!speed) return

    if (mode === 'pace') {
        let pace = 60 / speed.replace(",", ".")
        let minutes = pace | 0
        let seconds = Math.round(((pace % 1) * 60) | 0)
        seconds = seconds < 10 && seconds ? '0' + seconds : seconds
        seconds = !seconds ? "00" : seconds
        return minutes + ":" + seconds
    } else return speed
}

export function formatDuration(duration) {
    let hours = 0
    let minutes = 0
    let seconds = 0
    let oneField = ""

    if (/^\d+$/.test(duration) || duration === "") {
        return {
            oneField: duration.toString() || "",
            hours: parseFloat(duration) || 0
        }
    } else {
        const fieldsCount = (duration.match(/[:mhs]/g) || []).length + 1

        if (fieldsCount > 2) {
            hours = duration.match(/(^\d*)[h:]/g) ? duration.match(/(^\d*)[h:]/g)[0].replace(/[h:]*/g, '') : 0
            minutes = duration.match(/[:h]?(\d*)[m:]/g) ? duration.match(/[:h]?(\d*)[m:]/g)[0].replace(/[hm:]*/g, '') : 0
            seconds = duration.match(/[:mh](\d*)s?$/g) ? duration.match(/[:mh](\d*)s?$/g)[0].replace(/[hms:]*/g, '') : 0    
        } else if (fieldsCount === 2) {
            if ((duration.match(/[:h]/g) || []).length === 1 && (duration.match(/[s]/g) || []).length === 0) {
                hours = duration.match(/(^\d*)[h:]/g)[0].replace(/[h:]*/g, '')
                minutes = duration.match(/[:h](\d*)[m:]?/g)[0].replace(/[hm:]*/g, '') || 0
            } else if ((duration.match(/[:h]/g) || []).length === 1 && (duration.match(/[s]/g) || []).length === 1) {
                hours = duration.match(/(^\d*)[h:]/g)[0].replace(/[h:]*/g, '');
                seconds = duration.match(/[:h](\d*)[s:]/g)[0].replace(/[hs:]*/g, '') || 0
            } else if ((duration.match(/[m]/g) || []).length === 1) {
                if (duration.match(/(^\d*)[m:]/g)) {
                    minutes = duration.match(/(^\d*)[m:]/g)[0].replace(/[hm:]*/g, '') || 0
                }
                seconds = duration.match(/[:m](\d*)[s:]?/g)[0].replace(/[ms:]*/g, '') || 0
            } else {
                seconds = duration.match(/(\d*)[s:]?/g)[0].replace(/s*/g, '') || 0
            }

        } else if (fieldsCount === 1) {
            hours = duration.replace('h', '')
        }

        oneField = parseFloat(hours) + (parseFloat(minutes) / 60) + (parseFloat(seconds) / 3600)

        return {
            oneField,
            hours: parseFloat(hours) || 0,
            minutes: parseFloat(minutes) || 0,
            seconds: parseFloat(seconds) || 0,
        }
    }
}

