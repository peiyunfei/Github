import React, {Component, PropTypes} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Platform,
    StatusBar,
} from 'react-native';

// 导航栏在安卓中的高度
const NAV_BAR_HEIGHT_ANDROID = 50;
// 导航栏在ios中的高度
const NAV_BAR_HEIGHT_IOS = 44;
// 状态栏的高度
const STATE_BAR_HEIGHT = 50;

/**
 * 约束状态栏的属性
 */
const StatusBarShape = {
    // 状态栏的背景
    backgroundColor: PropTypes.string,
    // 状态栏文本的颜色
    barStyle: PropTypes.oneOf(['default', 'light-content', 'dark-content']),
    // 是否隐藏状态栏
    hidden: PropTypes.boolean,
}

/**
 * 自定义导航栏
 */
export default class NavigationBar extends Component {

    // 约束属性
    static propsTypes = {
        // 样式
        style: View.propTypes.style,
        // 中间的文本
        title: PropTypes.string,
        // 中间的文本视图
        titleView: PropTypes.element,
        // 左边按钮
        leftButton: PropTypes.element,
        // 右边按钮
        rightButton: PropTypes.element,
        // 是否隐藏导航栏
        hide: PropTypes.boolean,
        // 状态栏
        statusBar: PropTypes.shape(StatusBarShape)
    }

    // 设置默认属性
    static defaultProps = {
        statusBar: {
            hidden: false,
            backgroundColor: '#2196f3',
        }
    }

    constructor(props) {
        super(props);
        this.state = {
            title: '',
            hide: false
        }
    }

    render() {
        let {statusBar, content} = this.renderNavigationBar();
        return (
            <View
                // this.props.style取出用户设置导航栏的样式
                style={[styles.container, this.props.style]}>
                {statusBar}
                {content}
            </View>
        );
    }

    /**
     * 创建导航栏
     */
    renderNavigationBar() {
        // 状态栏
        let statusBar = <View
            style={styles.statusBar}>
            {/*this.props.statusBar取出用户设置的状态栏样式*/}
            <StatusBar {...this.props.statusBar}/>
        </View>
        let titleView = this.props.titleView ? this.props.titleView :
            <Text style={{color: 'white', fontSize: 18}}>{this.props.title}</Text>
        let content = <View
            style={styles.navBar}
        >
            {/*取出用户设置的左边按钮*/}
            {this.props.leftButton}
            {/*取出用户中间的文本视图*/}
            <View style={styles.titleView}>
                {titleView}
            </View>
            {/*取出用户设置的右边按钮*/}
            {this.props.rightButton}
        </View>
        return {statusBar, content};
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#2196f3',
    },
    navBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: Platform.OS === 'ios'
            ? NAV_BAR_HEIGHT_IOS : NAV_BAR_HEIGHT_ANDROID,
    },
    titleView: {
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        left: 0,
        right: 0,
    },
    statusBar: {
        height: Platform.OS === 'ios' ? STATE_BAR_HEIGHT : 0,
    }
});