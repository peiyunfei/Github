import React from 'react';
import {
    AsyncStorage,
} from 'react-native';
import GitHubTrending from 'GitHubTrending'

export let FLAG_STORAGE = {
    flag_popular: 'popular',
    flag_trending: 'trending'
}
/**
 * 封装网络请求框架
 */
export default class DataRepository {

    constructor(flag) {
        this.flag = flag;
        if (this.flag === FLAG_STORAGE.flag_trending) {
            this.trending = new GitHubTrending();
        }
    }

    fetchRepository(url) {
        return new Promise((resolve, reject) => {
            // 首先从本地获取数据
            this.fetchLocalRepository(url)
                .then((result) => {
                    // 本地有数据
                    if (result) {
                        resolve(result);
                    } else {
                        // 本地没数据，从网络获取数据
                        this.fetchNetRepository(url)
                            .then((result) => {
                                resolve(result);
                            })
                            .catch(e => {
                                reject(e);
                            })
                    }
                })
                .catch(e => {
                    // 获取本地数据有异常，从网络获取数据
                    this.fetchNetRepository(url)
                        .then((result) => {
                            resolve(result)
                        })
                        .catch(e => {
                            reject(e);
                        })
                })
        })
    }

    /**
     * 获取网络数据
     * @param url
     * @returns {Promise}
     */
    fetchNetRepository(url) {
        return new Promise((resolve, reject) => {
            if (this.flag === FLAG_STORAGE.flag_trending) {
                this.trending.fetchTrending(url)
                    .then(result => {
                        if (!result) {
                            reject(new Error('网络数据为空'));
                        }
                        else {
                            resolve(result);
                            // 将网络数据保存到本地
                            this.saveRepository(url, result);
                        }
                    })
            } else {
                fetch(url)
                    .then(response => response.json())
                    .then(result => {
                        if (!result) {
                            reject(new Error('网络数据为空'));
                        } else {
                            resolve(result.items);
                            // 将网络数据保存到本地
                            this.saveRepository(url, result.items);
                        }
                    })
                    .catch(error => {
                        reject(error);
                    })
            }
        })
    }

    /**
     * 获取本地数据
     * @param url
     */
    fetchLocalRepository(url) {
        return new Promise((resolve, reject) => {
            AsyncStorage.getItem(url, (error, result) => {
                if (!error) {
                    try {
                        // 本地有数据
                        resolve(JSON.parse(result));
                    } catch (e) {
                        reject(e);
                    }
                } else {
                    // 从本地获取数据失败
                    reject(error);
                }
            })
        })
    }

    /**
     * 将网络数据保存到本地
     */
    saveRepository(url, items) {
        if (!url || !items) {
            return;
        }
        let data = {items: items, update_date: new Date().getTime()};
        AsyncStorage.setItem(url, JSON.stringify(data), (error) => {

        });
    }

    /**
     * 判断缓存数据是否过期
     * @param longTime 缓存数据的时间戳
     */
    checkDate(longTime) {
        // 当前时间
        let cDate = new Date();
        // 用户传递过来的缓存时间
        let tDate = new Date();
        tDate.setTime(longTime);
        // 当前时间和缓存时间不在同一个月
        if (cDate.getMonth() !== tDate.getMonth()) {
            return false;
        }
        // 当前时间和缓存时间不在同一个天
        if (cDate.getDay() !== tDate.getDate()) {
            return false;
        }
        // 当前时间和缓存时间大于1小时
        if (cDate.getHours() - tDate.getHours() > 1) {
            return false;
        }
        return true;
    }
}