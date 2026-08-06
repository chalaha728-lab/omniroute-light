const fs = require('fs');
const zlib = require('zlib');

function makePng(width, height) {
  const lineSize = width * 4 + 1;
  const raw = Buffer.alloc(height * lineSize);

  for (let y = 0; y < height; y++) {
    const offset = y * lineSize;
    raw[offset] = 0;
    for (let x = 0; x < width; x++) {
      const px = offset + 1 + x * 4;
      raw[px] = 6;
      raw[px + 1] = 182;
      raw[px + 2] = 212;
      raw[px + 3] = 255;
    }
  }

  const compressed = zlib.deflateSync(raw);
  const pngHeader = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData.writeUInt8(8, 8);
  ihdrData.writeUInt8(6, 9);
  ihdrData.writeUInt8(0, 10);
  ihdrData.writeUInt8(0, 11);
  ihdrData.writeUInt8(0, 12);

  return Buffer.concat([
    pngHeader,
    makeChunk('IHDR', ihdrData),
    makeChunk('IDAT', compressed),
    makeChunk('IEND', Buffer.alloc(0)),
  ]);
}

function makeChunk(type, data) {
  const buf = Buffer.alloc(4 + 4 + data.length + 4);
  buf.writeUInt32BE(data.length, 0);
  buf.write(type, 4);
  data.copy(buf, 8);
  buf.writeUInt32BE(crc32(Buffer.concat([Buffer.from(type), data])), 8 + data.length);
  return buf;
}

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i];
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    }
  }
  return (c ^ 0xffffffff) >>> 0;
}

const png = makePng(512, 512);
fs.writeFileSync('app-icon.png', png);
console.log('Generated app-icon.png (' + png.length + ' bytes)');
