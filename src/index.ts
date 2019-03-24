import { createWriteStream } from './utils'
import { writePatternSVG } from './pattern/pattern'


// Config ----------------

const colors = {
    line: '#229dd5',
    background: '#eeeeee',
}
const strokeWidth = 0.25
const numSubElements = {
    min: 0,
    max: 7, // up to 12
}
const grid = {
    width: 17,
    height: 13
}

// -----------------------


async function run() {
    const timeStamp = Date.now() / 1000
    const stream = await createWriteStream({
        directory: './output',
        fileNameGenerator: () => `pattern-${timeStamp}.svg`
    })

    await writePatternSVG({
        stream,
        colors,
        strokeWidth,
        numSubElements,
        grid,
    })

    stream.close()
}

run()
