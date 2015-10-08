import { PNG } from 'pngjs2';

function convertARGBtoRGBA(buffer) {
    for (let i = 0, offset = 0; i < buffer.length; i += 4) {
        const alpha = buffer[offset];
        const red = buffer[offset + 1];
        const green = buffer[offset + 2];
        const blue = buffer[offset + 3];

        buffer[offset] = red;
        buffer[offset + 1] = green;
        buffer[offset + 2] = blue;
        buffer[offset + 3] = alpha;

        offset += 4;
    }

    return buffer;
}

export default function(imageInfo, buffer) {
    return new Promise((resolve, reject) => {
        const png = new PNG({
            width: imageInfo.width,
            height: imageInfo.height,
            bitDepth: 8,
            colorType: 6,
            inputHasAlpha: true
        });
        const buffers = [];

        png.data = convertARGBtoRGBA(buffer);

        const stream = png.pack();

        stream.on('data', bufferChunk => {
            buffers.push(bufferChunk);
        });

        stream.on('error', err => {
            reject(err);
        });

        stream.on('end', () => {
            const pngBuffer = Buffer.concat(buffers);

            resolve({
                info: {
                    ...imageInfo,
                    type: 'png'
                },
                raw: pngBuffer
            });
        });
    });
}
