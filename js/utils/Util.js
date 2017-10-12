import React from 'react';

export default class Util {

    /**
     * 判断项目是否被收藏
     * @param item
     * @param items
     * @returns {boolean}
     */
    static checkItem(item, items) {
        let len = items.length;
        for (let i = 0; i < len; i++) {
            let id = item.id ? item.id.toString() : item.fullName;
            if (id === items[i]) {
                return true;
            }
        }
        return false;
    }
}