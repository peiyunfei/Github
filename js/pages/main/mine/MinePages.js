import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';

/**
 * 我的界面
 */
export default class PopularPages extends Component {

    render() {
        return (
            <View style={styles.container}>
                <Text>我的</Text>
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