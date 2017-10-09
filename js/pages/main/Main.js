import React, {Component} from 'react';
import {
    StyleSheet,
    Image,
    DeviceEventEmitter,
    View
} from 'react-native';
import TabNavigator from 'react-native-tab-navigator'
import Toast, {DURATION} from 'react-native-easy-toast'
import PopularPage from './popular/PopularPage'
import MinePage from './mine/MinePage'
import FavoritePage from './favorite/FavoritePage'
import TrendPage from './trend/TrendPage'
import WebViewTest from '../../../WebViewTest'

/**
 * 主界面
 */
export default class Main extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedTab: 'popular',
            theme: this.props.theme,
        }
    }

    componentDidMount() {
        this.listener = DeviceEventEmitter.addListener('showToast', (text) => {
            this.toast.show(text, DURATION.LENGTH_SHORT);
        });
    }

    componentWillUnmount() {
        this.listener && this.listener.remove();
    }

    render() {
        return (
            <View style={styles.container}>
                <TabNavigator>
                    {/*最热*/}
                    {this.renderTabBarItem('最热', require('../../../res/images/ic_polular.png'),
                        'popular', PopularPage)}

                    {/*趋势*/}
                    {this.renderTabBarItem('趋势', require('../../../res/images/ic_trending.png'),
                        'trend', TrendPage)}

                    {/*收藏*/}
                    {this.renderTabBarItem('收藏', require('../../../res/images/ic_favorite.png'),
                        'favorite', WebViewTest)}

                    {/*我的*/}
                    {this.renderTabBarItem('我的', require('../../../res/images/ic_my.png'),
                        'mine', MinePage)}
                </TabNavigator>
                <Toast ref={toast => this.toast = toast}/>
            </View>
        );
    }

    renderTabBarItem(title, image, selectedTab, Component) {
        return (
            <TabNavigator.Item
                title={title}
                selectedTitleStyle={styles.selectedTitle}
                renderIcon={() =>
                    <Image
                        style={styles.iconStyle}
                        source={image}/>}
                renderSelectedIcon={() =>
                    <Image
                        style={[styles.iconStyle, {tintColor: '#2196f3'}]}
                        source={image}/>}
                selected={this.state.selectedTab === selectedTab}
                onPress={() => this.setState({selectedTab: selectedTab})}>
                <Component {...this.props} theme={this.state.theme}/>
            </TabNavigator.Item>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    iconStyle: {
        width: 25,
        height: 25,
    },
    selectedTitle: {
        color: '#2196f3',
    }
});