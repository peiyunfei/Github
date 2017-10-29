import React from 'react';
import {
    StyleSheet,
    Image,
    View,
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
                    style={styles.back}
                    source={require('../../res/images/ic_arrow_back_white_36pt.png')}
                />
            </TouchableOpacity>
        );
    }

    static getSettingItem(callback,text, tag, image) {
        return (
            <TouchableOpacity
                onPress={callback}>
                <View style={styles.item}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Image
                            style={styles.img}
                            source={image}/>
                        <Text>{text}</Text>
                    </View>
                    <Image
                        style={styles.arrow}
                        source={require('../../../../res/images/ic_tiaozhuan.png')}/>
                </View>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    back: {
        width: 22,
        height: 22,
        tintColor: 'white',
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        justifyContent: 'space-between',
        padding: 10,
    },
    img: {
        width: 28,
        height: 28,
        marginRight: 10,
        tintColor: '#2196f3',
    },
    arrow: {
        width: 22,
        height: 22,
        tintColor: '#2196f3',
    },
});