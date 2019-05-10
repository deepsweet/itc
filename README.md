[![npm](https://img.shields.io/npm/v/itc.svg?style=flat-square)](https://www.npmjs.com/package/itc)
[![travis](http://img.shields.io/travis/deepsweet/itc.svg?style=flat-square)](https://travis-ci.org/deepsweet/itc)
[![deps](http://img.shields.io/david/deepsweet/itc.svg?style=flat-square)](https://david-dm.org/deepsweet/itc) [![Greenkeeper badge](https://badges.greenkeeper.io/deepsweet/itc.svg)](https://greenkeeper.io/)

WIP.

## Install

```
npm i -S itc
```

## Usage

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
            raw: <Buffer>
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
            raw: <Buffer>
        },
        {
            info: {
                type: 'png',
                itemSize: 640196,
                width: 400,
                height: 400,
                start: 328552,
                size: 640000 },
                raw: <Buffer>
            },
            raw: <Buffer>
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

## API

### `getImageOffset(itemOffset = 0)`

```js
itc.getImageOffset().then(imageOffset => console.log(imageOffset));
// <Number>
```

### `getImageType(itemOffset = 0)`

```js
itc.getImageType().then(imageType => console.log(imageType));
// <String>: 'png' || 'argb' || 'jpg'
```

### `getItemSize(itemOffset = 0)`

```js
itc.getItemSize().then(itemSize => console.log(itemSize));
// <Number>
```

### `getImageStart(itemOffset = 0)`

```js
itc.getImageStart().then(imageStart => console.log(imageStart));
// <Number>
```

### `getImageSize(itemOffset = 0)`

```js
itc.getImageSize().then(imageSize => console.log(imageSize));
// <Number>
```

### `getImageWidth(itemOffset = 0)`

```js
itc.getImageWidth().then(imageWidth => console.log(imageWidth));
// <Number>
```

### `getImageHeight(itemOffset = 0)`

```js
itc.getImageHeight().then(imageHeight => console.log(imageHeight));
// <Number>
```

### `getImageInfo(itemOffset = 0)`

```js
itc.getImageInfo().then(imageInfo => console.log(imageInfo));
/*
{
    filename: <String>,
    type: <String>,
    itemSize: <Number>,
    width: <Number>,
    height: <Number>,
    start: <Number>,
    size: <Number>
}
*/
```

### `getImagesInfo()`

```js
itc.getImagesInfo().then(imagesInfo => console.log(imagesInfo));
/*
[
    {
        filename: <String>,
        type: <String>,
        itemSize: <Number>,
        width: <Number>,
        height: <Number>,
        start: <Number>,
        size: <Number>
    },
    ...
]
*/
```

### `extractImage(imageInfo)`

```js
itc.extractImage({ ... }).then(image => console.log(image));
/*
{
    info: {
        filename: <String>,
        type: <String>,
        itemSize: <Number>,
        width: <Number>,
        height: <Number>,
        start: <Number>,
        size: <Number>
    },
    raw: <Buffer>
}
*/
```

### `extractImages()`

```js
itc.extractImages().then(images => console.log(images));
/*
[
    {
        info: {
            filename: <String>,
            type: <String>,
            itemSize: <Number>,
            width: <Number>,
            height: <Number>,
            start: <Number>,
            size: <Number>
        },
        raw: <Buffer>
    },
    ...
]
*/
```

## References

* [itcToImageV2.sh](https://github.com/kyro38/MiscStuff/blob/master/Useless/itc/itcToImageV2.sh)
* [ITC Extractor](http://www.sffjunkie.co.uk/python-itc.html)
