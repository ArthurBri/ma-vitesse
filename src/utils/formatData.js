export function prettyDuration(duration, humanize = false) {
    let prettyDuration = '';
    let hours = duration | 0;
    let minutes = ((duration % 1) * 60) | 0 >= 1 ? parseInt((duration % 1) * 60) : 0;
    let seconds = (((duration % 1) * 60) % 1) * 60;

    seconds = !hours && !minutes && Math.round(seconds) >= 1 ? parseFloat((seconds).toFixed(1)) : (hours || minutes) && Math.round(seconds) >= 1 ? Math.round(seconds) : seconds.toFixed(1) > 0.1 ? seconds.toFixed(1) : 0;
    if (seconds === 60) {
        minutes++, seconds = 0
    }
    if (minutes === 60) {
        hours++, minutes = 0
    }

    if (humanize) {
        prettyDuration += hours && hours < 10 ? hours + 'h' : hours ? hours + 'h' : '';
        prettyDuration += hours && minutes && minutes < 10 ? '0' + minutes + 'm' : minutes ? minutes + 'm' : '';
        prettyDuration += (hours || minutes) && seconds && seconds < 10 ? '0' + seconds + 's' : seconds ? seconds + 's' : '';
    } else {
        prettyDuration += hours && hours < 10 ? '0' + hours + ':' : hours ? hours + ':' : '00:';
        prettyDuration += hours && minutes && minutes < 10 ? '0' + minutes + ':' : minutes < 10 ? '0' + minutes + ':' : minutes ? minutes + ':' : '00:';
        prettyDuration += (hours || minutes) && seconds && seconds < 10 ? '0' + seconds : seconds ? seconds : '00';
    }
    return prettyDuration
}

export function formatSpeed(speed, mode) {
    if (speed) {
        if (mode === 'pace') {
            let pace = 60 / speed.replace(",", ".");
            let minutes = pace | 0;
            let seconds = Math.round(((pace % 1) * 60) | 0);
            seconds = seconds < 10 && seconds ? '0' + seconds : seconds;
            seconds = !seconds ? "00" : seconds;
            return minutes + ":" + seconds
        } else return speed
    } else return "";
}

