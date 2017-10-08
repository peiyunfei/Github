import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';
import NavigationBar from "../../../view/NavigationBar"
import CustomKeyPages from './CustomKeyPages'

/**
 * 我的界面
 */
export default class PopularPages extends Component {

    render() {
        return (
            <View style={styles.container}>
                {this.renderNavigationBar()}
                <Text
                    style={{fontSize: 18}}
                    onPress={() => {
                        this.props.navigator.push({
                            component: CustomKeyPages,
                            // 将页面的参数传递过去
                            params: {...this.props}
                        })
                    }}
                >自定义标签</Text>
            </View>
        );
    }

    /**
     * 创建导航栏
     */
    renderNavigationBar() {
        return <NavigationBar
            title={'我的'}
        />
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});