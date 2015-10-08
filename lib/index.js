import fs from 'fs';

import ARGBtoPNG from './argb-to-png';

export default class {
    constructor(filename) {
        this.start = 0x11C;
        this.filename = filename;
    }

    _readFile() {
        return new Promise((resolve, reject) => {
            fs.open(this.filename, 'r', (err, fd) => {
                if (err) {
                    return reject(err);
                }

                resolve(fd);
            });
        });
    }

    _read(position) {
        const buffer = new Buffer(4);

        return this._readFile().then(fd => {
            return new Promise((resolve, reject) => {
                fs.read(fd, buffer, 0, 4, position, function(err, num) {
                    if (err) {
                        return reject(err);
                    }

                    if (num === 0) {
                        return reject();
                    }

                    resolve(buffer);
                });
            });
        });
    }

    getImageOffset(itemOffset = 0) {
        const position = this.start + itemOffset + 8;

        return this._read(position).then(buffer => parseInt(buffer.toString('hex'), 16));
    }

    getImageType(itemOffset = 0) {
        const position = this.start + itemOffset + 0x30;

        return this._read(position).then(buffer => buffer.toString('utf-8').toLowerCase());
    }

    getItemSize(itemOffset = 0) {
        const position = this.start + itemOffset;

        return this._read(position).then(buffer => parseInt(buffer.toString('hex'), 16));
    }

    getImageStart(itemOffset = 0) {
        return this.getImageOffset().then(offset => {
            return this.start + itemOffset + offset;
        });
    }

    getImageSize(itemOffset = 0) {
        return this.getItemSize(itemOffset).then(itemSize => {
            return this.getImageOffset(itemOffset).then(imageOffset => {
                return Number(itemSize) - Number(imageOffset);
            });
        });
    }

    getImageWidth(itemOffset = 0) {
        const position = this.start + itemOffset + 56;

        return this._read(position).then(buffer => parseInt(buffer.toString('hex'), 16));
    }

    getImageHeight(itemOffset = 0) {
        const position = this.start + itemOffset + 60;

        return this._read(position).then(buffer => parseInt(buffer.toString('hex'), 16));
    }

    getImageInfo(itemOffset = 0) {
        const promises = {
            type: this.getImageType,
            itemSize: this.getItemSize,
            width: this.getImageWidth,
            height: this.getImageHeight,
            start: this.getImageStart,
            size: this.getImageSize
        };
        const result = {
            filename: this.filename
        };

        return Object.keys(promises).reduce((sequence, key) => {
            return sequence.then(() => {
                return promises[key].call(this, itemOffset).then(data => {
                    result[key] = data;

                    return result;
                });
            });
        }, Promise.resolve());
    }

    getImagesInfo() {
        return new Promise((resolve, reject) => {
            const result = [];

            function getItem(itemOffset = 0) {
                return this.getImageInfo(itemOffset)
                    .then(data => {
                        result.push(data);

                        return getItem.call(this, itemOffset + data.itemSize);
                    })
                    .catch(() => {
                        resolve(result);
                    });
            }

            return getItem.call(this);
        });
    }

    extractImage(imageInfo) {
        return new Promise((resolve, reject) => {
            this._readFile().then(fd => {
                const buffer = new Buffer(imageInfo.size);

                fs.read(fd, buffer, 0, imageInfo.size, imageInfo.start, function(err, num) {
                    if (err) {
                        return reject(err);
                    }

                    if (imageInfo.type === 'argb') {
                        ARGBtoPNG(imageInfo, buffer).then(resolve);
                    } else {
                        resolve({
                            info: imageInfo,
                            raw: buffer
                        });
                    }
                });
            });
        });
    }

    extractImages() {
        return this.getImagesInfo().then(imagesInfo => {
            return Promise.all(
                imagesInfo.map(imageInfo => {
                    return this.extractImage(imageInfo);
                })
            );
        });
    }
}
