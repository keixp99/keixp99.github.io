function titleWithDifficulty (element) {
    switch (element.difficulty) {
        case 0:
            return `${element.title.ja} [PST]`;
        case 1: 
            return `${element.title.ja} [PRS]`;
        case 2: 
            return `${element.title.ja} [FTR]`;
        case 3:
            return `${element.title.ja} [BYD]`;
        case 4:
            return `${element.title.ja} [ETR]`;
    }
}

function isValidLocation () {
    const current_url = window.location.href;
    if (current_url.startsWith("https://arcaea.lowiro.com/")) {
        return true;
    } else {
        return false;
    }
}

export {titleWithDifficulty,isValidLocation};