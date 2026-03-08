/** DeepMerge | Yamavol | v0.2.0 | 2026-03-06 */
type Primitive = string | number | boolean | symbol | bigint | null | undefined;

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends Array<infer U>
    ? Array<DeepPartial<U>>
    : T[P] extends object
      ? T[P] extends Function
        ? T[P]
        : DeepPartial<T[P]>
      : T[P]
};

type BuiltinObject =
  | Date
  | RegExp
  | Map<any, any>
  | Set<any>
  | WeakMap<any, any>
  | WeakSet<any>
  | Promise<any>
  | Error
  | ArrayBuffer
  | DataView
  | Int8Array
  | Uint8Array
  | Uint8ClampedArray
  | Int16Array
  | Uint16Array
  | Int32Array
  | Uint32Array
  | Float32Array
  | Float64Array
  | BigInt64Array
  | BigUint64Array;

type IsPlainObject<T> = T extends object
  ? T extends BuiltinObject
    ? false
    : T extends Function
      ? false
      : T extends readonly any[]
        ? false
        : true
  : false;

type NonUndefined<T> = Exclude<T, undefined>;

type DeepMergeProp<TValue, UValue> =
  [NonUndefined<UValue>] extends [never]
    ? TValue
    : IsPlainObject<TValue> extends true
      ? IsPlainObject<NonUndefined<UValue>> extends true
        ? DeepMerged<TValue, NonUndefined<UValue>>
        : NonUndefined<UValue>
      : NonUndefined<UValue>;

type DeepMergedObject<T extends object, U extends object> = {
  [K in keyof T | keyof U]:
  K extends keyof U
    ? K extends keyof T
      ? DeepMergeProp<T[K], U[K]>
      : U[K]
    : K extends keyof T
      ? T[K]
      : never;
};

type DeepMerged<T, U> =
  [U] extends [undefined]
    ? T
    : U extends Primitive
      ? U
      : U extends Function
        ? U
        : U extends BuiltinObject
          ? U
          : U extends ReadonlyArray<infer UItem>
            ? T extends ReadonlyArray<infer TItem>
              ? Array<DeepMerged<TItem, UItem>>
              : Array<DeepMerged<unknown, UItem>>
            : U extends Map<infer UKey, infer UValue>
              ? T extends Map<infer TKey, infer TValue>
                ? Map<UKey | TKey, DeepMerged<TValue, UValue>>
                : Map<UKey, UValue>
              : U extends Set<infer UItem>
                ? T extends Set<infer TItem>
                  ? Set<UItem | TItem>
                  : Set<UItem>
                : IsPlainObject<U> extends true
                  ? IsPlainObject<T> extends true
                    ? DeepMergedObject<T & object, U & object>
                    : U
                  : U;


export function isPrimitive(value: unknown): value is Primitive {
  return (
    value === null
    || typeof value === "string"
    || typeof value === "number"
    || typeof value === "boolean"
    || typeof value === "symbol"
    || typeof value === "bigint"
    || typeof value === "undefined"
  );
}

export function isFunction(value: unknown): value is Function {
  return typeof value === "function";
}

export function isObject(value: unknown): value is object {
  return typeof value === "object" && value !== null; // typeof null is "object"
}

export function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (!isObject(value)) {
    return false;
  }
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

export type ArrayMergeStrategy =
  | "replace"   // Deep clone the array and replace the dest. (Default)
  | "concat"    // Concat two arrays
  | "merge"     // Two arrays are merged, by an index-wise replacement
  | "deepmerge" // Two arrays are merged, by an index-wise deep-merge
  | "atomic";   // Treat array as atomic (Replace by Reference)

export type MapMergeStrategy = 
  | "atomic"      // Treat map as atomic (Default)
  | "merge"       // Replace dest items with source items.
  | "deepmerge";  // DeepMerge each items

export type SetMergeStrategy =
  | "atomic"      // Treat set as atomic (Replace by Reference) (Default)
  | "merge";      // Merge two sets

export interface MergeOptions {
  /** Strategy when merging array into array. Defaults to "merge". */
  array?: ArrayMergeStrategy;

  /** Strategy when merging Map into Map. Defaults to "replace". */
  map?: MapMergeStrategy;

  /** Strategy when merging Set into Set. Defaults to "replace". */
  set?: SetMergeStrategy;
}

/**
 * merge, a deepmerge implementation.
 * 
 * - target immutable
 * - prototype aware
 * - circular ref aware
 * - merge Arrays, Maps, Sets
 * - ignore unenumerable properties
 * - ignore undefined
 * 
 * Built-in objects are atomic values and won't be cloned. 
 * 
 * @param target target type 
 * @param source source type
 * @param options merge options
 * @returns merged object (target + source)
 */
export function merge<T, U>(target: Partial<T>, source?: Partial<U>, options?: MergeOptions): DeepMerged<T, U> {
  const seen = new WeakMap<object, any>();
  const arrayStrategy: ArrayMergeStrategy = options?.array ?? "replace";
  const mapStrategy: MapMergeStrategy = options?.map ?? "atomic";
  const setStrategy: SetMergeStrategy = options?.set ?? "atomic";

  function _merge(target: any, source: any): any {
    if (isPrimitive(source) || isFunction(source)) {
      return source;
    }
    else if (!isObject(source)) {
      throw new Error("never");
    }
    else if (seen.has(source)) {
      return seen.get(source);
    }
    else if (Array.isArray(source)) {
      const srcArray = source as any[];
      const dstArray = Array.isArray(target) ? target as any[] : [];

      switch (arrayStrategy) {
        case "atomic": {
          return source;
        }
        // ----------------------------------------
        // Concat two arrays
        // 
        case "concat": {
          const result: any[] = [];
          seen.set(source, result);
          for (const item of dstArray) {
            result.push(_merge(undefined, item));
          }
          for (const item of srcArray) {
            result.push(_merge(undefined, item));
          }
          return result;
        }
        // ----------------------------------------
        // Replace, index wise (No deep merge)
        // 
        case "merge": {
          const result: any[] = [];
          seen.set(source, result);
          for (const item of dstArray) {
            result.push(_merge(undefined, item));
          }
          for (let i = 0; i < srcArray.length; i++) {
            if (srcArray[i] !== undefined) {
              result[i] = _merge(undefined, srcArray[i]);
            }
          }
          return result;
        }
        // ----------------------------------------
        // Deep-Merge, index wise
        //
        case "deepmerge": {
          const result: any[] = [];
          seen.set(source, result);

          for (const item of dstArray) {
            result.push(_merge(undefined, item));
          }

          // Deep-merge per index
          for (let i = 0; i < srcArray.length; i++) {
            const merged = _merge(result[i], srcArray[i]);
            if (merged !== undefined) {
              result[i] = merged;
            }
          }
          return result;
        }
        // ----------------------------------------
        // Replace dst with src (cloned)
        // 
        case "replace":
        default: {
          const result: any[] = [];
          seen.set(source, result);
          for (const item of srcArray) {
            result.push(_merge(undefined, item));
          }
          return result;
        }
      }
    }
    else if (isPlainObject(source)) {
      const targetIsPlain = isPlainObject(target);
      const resultProto = targetIsPlain
        ? Object.getPrototypeOf(target)
        : Object.getPrototypeOf(source);

      const result = Object.create(resultProto);
      if (targetIsPlain) {
        Object.assign(result, target);
      }

      seen.set(source, result);
  
      for (const key of Object.keys(source)) {
        // Skip dangerous keys
        if (key === "__proto__" || key === "constructor" || key === "prototype") {
          continue;
        }
        const value = source[key];
        const merged = _merge(result[key], value);
        if (merged !== undefined) {
          result[key] = merged;
        }
      }
      return result;
    }
    else if (source instanceof Map) {
      const srcMap = source as Map<any, any>;
      const dstMap = target instanceof Map ? target as Map<any, any> : undefined;

      switch (mapStrategy) {
        // ----------------------------------------
        // [Map] Merge by key-wise deep-merge
        // 
        case "deepmerge": {
          const result = new Map<any, any>();
          seen.set(source, result);

          if (dstMap) {
            for (const [key, value] of dstMap) {
              result.set(key, value);
            }
          }

          for (const [key, value] of srcMap) {
            if (value === undefined) {
              continue;
            }
            const merged = _merge(result.get(key), value);
            if (merged !== undefined) {
              result.set(key, merged);
            }
          }
          return result;
        }
        // ----------------------------------------
        // [Map] Merge by key-wise replacement
        // 
        case "merge": {
          const result = new Map<any, any>();
          seen.set(source, result);

          if (dstMap) {
            for (const [key, value] of dstMap) {
              result.set(key, value);
            }
          }

          for (const [key, value] of srcMap) {
            if (value === undefined) {
              continue;
            }
            const merged = _merge(undefined, value);
            if (merged !== undefined) {
              result.set(key, merged);
            }
          }
          return result;
        }
        // ----------------------------------------
        // [Map] Atomic, replacement by reference
        // 
        case "atomic":
        default: {
          return source;
        }
      }
    }
    else if (source instanceof Set) {
      const srcSet = source as Set<any>;
      const dstSet = target instanceof Set ? target as Set<any> : undefined;

      switch (setStrategy) {
        // ----------------------------------------
        // [Set] Merge two sets (union)
        // 
        case "merge": {
          const result = new Set<any>();
          seen.set(source, result);

          if (dstSet) {
            for (const item of dstSet) {
              result.add(item);
            }
          }

          for (const item of srcSet) {
            result.add(item === source ? result : item);
          }
          return result;
        }
        // ----------------------------------------
        // [Set] Atomic, Replacement by reference
        // 
        case "atomic":
        default: {
          return source;
        }
      }
    }
    else {
      // Treat non-plain object as atomic values.  (Date, RegExp, etc...)
      return source;
    }
  }

  let merged = _merge(target, source);

  if (merged === undefined) {
    merged = _merge(undefined, target);
  }

  return merged === undefined
    ? target as DeepMerged<T, U>
    : merged as DeepMerged<T, U>;
}


export interface CloneOptions {
  array?: boolean;
  map?: boolean;
  set?: boolean;
  buffer?: boolean;
}


/**
 * clone, a deepclone implementation.
 * 
 * - prototype aware
 * - circular ref aware
 * - ignore unenumerable properties
 * - ignore undefined
 * - clones built-in objects (Date, RegExp, Map, Set, ArrayBuffer, TypedArrays)
 * - treats primitives and unclonable objects (Promise, Error,...) as atomic
 * 
 * @param source source
 * @returns cloned object
*/
export function clone<T>(source: T, options?: CloneOptions): T {
  const seen = new WeakMap<object, any>();
  const cloneArray = options?.array ?? true;
  const cloneMap = options?.map ?? true;
  const cloneSet = options?.set ?? true;
  const cloneBuffer = options?.buffer ?? true;

  function _clone(source: unknown): unknown { 
    if (isPrimitive(source) || isFunction(source)) {
      return source;
    }
    else if (!isObject(source)) {
      throw new Error("never");
    }
    else if (seen.has(source)) {
      return seen.get(source);
    }
    else if (Array.isArray(source) && cloneArray) {
      const result: any[] = [];
      seen.set(source, result);
      for (const item of source) {
        result.push(_clone(item));
      }
      return result;
    }
    else if (isPlainObject(source)) {
      const proto = Object.getPrototypeOf(source);
      const result = Object.create(proto);
      seen.set(source, result);
      for (const key of Object.keys(source)) {
        // Skip dangerous keys
        if (key === "__proto__" || key === "constructor" || key === "prototype") {
          continue;
        }
        const value = source[key];
        const cloned = _clone(value);
        if (cloned !== undefined) {
          result[key] = cloned;
        }
      }
      return result;
    }
    else if (source instanceof Date) {
      const result = new Date(source.getTime());
      seen.set(source, result);
      return result;
    }
    else if (source instanceof RegExp) {
      const result = new RegExp(source.source, source.flags);
      seen.set(source, result);
      return result;
    }
    else if (source instanceof Map && cloneMap) {
      const result = new Map<any, any>();
      seen.set(source, result);
      for (const [key, value] of source) {
        // DeepMerge ignores undefined here. DeepClone will clone it.
        result.set(key, _clone(value));
      }
      return result;
    }
    else if (source instanceof Set && cloneSet) {
      const result = new Set<any>();
      seen.set(source, result);
      for (const item of source) {
        result.add(_clone(item));
      }
      return result;
    }
    else if (source instanceof ArrayBuffer && cloneBuffer) {
      const src = source as ArrayBuffer;
      const result = src.slice(0);
      seen.set(source, result);
      return result;
    }
    else if (ArrayBuffer.isView(source) && cloneBuffer) {
      if (source instanceof DataView) {
        const src = source as DataView;
        const sliced = src.buffer.slice(src.byteOffset, src.byteOffset + src.byteLength);
        const result = new DataView(sliced);
        seen.set(source, result);
        return result;
      }
      // TypedArray
      const ctor = (source as any).constructor as (new (arg: any) => any);
      const result = new ctor(source);
      seen.set(source, result);
      return result;
    }
    else {
      // Other objects (Promise, Error, etc...) are considered non-clonable.
      return source;
    }
  }

  return _clone(source) as T;
}