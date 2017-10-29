import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    ScrollView,
    TouchableOpacity,
    DeviceEventEmitter,
} from 'react-native';
import NavigationBar from "../../../view/NavigationBar"
import ViewUtil from "../../../utils/ViewUtil"
import CustomKeyPages from './key/CustomKeyPages'
import SortKeyPage from './key/SortKeyPage'
import AboutPage from './about/AboutPage'
import {MORE_MENU} from '../../../utils/MoreMenu'
import {FLAG_LANGUAGE} from '../../../expand/dao/LanguageDao'

/**
 * 我的界面
 */
export default class MinePage extends Component {

    render() {
        return (
            <View style={styles.container}>
                {this.renderNavigationBar()}
                <ScrollView>
                    {this.renderItem('Github Popular', MORE_MENU.About,
                        require('../../../../res/images/ic_trending.png'))}

                    {this.renderHeader('趋势管理')}
                    {this.renderItem('自定义语言', MORE_MENU.Custom_Language,
                        require('../../../../res/images/ic_custom_language.png'))}
                    {this.renderItem('语言排序', MORE_MENU.Sort_Language,
                        require('../../../../res/images/ic_swap_vert.png'))}

                    {this.renderHeader('最热管理')}
                    {this.renderItem('自定义标签', MORE_MENU.Custom_Key,
                        require('../../../../res/images/ic_custom_language.png'))}
                    {this.renderItem('标签排序', MORE_MENU.Sort_Key,
                        require('../../../../res/images/ic_swap_vert.png'))}
                    {this.renderItem('移除标签', MORE_MENU.Remove_Key,
                        require('../../../../res/images/ic_remove.png'))}

                    {this.renderHeader('设置')}
                    {this.renderItem('自定义主题', MORE_MENU.Custom_Theme,
                        require('../../../../res/images/ic_view_quilt.png'))}
                    {this.renderItem('关于作者', MORE_MENU.About_Author,
                        require('../../../../res/images/ic_insert_emoticon.png'))}
                </ScrollView>
            </View>
        );
    }

    renderHeader(text) {
        return (
            <View style={styles.header}>
                <Text>{text}</Text>
            </View>
        );
    }

    renderItem(text, tag, image) {
        return (
            <TouchableOpacity
                onPress={() => {
                    this.onClick(tag)
                }}>
                <View style={styles.item}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Image
                            style={styles.github}
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

    /**
     * 创建导航栏
     */
    renderNavigationBar() {
        return <NavigationBar
            title={'我的'}
        />
    }

    onClick(tag) {
        let targetComponent, params = {...this.props, menuType: tag};
        switch (tag) {
            case MORE_MENU.About:// 关于
                targetComponent = AboutPage;
                break;
            case MORE_MENU.Custom_Language: // 自定义语言
                targetComponent = CustomKeyPages;
                params.flag = FLAG_LANGUAGE.flag_language;
                break;
            case MORE_MENU.Sort_Language: // 语言排序
                targetComponent = SortKeyPage;
                params.flag = FLAG_LANGUAGE.flag_language;
                break;
            case MORE_MENU.Custom_Key: // 自定义标签
                targetComponent = CustomKeyPages;
                params.flag = FLAG_LANGUAGE.flag_key;
                break;
            case MORE_MENU.Sort_Key: // 标签排序
                targetComponent = SortKeyPage;
                params.flag = FLAG_LANGUAGE.flag_key;
                break;
            case MORE_MENU.Remove_Key: // 移除标签
                targetComponent = CustomKeyPages;
                params.flag = FLAG_LANGUAGE.flag_key;
                params.isRemoveKey = true;
                break;
            case MORE_MENU.Custom_Theme: // 自定义主题
                break;
            case MORE_MENU.About_Author: // 关于作者
                break;
        }
        if (targetComponent) {
            this.props.navigator.push({
                component: targetComponent,
                params: params
            })
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        justifyContent: 'space-between',
        padding: 10,
    },
    github: {
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
    header: {
        backgroundColor: '#e7e7e7',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
    },
});