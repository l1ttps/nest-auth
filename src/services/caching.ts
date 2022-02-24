import { Injectable } from '@nestjs/common';

// special case, must use require :)
const { promisify } = require('util');
import * as NodeCache from "node-cache"
enum KeyCacheEnum {

}
export { KeyCacheEnum }
@Injectable()
export class CacheService {
    constructor() { }

    private myCache = new NodeCache({ stdTTL: 100, checkperiod: 120 });

    public set = (key, val, ttl) => this.myCache.set(key, val, ttl)

    public get(key): any {
        const value = this.myCache.get(key);
        if (!!value) return value;
        return null;
    }

    public has(key) {
        return !!this.myCache.has(key);
    }

}