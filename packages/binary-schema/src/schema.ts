import { BinaryWriter, type BinaryReader } from "./binary";

type Encoder<D> = (w: BinaryWriter, d: D) => void;
type Decoder<D> = (r: BinaryReader) => D;

export type Schema<D> = {
  Infer: D,
  encode: Encoder<D>,
  decode: Decoder<D>,
};

export const rawSchema = <D>(data: Pick<Schema<D>, "encode" | "decode">): Schema<D> => {
  return data as Schema<D>;
};

export const u8: Schema<number> = rawSchema({
  encode: (w, v) => w.u8(v),
  decode: r => r.u8(),
});

export const u16: Schema<number> = rawSchema({
  encode: (w, v) => w.u16(v),
  decode: r => r.u16(),
});

export const u32: Schema<number> = rawSchema({
  encode: (w, v) => w.u32(v),
  decode: r => r.u32(),
});

export const i8: Schema<number> = rawSchema({
  encode: (w, v) => w.i8(v),
  decode: r => r.i8(),
});

export const i16: Schema<number> = rawSchema({
  encode: (w, v) => w.i16(v),
  decode: r => r.i16(),
});

export const i32: Schema<number> = rawSchema({
  encode: (w, v) => w.i32(v),
  decode: r => r.i32(),
});

export const f32: Schema<number> = rawSchema({
  encode: (w, v) => w.f32(v),
  decode: r => r.f32(),
});

export const f64: Schema<number> = rawSchema({
  encode: (w, v) => w.f64(v),
  decode: r => r.f64(),
});

export const string: Schema<string> = rawSchema({
  encode: (w, v) => w.string(v),
  decode: r => r.string(),
});

export const bytearray: Schema<Uint8Array> = rawSchema({
  encode: (w, v) => w.byteArray(v),
  decode: r => r.byteArray(),
});

export const boolean: Schema<boolean> = rawSchema({
  encode: (w, v) => w.boolean(v),
  decode: r => r.boolean(),
});

// for whatever fucking reason, this makes the vscode typescript plugin happy.
// if it was StructSchemaType<S extends StructFields> = { [K in keyof S]: S[K]["Infer"]; };
// this the plugin doesn't expand it in the hover.
type StructFields = Record<string, Schema<any>>;
type StructSchemaType<S extends StructFields> = keyof S extends infer K extends keyof S ? {
  [K2 in K]: S[K2]["Infer"];
} : never;

export const struct = <V extends StructFields>(fields: V): Schema<StructSchemaType<V>> => {
  const entries = Object.entries(fields) as [keyof V, Schema<any>][];
  return rawSchema({
    encode: (w, d) => {
      for (const [k, v] of entries) {
        v.encode(w, d[k]);
      }
    },
    decode: r => {
      const out: Record<string, any> = {};
      for (const [k, v] of entries) {
        out[k as string] = v.decode(r);
      }
      return out as any;
    },
  });
};

export const unit: Schema<{}> = rawSchema({
  encode: (w, d) => { },
  decode: r => ({}),
});

export const array = <D>(entry: Schema<D>): Schema<D[]> => rawSchema({
  encode: (w, d) => w.array(d, entry.encode),
  decode: r => r.array(entry.decode),
});

export const option = <D>(inner: Schema<D>): Schema<D | undefined> => rawSchema({
  encode: (w, d) => w.option(d, inner.encode),
  decode: r => r.option(inner.decode),
});

export const record = <D>(inner: Schema<D>): Schema<Record<string, D>> => rawSchema({
  encode: (w, d) => w.record(d, inner.encode),
  decode: r => r.record(inner.decode),
});

export type UnionVars = Record<string | number, StructFields>;
type EnumSchemaType<S extends UnionVars, Key extends string> =
  keyof S extends infer V extends keyof S ? V extends any ? {
    [K in (Key | keyof S[V])]: K extends Key ? V : S[V][K]["Infer"];
  } : never : never;

export const union = <
  K extends string,
  V extends UnionVars,
>(key: K, vars: V): Schema<EnumSchemaType<V, K>> => {
  const idx2vars: Record<number, [string | number, Decoder<any>]> = {};
  const name2vars: Record<string | number, [number, Encoder<any>]> = {};
  let i = 0;
  for (const [k, v] of Object.entries(vars)) {
    const s = struct(v);
    const intkey = +k;
    if(isNaN(intkey)) {
      idx2vars[i] = [k, s.decode];
      name2vars[k] = [i, s.encode];
    } else {
      idx2vars[i] = [intkey, s.decode];
      name2vars[intkey] = [i, s.encode];
    }
    i++;
  }

  return rawSchema({
    encode: (w, d) => {
      const kind = d[key] as string | number;
      const [i, encode] = name2vars[kind]!;
      w.u8(i);
      encode(w, d);
    },
    decode: r => {
      const kind = r.u8();
      const [k, decode] = idx2vars[kind]!;
      const out = decode(r);
      out[key] = k;
      return out;
    },
  });
};

export const ext = <V>(schema: Schema<V>): Schema<V> => schema;
