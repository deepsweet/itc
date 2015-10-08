[![npm](https://img.shields.io/npm/v/itc.svg?style=flat-square)](https://www.npmjs.com/package/itc)
[![travis](http://img.shields.io/travis/deepsweet/itc.svg?style=flat-square)](https://travis-ci.org/deepsweet/itc)
[![deps](http://img.shields.io/david/deepsweet/itc.svg?style=flat-square)](https://david-dm.org/deepsweet/itc)

WIP.

```js
import path from 'path';
import fs from 'fs';
import ITC from 'itc';

const itcFilePath = path.resolve('./test.itc');
const itc = new ITC(itcFilePath);

itc.extractImages().then(images => {
    console.log(images);
    /*
    [
        {
            info: {
                filename: './test.itc',
                type: 'png',
                itemSize: 65732,
                width: 128,
                height: 128,
                start: 480,
                size: 65536
            },
            raw: <Buffer ... >
        },
        {
            info: {
                type: 'png',
                itemSize: 262340,
                width: 256,
                height: 256,
                start: 66212,
                size: 262144
            },
            raw: <Buffer ... >
        },
        {
            info: {
                type: 'png',
                itemSize: 640196,
                width: 400,
                height: 400,
                start: 328552,
                size: 640000 },
                raw: <Buffer ... >
            },
            raw: <Buffer ... >
        }
    ]
    */

    images.forEach(image => {
        fs.writeFile(
            `${image.info.width}-test.${image.info.type}`,
            image.raw
        );
        /*
        .
        ├── test.itc
        ├── 128-test.png
        ├── 256-test.png
        └── 400-test.png
        */
    });
});

```
