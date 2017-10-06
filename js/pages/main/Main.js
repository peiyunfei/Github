import React, {Component} from 'react';
import {
    StyleSheet,
    Image,
    View
} from 'react-native';
import TabNavigator from 'react-native-tab-navigator'
import PopularPage from './popular/PopularPages'
import MinePage from './mine/MinePages'
import FavoritePage from './favorite/FavoritePages'
import TrendPage from './trend/TrendPages'

/**
 * 主界面
 */
export default class Main extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedTab: 'popular',
        }
    }

    render() {
        return (
            <TabNavigator>
                {/*最热*/}
                {this.renderTabBarItem('最热', require('../../../res/images/ic_polular.png'),
                    'popular', PopularPage)}

                {/*趋势*/}
                {this.renderTabBarItem('趋势', require('../../../res/images/ic_trending.png'),
                    'trend', TrendPage)}

                {/*收藏*/}
                {this.renderTabBarItem('收藏', require('../../../res/images/ic_favorite.png'),
                    'favorite', FavoritePage)}

                {/*我的*/}
                {this.renderTabBarItem('我的', require('../../../res/images/ic_my.png'),
                    'mine', MinePage)}
            </TabNavigator>
        );
    }

    renderTabBarItem(title, image, selectedTab, component) {
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
                        style={[styles.iconStyle, {tintColor: 'red'}]}
                        source={image}/>}
                selected={this.state.selectedTab === selectedTab}
                onPress={() => this.setState({selectedTab: selectedTab})}>
                {/*<View style={{flex: 1, backgroundColor: 'green'}}></View>*/}
                <View>{component}</View>
            </TabNavigator.Item>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconStyle: {
        width: 25,
        height: 25,
    },
    selectedTitle: {
        color: 'red',
    }
});