import { WriteStream } from 'fs'
import { viewPort, generatePatternElementSVG } from './patternElement'
import { writeToStream } from '../utils'

function generateViewPort(p: {
    grid: {
        width: number
        height: number
    }
}) : string {
    const xmlHeader = '<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n'
    const style = 'fill-rule:evenodd;clip-rule:evenodd;stroke-miterlimit:8;'
    const viewBox = `0 0 ${viewPort.width * p.grid.width} ${viewPort.height * p.grid.height}`
    const svgOpener = `<svg width="100%" height="100%" viewBox="${viewBox}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="${style}">\n`  // tslint:disable-line
    return `${xmlHeader}${svgOpener}`
}

export async function writePatternSVG(p: {
    stream: WriteStream
    colors: {
        line: string
        background: string
    }
    strokeWidth: number
    numSubElements: {
        min: number
        max: number
    }
    grid: {
        width: number
        height: number
    }
}) : Promise<void> {
    const encoding = 'utf8'
    const stream = p.stream
    await writeToStream({
        stream, encoding,
        content: generateViewPort({grid: p.grid})
    })

    for (let j = 0; j < p.grid.height; j++) {
        const maxWidthGrid = j % 2 === 0 ?
            p.grid.width :
            p.grid.width + 1
        for (let i = 0; i < maxWidthGrid; i++) {
            const numVisibleElements =
                Math.floor(Math.random() * (p.numSubElements.max - p.numSubElements.min)) +
                p.numSubElements.min
            const content = generatePatternElementSVG({
                color: p.colors.line,
                strokeWidth: p.strokeWidth,
                numVisibleElements: numVisibleElements,
                offset: {
                    x: i,
                    y: j
                }
            })
            await writeToStream({
                stream, encoding, content
            })
        }
    }

    await writeToStream({
        stream, encoding,
        content: '</svg>'
    })
}
