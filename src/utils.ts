import fs, { WriteStream } from 'fs'

export async function createWriteStream(p: {
    directory: string
    fileNameGenerator?: () => string
}) : Promise<fs.WriteStream> {
    return new Promise((resolve, reject) => {
        fs.exists(p.directory, (exists) => {
            const fileName = p.fileNameGenerator ? p.fileNameGenerator() : 'pattern.svg'
            const filePath = `${p.directory}/${fileName}`
            if (exists) {
                resolve(fs.createWriteStream(filePath))
                return
            }
            fs.mkdir(p.directory, (error) => {
                if (error) {
                    reject(error)
                }
                resolve(fs.createWriteStream(filePath))
            })
        })
    })
}

export async function writeToStream(p: {
    stream: WriteStream,
    content: string,
    encoding: 'utf8'
}) : Promise<void> {
    return new Promise((resolve, reject) => {
        p.stream.write(p.content, p.encoding, (error) => {
            if (error) {
                reject(error)
            }
            resolve()
        })
    })
}
