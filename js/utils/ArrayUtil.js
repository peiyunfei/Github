import React from 'react';

export default class ArrayUtil {

    /**
     * 更新数组,若数据已存在则将其从数组中删除，若不存在则将其添加到数组
     * @param array
     * @param data
     */
    static updateItem(array, data) {
        let len = array.length;
        for (let i = 0; i < len; i++) {
            let temp = array[i];
            if (temp === data) {
                array.splice(i, 1);
            }
        }
        array.push(data);
    }
}