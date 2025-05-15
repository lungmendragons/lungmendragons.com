export class BinaryWriter {
  private cursor: number = 0;
  private buffer: ArrayBuffer;
  private view: DataView;

  constructor(buffer?: ArrayBuffer) {
    this.buffer = buffer ?? BinaryWriter.createBuffer();
    this.view = new DataView(this.buffer);
  }

  static using<T>(data: T, f: (writer: BinaryWriter, data: T) => void, buffer?: ArrayBuffer): Uint8Array {
    const writer = new BinaryWriter(buffer);
    f(writer, data);
    return writer.finish();
  }

  static createBuffer(initSize: number = 64) {
    return new ArrayBuffer(initSize, { maxByteLength: 1048576 });
  }

  private handleResize(needed: number) {
    if (this.cursor + needed > this.buffer.byteLength) {
      const minLen = this.cursor + needed;
      const maxLen = this.buffer.maxByteLength;

      const newLen = Math.min(maxLen, Math.max(minLen, this.buffer.byteLength * 2));

      if (newLen < minLen) {
        throw new Error(`not enough space for ${needed} bytes`);
      }

      this.buffer.resize(newLen);
    }
  }

  private adv(amount: number) {
    const old = this.cursor;
    this.cursor += amount;
    return old;
  }

  finish() {
    return new Uint8Array(this.buffer.transferToFixedLength(this.cursor), 0, this.cursor);
  }

  boolean(data: boolean) {
    this.u8(data ? 1 : 0);
  }

  string(data: string) {
    this.byteArray(new TextEncoder().encode(data));
  }

  byteArray(data: Uint8Array) {
    if (data.byteLength > 65535) {
      throw new Error(`byte length ${data.length} overflows uint16.`);
    }
    this.u16(data.byteLength);
    this.handleResize(data.byteLength);
    new Uint8Array(this.buffer).set(data, this.adv(data.byteLength));
  }

  u8(data: number) {
    this.handleResize(1);
    this.view.setUint8(this.adv(1), data);
  }

  u16(data: number) {
    this.handleResize(2);
    this.view.setUint16(this.adv(2), data, true);
  }

  u32(data: number) {
    this.handleResize(4);
    this.view.setUint32(this.adv(4), data, true);
  }

  i8(data: number) {
    this.handleResize(1);
    this.view.setInt8(this.adv(1), data);
  }

  i16(data: number) {
    this.handleResize(2);
    this.view.setInt16(this.adv(2), data, true);
  }

  i32(data: number) {
    this.handleResize(4);
    this.view.setInt32(this.adv(4), data, true);
  }

  f32(data: number) {
    this.handleResize(4);
    this.view.setFloat32(this.adv(4), data, true);
  }

  f64(data: number) {
    this.handleResize(8);
    this.view.setFloat64(this.adv(8), data, true);
  }

  array<T>(array: T[], f: (w: BinaryWriter, data: T) => void) {
    if (array.length > 65536) {
      throw new Error(`array length ${array.length} overflows uint16.`);
    }

    this.u16(array.length);
    for (const v of array) {
      f(this, v);
    }
  }

  record<V>(record: Record<string, V>, f: (w: BinaryWriter, data: V) => void) {
    const entries = Object.entries(record);
    if (entries.length > 65536) {
      throw new Error(`record length ${entries.length} overflows uint16.`);
    }

    this.u16(entries.length);
    for (const [ k, v ] of entries) {
      this.string(k);
      f(this, v);
    }
  }

  option<T>(
    data: T | undefined,
    f: (w: BinaryWriter, data: T) => void,
  ) {
    if (data === undefined) {
      this.boolean(false);
    } else {
      this.boolean(true);
      f(this, data);
    }
  }
}

export class BinaryReader {
  private cursor: number = 0;
  private view: DataView;

  constructor(buffer: ArrayBufferLike | ArrayBufferView) {
    if (ArrayBuffer.isView(buffer)) {
      this.view = new DataView(buffer.buffer, buffer.byteOffset, buffer.byteLength);
    } else {
      this.view = new DataView(buffer);
    }
  }

  static using<T>(buffer: ArrayBufferLike | ArrayBufferView, f: (reader: BinaryReader) => T): T {
    const reader = new BinaryReader(buffer);
    return f(reader);
  }

  private adv(amount: number) {
    const old = this.cursor;
    this.cursor += amount;
    return old;
  }

  boolean() {
    return this.u8() > 0;
  }

  string() {
    return new TextDecoder().decode(this.byteArray());
  }

  byteArray() {
    const length = this.u16();
    const offset = this.adv(length);
    return new Uint8Array(this.view.buffer, this.view.byteOffset + offset, length);
  }

  u8() {
    return this.view.getUint8(this.adv(1));
  }

  u16() {
    return this.view.getUint16(this.adv(2), true);
  }

  u32() {
    return this.view.getUint32(this.adv(4), true);
  }

  i8() {
    return this.view.getInt8(this.adv(1));
  }

  i16() {
    return this.view.getInt16(this.adv(2), true);
  }

  i32() {
    return this.view.getInt32(this.adv(4), true);
  }

  f32() {
    return this.view.getFloat32(this.adv(4), true);
  }

  f64() {
    return this.view.getFloat64(this.adv(8), true);
  }

  array<T>(f: (r: BinaryReader) => T): T[] {
    const length = this.u16();
    const out: T[] = [];
    for (let i = 0; i < length; i++) {
      out.push(f(this));
    }
    return out;
  }

  record<V>(f: (r: BinaryReader) => V): Record<string, V> {
    const length = this.u16();
    const out: Record<string, V> = {};
    for (let i = 0; i < length; i++) {
      const key = this.string();
      const value = f(this);
      out[key] = value;
    }
    return out;
  }

  option<T>(f: (r: BinaryReader) => T): T | undefined {
    if (this.boolean()) {
      return f(this);
    } else {
      return undefined;
    }
  }
}
