import React, {Component} from 'react';
import {
    StyleSheet,
    ListView,
    RefreshControl,
    DeviceEventEmitter,
    View
} from 'react-native';
import NavigationBar from "../../../view/NavigationBar";
import ScrollableTabView, {ScrollableTabBar} from 'react-native-scrollable-tab-view'
import PopularCell from '../popular/PopularCell'
import TrendCell from '../trend/TrendCell'
import PopularAndTrendDetail from '../PopularAndTrendDetail'
import FavoriteDao from '../../../expand/dao/FavoriteDao'
import {FLAG_STORAGE} from '../../../expand/dao/DataRepository'
import ProjectModel from '../../../model/ProjectModel'
import ArrayUtil from '../../../utils/ArrayUtil'

/**
 * 最热界面
 */
export default class FavoritePage extends Component {

    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        let content = this.renderScrollableTabView();
        return (
            <View style={styles.container}>
                {this.renderNavigationBar()}
                {content}
            </View>
        );
    }

    /**
     * 创建ScrollableTabView
     * @returns {*}
     */
    renderScrollableTabView() {
        // 如果还没有读取到用户设置的页签，则不加载ScrollableTabView
        let content = <ScrollableTabView
            // 页签的颜色
            tabBarBackgroundColor='#2196f3'
            // 为选中的颜色
            tabBarInactiveTextColor='mintcream'
            // 选中的颜色
            tabBarActiveTextColor='white'
            // 指示器的样式
            tabBarUnderlineStyle={{backgroundColor: '#e7e7e7', height: 2}}
            renderTabBar={() => <ScrollableTabBar/>}
        >
            <FavoriteTab {...this.props} tabLabel='最热' flag={FLAG_STORAGE.flag_popular}/>
            <FavoriteTab {...this.props} tabLabel='趋势' flag={FLAG_STORAGE.flag_trending}/>
        </ScrollableTabView>;
        return content;
    }

    /**
     * 创建导航栏
     * @returns {XML}
     */
    renderNavigationBar() {
        return <NavigationBar
            title={'收藏'}
        />;
    }
}

class FavoriteTab extends Component {
    constructor(props) {
        super(props);
        this.unFavoriteItems = [];
        this.favoriteDao = new FavoriteDao(this.props.flag);
        this.state = {
            isLoading: false,
            dataSource: new ListView.DataSource({
                    rowHasChanged: (r1, r2) => r1 !== r2
                }
            )
        }
    }

    componentDidMount() {
        this.onLoad(true);
    }

    componentWillReceiveProps(nextProps) {
        this.onLoad(false);
    }

    flushFavoriteState() {
        let projectModels = [];
        let items = this.items;
        for (let i = 0; i < items.length; i++) {
            projectModels.push(new ProjectModel(items[i], true));
        }
        this.updateState({
            isLoading: false,
            dataSource: this.state.dataSource.cloneWithRows(projectModels)
        });
    }

    updateState(dir) {
        if (!this) return;
        this.setState(dir);
    }

    onLoad(isShowLoading) {
        if (isShowLoading) {
            this.setState({
                isLoading: true
            });
        }
        this.favoriteDao.getAllItems()
            .then(items => {
                this.items = items;
                this.flushFavoriteState();
            })
            .catch(e => {
                this.updateState({
                    isLoading: false,
                })
            })
    }

    render() {
        return (
            <View style={styles.container}>
                <ListView
                    dataSource={this.state.dataSource}
                    enableEmptySections={true}
                    renderRow={(data) => this.renderRow(data)}
                    refreshControl={
                        <RefreshControl
                            // 视图是否应该在刷新时显示指示器
                            refreshing={this.state.isLoading}
                            // 下拉监听
                            onRefresh={() => this.onRefresh()}
                            // 安卓中下拉刷新进度条的颜色
                            colors={['#ff0000', '#00ff00', '#0000ff']}
                            // colors:{['#2196f3']}
                            // ios中下拉刷新进度条的颜色
                            tintColor={"#2196f3"}
                            // 下拉刷新显示的文本
                            title={'正在刷新'}
                            // 下拉刷新显示的文本的颜色
                            titleColor={'#2196f3'}
                        />
                    }
                />
            </View>
        );
    }

    onRefresh() {
        this.onLoad(true);
    }

    onSelect(projectModel) {
        let flagCell = this.props.flag === FLAG_STORAGE.flag_popular ?
            FLAG_STORAGE.flag_popular : FLAG_STORAGE.flag_trending;
        this.props.navigator.push({
            component: PopularAndTrendDetail,
            params: {
                projectModel: projectModel,
                flag: flagCell,
                ...this.props
            }
        });
    }

    onFavorite(item, isFavorite) {
        let key = this.props.flag === FLAG_STORAGE.flag_popular ?
            item.id.toString() : item.fullName;
        if (isFavorite) {
            this.favoriteDao.saveFavoriteItem(key, JSON.stringify(item));
        } else {
            this.favoriteDao.removeFavoriteItem(key);
        }
        ArrayUtil.updateItem(this.unFavoriteItems, item);
        if (this.unFavoriteItems.length >= 0) {
            if (this.props.flag === FLAG_STORAGE.flag_popular) {
                DeviceEventEmitter.emit("favoriteChanged_popular");
            } else {
                DeviceEventEmitter.emit("favoriteChanged_trend");
            }
        }
    }

    renderRow(projectModel) {
        let FavoriteCell = this.props.flag === FLAG_STORAGE.flag_popular ? PopularCell : TrendCell;
        return (
            <FavoriteCell
                // 传递属性和数据
                onSelect={() => this.onSelect(projectModel)}
                projectModel={projectModel}
                onFavorite={(item, isFavorite) => this.onFavorite(item, isFavorite)}
            />
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});