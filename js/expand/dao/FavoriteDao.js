import React from 'react';
import {
    AsyncStorage,
} from 'react-native';

const FAVORITE_KEY_PREFIX = 'favorite_';

export default class LanguageDao {

    constructor(flag) {
        this.favorite_key = FAVORITE_KEY_PREFIX + flag;
    }

    /**
     * 保存收藏的项目
     * @param key
     * @param value
     */
    saveFavoriteItem(key, value) {
        AsyncStorage.setItem(key, value, (error) => {
            if (!error) {
                this.updateFavoriteKeys(key, true);
            }
        });
    }

    /**
     * 更新Favorite key集合
     * @param key
     * @param isAdd isAdd true 添加,false 删除
     */
    updateFavoriteKeys(key, isAdd) {
        AsyncStorage.getItem(this.favorite_key, (error, result) => {
            if (!error) {
                let favoriteKeys = [];
                if (result) {
                    favoriteKeys = JSON.parse(result);
                }
                let index = favoriteKeys.indexOf(key);
                if (isAdd) {
                    if (index === -1) {
                        favoriteKeys.push(key);
                    }
                } else {
                    if (index !== -1) {
                        favoriteKeys.splice(index, 1);
                    }
                }
                AsyncStorage.setItem(this.favorite_key, JSON.stringify(favoriteKeys), (error) => {

                });
            }
        })
    }

    /**
     * 获取收藏的项目对应的key
     * @returns {Promise}
     */
    getFavoriteKeys() {
        return new Promise((resolve, reject) => {
            AsyncStorage.getItem(this.favorite_key, (error, result) => {
                if (!error) {
                    try {
                        resolve(JSON.parse(result));
                    } catch (e) {
                        reject(error);
                    }
                } else {
                    reject(error);
                }
            })
        })
    }

    /**
     * 取消收藏,移除已经收藏的项目
     * @param key
     */
    removeFavoriteItem(key) {
        AsyncStorage.removeItem(key, (error) => {
            if (!error) {
                this.updateFavoriteKeys(key, false);
            }
        })
    }
}