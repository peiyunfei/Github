import React from 'react';
import {
    AsyncStorage,
} from 'react-native';
import keys from '../../../res/data/keys.json'

export let FLAG_LANGUAGE = {
    flag_language: 'language_dao_language',
    flag_key: 'language_dao_key'
};

export default class LanguageDao {
    constructor(flag) {
        this.flag = flag;
    }

    fetch() {
        return new Promise((resolve, reject) => {
            AsyncStorage.getItem(this.flag, (error, result) => {
                if (error) {
                    reject(error);
                    return;
                }
                if (!result) {
                    let data = this.flag === FLAG_LANGUAGE.flag_key ? keys : null;
                    this.save(data);
                    resolve(data);
                } else {
                    try {
                        resolve(JSON.parse(result));
                    } catch (e) {
                        reject(error);
                    }
                }
            });
        });
    }

    save(objectData) {
        let stringData = JSON.stringify(objectData);
        AsyncStorage.setItem(this.flag, stringData, (error) => {

        });
    }
}