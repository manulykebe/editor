import { isEqual, transform, isObject } from 'lodash';

interface ObjectDifference {
  added: Record<string, any>;
  deleted: Record<string, any>;
  updated: Record<string, { from: any; to: any }>;
}

export class Auxiliary {
  static objDifference(obj1: Record<string, any>, obj2: Record<string, any>): ObjectDifference {
    const result: ObjectDifference = {
      added: {},
      deleted: {},
      updated: {},
    };

    // Find added and updated properties
    Object.keys(obj2).forEach((key) => {
      if (!(key in obj1)) {
        result.added[key] = obj2[key];
      } else if (!isEqual(obj1[key], obj2[key])) {
        result.updated[key] = {
          from: obj1[key],
          to: obj2[key],
        };
      }
    });

    // Find deleted properties
    Object.keys(obj1).forEach((key) => {
      if (!(key in obj2)) {
        result.deleted[key] = obj1[key];
      }
    });

    return result;
  }

  // Deep object difference for nested objects
  static deepObjDifference(obj1: Record<string, any>, obj2: Record<string, any>): Record<string, any> {
    return transform(obj1, (result: Record<string, any>, value, key) => {
      if (!isEqual(value, obj2[key])) {
        result[key] = isObject(value) && isObject(obj2[key])
          ? this.deepObjDifference(value, obj2[key])
          : value;
      }
    });
  }
}