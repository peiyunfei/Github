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
                return;
            }
        }
        array.push(data);
    }

    /**
     * 克隆数组
     * @param original 原始数组
     * @returns {Array} 克隆之后的数组
     */
    static clone(original) {
        if (!original) {
            // 原数组为空
            return [];
        }
        let newArr = [];
        for (let i = 0; i < original.length; i++) {
            newArr[i] = original[i];
        }
        return newArr;
    }

    /**
     * 判断两个数组的元素是否全部相同
     * @param arr1
     * @param arr2
     */
    static isEqual(arr1, arr2) {
        if (!(arr1 && arr2)) {
            // 数组为空
            return false;
        }
        if (arr1.length !== arr2.length) {
            // 两个数组的长度不相等
            return false;
        }
        for (let i = 0; i < arr2.length; i++) {
            if (arr1[i] !== arr2[i]) {
                return false;
            }
        }
        return true;
    }

    /**
     * 移除数组中指定的元素
     * @param arr
     * @param item
     */
    static remove(arr, item) {
        if (!arr) {
            return;
        }
        for (let i = 0; i < arr.length; i++) {
            if (arr[i] === item) {
                arr.splice(i, 1);
            }
        }
    }
}