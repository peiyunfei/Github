import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';
import NavigationBar from "../../../view/NavigationBar"
import CustomKeyPages from '../popular/key/CustomKeyPages'
import SortKeyPage from '../popular/key/SortKeyPage'
import {FLAG_LANGUAGE} from '../../../expand/dao/LanguageDao'

/**
 * 我的界面
 */
export default class MinePage extends Component {

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
                            params: {
                                ...this.props,
                                flag: FLAG_LANGUAGE.flag_key
                            }
                        })
                    }}
                >自定义标签</Text>
                <Text
                    style={{fontSize: 18}}
                    onPress={() => {
                        this.props.navigator.push({
                            component: CustomKeyPages,
                            // 将页面的参数传递过去
                            params: {
                                ...this.props,
                                flag: FLAG_LANGUAGE.flag_language
                            }
                        })
                    }}
                >自定义语言</Text>
                <Text
                    style={{fontSize: 18}}
                    onPress={() => {
                        this.props.navigator.push({
                            component: SortKeyPage,
                            // 将页面的参数传递过去
                            params: {
                                ...this.props,
                                flag: FLAG_LANGUAGE.flag_key
                            }
                        })
                    }}
                >标签排序</Text>
                <Text
                    style={{fontSize: 18}}
                    onPress={() => {
                        this.props.navigator.push({
                            component: SortKeyPage,
                            // 将页面的参数传递过去
                            params: {
                                ...this.props,
                                flag: FLAG_LANGUAGE.flag_language
                            }
                        })
                    }}
                >语言排序</Text>
                <Text
                    style={{fontSize: 18}}
                    onPress={() => {
                        this.props.navigator.push({
                            component: CustomKeyPages,
                            // 将页面的参数传递过去
                            params: {
                                ...this.props,
                                isRemoveKey: true
                            }
                        })
                    }}
                >移除标签</Text>
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