import React from 'react';
import {
    StyleSheet,
    Image,
    TouchableOpacity
} from 'react-native';

export default class ViewUtil {

    /**
     * 获取导航栏左边的返回按钮
     * @param callBack
     * @returns {XML}
     */
    static getLeftButton(callBack) {
        return (
            <TouchableOpacity
                style={{padding: 10}}
                onPress={callBack}
            >
                <Image
                    style={styles.img}
                    source={require('../../res/images/ic_arrow_back_white_36pt.png')}
                />
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    img: {
        width: 22,
        height: 22,
        tintColor: 'white',
    }
});