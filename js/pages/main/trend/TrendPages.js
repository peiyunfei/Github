import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View
} from 'react-native';

/**
 * 趋势界面
 */
export default class TrendPages extends Component {

    render() {
        return (
            <View style={styles.container}>
                <Text>趋势</Text>
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