import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View
} from 'react-native';

/**
 * 收藏界面
 */
export default class FavoritePage extends Component {

    render() {
        return (
            <View style={styles.container}>
                <Text>收藏</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});