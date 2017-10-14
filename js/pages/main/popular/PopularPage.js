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
import DataRepository, {FLAG_STORAGE} from "../../../expand/dao/DataRepository";
import PopularCell from './PopularCell'
import PopularAndTrendDetail from '../PopularAndTrendDetail'
import LanguageDao, {FLAG_LANGUAGE} from '../../../expand/dao/LanguageDao'
import FavoriteDao from '../../../expand/dao/FavoriteDao'
import ProjectModel from '../../../model/ProjectModel'
import Util from '../../../utils/Util'

const URL = 'https://api.github.com/search/repositories?q=';
const QUERY_STR = '&sort=stars';
let favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_popular);
/**
 * 最热界面
 */
export default class PopularPage extends Component {

    constructor(props) {
        super(props);
        this.languageDao = new LanguageDao(FLAG_LANGUAGE.flag_key);
        this.state = {
            language: []
        }
    }

    componentDidMount() {
        this.loadData();
    }

    /**
     * 加载数据
     */
    loadData() {
        // 从数据库获取标签
        this.languageDao.fetch()
            .then(result => {
                this.setState({
                    language: result
                })
            })
            .catch(error => {
                console.log(error);
            })
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
        let content = this.state.language.length > 0 ? <ScrollableTabView
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
            {this.state.language.map((result, i, arr) => {
                let lan = arr[i];
                return lan.checked ?
                    <PopularTab
                        key={i}
                        tabLabel={lan.name}
                        {...this.props}
                    >
                    </PopularTab> : null;
            })}
        </ScrollableTabView> : null;
        return content;
    }

    /**
     * 创建导航栏
     * @returns {XML}
     */
    renderNavigationBar() {
        return <NavigationBar
            title={'最热'}
        />;
    }
}

class PopularTab extends Component {
    constructor(props) {
        super(props);
        this.dataRepository = new DataRepository(FLAG_STORAGE.flag_popular);
        this.state = {
            result: '',
            isLoading: false,
            favoriteKeys: [],
            dataSource: new ListView.DataSource({
                    rowHasChanged: (r1, r2) => r1 !== r2
                }
            )
        }
    }

    componentDidMount() {
        this.onLoad();
        this.listener = DeviceEventEmitter.addListener("favoriteChanged_popular", () => {
            this.favoriteChanged_popular = true;
        })
    }

    componentWillUnmount() {
        if (this.listener) {
            this.listener.remove();
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.favoriteChanged_popular) {
            this.favoriteChanged_popular = false;
            this.getFavoriteKeys();
        }
    }

    flushFavoriteState() {
        let projectModels = [];
        let items = this.items;
        for (let i = 0; i < items.length; i++) {
            projectModels.push(new ProjectModel(items[i],
                Util.checkItem(items[i], this.state.favoriteKeys)));
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

    onLoad() {
        this.setState({
            isLoading: true
        });
        let url = this.getUrl(this.props.tabLabel);
        this.dataRepository.fetchRepository(url)
            .then(result => {
                this.items = result && result.items ? result.items : result ? result : [];
                // this.setState({
                //     dataSource: this.state.dataSource.cloneWithRows(items),
                //     isLoading: false
                // });
                this.getFavoriteKeys();
                if (result && result.update_date && !this.dataRepository.checkDate(result.update_date)) {
                    // DeviceEventEmitter.emit('showToast', '缓存数据过期');
                    // 缓存数据过期，从网络获取数据
                    return this.dataRepository.fetchNetRepository(url);
                }
            })
            .then(items => {
                // DeviceEventEmitter.emit('showToast', '显示网络数据');
                // this.setState({
                //     dataSource: this.state.dataSource.cloneWithRows(items),
                // });
                this.items = items;
                this.getFavoriteKeys();
            })
            .catch(error => {
                this.setState({
                    result: JSON.stringify(error)
                })
            })
    }

    getFavoriteKeys() {
        favoriteDao.getFavoriteKeys()
            .then((keys) => {
                if (keys) {
                    this.updateState({favoriteKeys: keys});
                }
                this.flushFavoriteState();
            })
            .catch((e) => {
                this.flushFavoriteState();
            })
    }

    getUrl(key) {
        return URL + key + QUERY_STR;
    }

    render() {
        return (
            <View style={styles.container}>
                <ListView
                    dataSource={this.state.dataSource}
                    renderRow={(data) => this.renderRow(data)}
                    refreshControl={
                        <RefreshControl
                            // 视图是否应该在刷新时显示指示器
                            refreshing={this.state.isLoading}
                            // 下拉监听
                            onRefresh={() => this.loadDataFromNet()}
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

    loadDataFromNet() {
        this.onLoad();
    }

    onSelect(projectModel) {
        this.props.navigator.push({
            component: PopularAndTrendDetail,
            params: {
                projectModel: projectModel,
                flag: FLAG_STORAGE.flag_popular,
                ...this.props
            }
        });
    }

    onFavorite(item, isFavorite) {
        if (isFavorite) {
            favoriteDao.saveFavoriteItem(item.id.toString(), JSON.stringify(item));
        } else {
            favoriteDao.removeFavoriteItem(item.id.toString());
        }
    }

    renderRow(projectModel) {
        return (
            <PopularCell
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