export const viewPort = {
    width: 15.063,
    height: 13,
}

const subElementsSVGPaths = [
    'M0,0l0,6.489l5.65,-3.251l-1.877,-3.238l-3.773,0Z',
    'M7.53,0l-3.756,0l1.877,3.238l1.879,-1.082l0,-2.156Z',
    'M11.305,0l-3.775,0l0,2.156l1.894,1.09l1.881,-3.246Z',
    'M15.063,0l-3.758,0l-1.881,3.246l5.639,3.244l0,-6.49Z',
    'M15.063,13l0,-6.51l-5.645,3.25l1.889,3.26l3.756,0Z',
    'M7.532,10.825l0.002,2.176l3.773,0l-1.888,-3.26l-1.887,1.084Z',
    'M5.659,9.746l-1.885,3.254l3.76,0l-0.002,-2.176l-1.873,-1.078Z',
    'M0,13l3.773,0l1.885,-3.254l-5.658,-3.257l0,6.511Z',
    'M7.541,6.499l-1.883,3.247l-5.658,-3.257l5.65,-3.251l1.891,3.261Z',
    'M7.541,6.499l1.883,-3.253l-1.895,-1.09l-1.879,1.082l1.891,3.261Z',
    'M9.418,9.741l-1.887,1.084l-1.873,-1.078l1.883,-3.247l1.877,3.241Z',
    'M15.063,6.491l-5.645,3.25l-1.876,-3.241l1.882,-3.253l5.639,3.244Z',
]

function subElementStyle(p: {
    color: string,
    strokeWidth: number
}) : string {
    return `fill:none;stroke:${p.color};stroke-width:${p.strokeWidth}px;`
}

function offsetCords(p: {
    path: string,
    offset: {
        x: number,
        y: number,
    }
}) {
    const coordPairs = p.path
        .slice(1, p.path.length - 1)
        .split('l')
        .map(pair => pair.split(','))
    const firstPair = [
        // The x-value is offset by half a field each uneven row.
        p.offset.y % 2 === 0 ?
            Number(coordPairs[0][0]) + (p.offset.x * viewPort.width) :
            Number(coordPairs[0][0]) + (p.offset.x * viewPort.width) - (viewPort.width * 0.5)
        ,
        Number(coordPairs[0][1]) + (p.offset.y * viewPort.height)
    ]
    const offsetPairs = [
        firstPair, ...coordPairs.slice(1)
    ]
    const joined = offsetPairs
        .map(pair => pair.join(','))
        .join('l')
    return `M${joined}Z`
}

export function generatePatternElementSVG(p: {
    color: string
    strokeWidth: number
    numVisibleElements: number
    offset: {
        x: number
        y: number
    }
}) : string {
    const numVisibleElements = Math.min(p.numVisibleElements, subElementsSVGPaths.length)
    const elements = [...subElementsSVGPaths]
        .sort(() => 0.5 - Math.random())
        .slice(0, numVisibleElements)
    const style = subElementStyle({
        color: p.color,
        strokeWidth: p.strokeWidth,
    })
    const offset = p.offset
    return elements
        .map(path => offsetCords({
            path,
            offset,
        }))
        .map(path => `<path d="${path}" style="${style}"/>\n`)
        .join('')
}
