import React, {Component} from 'react';
import {
    StyleSheet,
    ListView,
    RefreshControl,
    TouchableOpacity,
    Image,
    Text,
    DeviceEventEmitter,
    View
} from 'react-native';
import NavigationBar from "../../../view/NavigationBar";
import ScrollableTabView, {ScrollableTabBar} from 'react-native-scrollable-tab-view'
import DataRepository, {FLAG_STORAGE} from "../../../expand/dao/DataRepository";
import TrendCell from './TrendCell'
import TimeSpan from '../../../model/TimeSpan'
import Popover from '../../../view/Popover'
import PopularAndTrendDetail from '../PopularAndTrendDetail'
import LanguageDao, {FLAG_LANGUAGE} from '../../../expand/dao/LanguageDao'
import FavoriteDao from '../../../expand/dao/FavoriteDao'
import ProjectModel from '../../../model/ProjectModel'
import Util from '../../../utils/Util'

let favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_trending);
let dataRepository = new DataRepository(FLAG_STORAGE.flag_trending);
const URL = 'https://github.com/trending/';
let timeSpanArray = [
    new TimeSpan('今 天', 'since=daily'),
    new TimeSpan('本 周', 'since=weekly'),
    new TimeSpan('本 月', 'since=monthly'),
];
/**
 * 最热界面
 */
export default class TrendPage extends Component {

    constructor(props) {
        super(props);
        this.languageDao = new LanguageDao(FLAG_LANGUAGE.flag_language);
        this.state = {
            language: [],
            isVisible: false,
            buttonRect: {},
            timeSpan: timeSpanArray[0],
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
        let popover = this.renderPopover();
        return (
            <View style={styles.container}>
                {this.renderNavigationBar()}
                {content}
                {popover}
            </View>
        );
    }

    /**
     * 创建弹窗
     * @returns {XML}
     */
    renderPopover() {
        return <Popover
            // 在下面显示弹窗
            placement='bottom'
            isVisible={this.state.isVisible}
            fromRect={this.state.buttonRect}
            contentStyle={{backgroundColor: '#343434', opacity: 0.8}}
            onClose={() => {
                this.closePopover()
            }}>
            {timeSpanArray.map((result, i, arr) => {
                return <TouchableOpacity
                    key={i}
                    underlayColor='transparent'
                    onPress={() => this.onSelectTimeSpan(arr[i])}
                >
                    <Text style={{color: 'white', fontSize: 18, padding: 8}}
                    >{arr[i].showText}</Text>
                </TouchableOpacity>
            })}
        </Popover>
    }

    onSelectTimeSpan(timeSpan) {
        this.setState({
            timeSpan: timeSpan,
            isVisible: false
        })
    }

    /**
     * 打开弹窗
     */
    showPopover() {
        this.refs.button.measure((ox, oy, width, height, px, py) => {
            this.setState({
                isVisible: true,
                buttonRect: {x: px, y: py, width: width, height: height}
            });
        });
    }

    /**
     * 关闭弹窗
     */
    closePopover() {
        this.setState({isVisible: false});
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
                    <TrendTab
                        key={i}
                        tabLabel={lan.name}
                        timeSpan={this.state.timeSpan}
                        {...this.props}
                    >
                        {lan.name}</TrendTab> : null;
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
            titleView={this.renderTitleView()}
        />;
    }

    renderTitleView() {
        return (
            <TouchableOpacity
                underlayColor='transparent'
                ref='button'
                onPress={() => {
                    this.showPopover()
                }}
            >
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={{
                        color: 'white',
                        fontSize: 18,
                        marginRight: 5
                    }}>趋势 {this.state.timeSpan.showText}</Text>
                    <Image
                        style={{width: 12, height: 12,}}
                        source={require('../../../../res/images/ic_spinner_triangle.png')}
                    />
                </View>
            </TouchableOpacity>
        );
    }
}

class TrendTab extends Component {
    constructor(props) {
        super(props);
        this.state = {
            result: '',
            isLoading: false,
            favoriteKeys:[],
            dataSource: new ListView.DataSource({
                    rowHasChanged: (r1, r2) => r1 !== r2
                }
            )
        }
    }

    /**
     * 当收到新的属性时回调
     * @param nextProps 新的属性
     */
    componentWillReceiveProps(nextProps) {
        if (nextProps.timeSpan !== this.props.timeSpan) {
            this.onLoad(nextProps.timeSpan);
        }
    }

    componentDidMount() {
        this.onLoad(this.props.timeSpan, true);
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

    onLoad(timeSpan, isRefresh) {
        this.setState({
            isLoading: true
        });
        let url = this.getUrl(this.props.tabLabel, timeSpan);
        dataRepository.fetchRepository(url)
            .then(result => {
                this.items = result && result.items ? result.items : result ? result : [];
                // this.setState({
                //     dataSource: this.state.dataSource.cloneWithRows(items),
                //     isLoading: false
                // });
                this.getFavoriteKeys();
                if (result && result.update_date && !dataRepository.checkDate(result.update_date)) {
                    // DeviceEventEmitter.emit('showToast', '缓存数据过期');
                    // 缓存数据过期，从网络获取数据
                    return dataRepository.fetchNetRepository(url);
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

    getUrl(catalog, timeSpan) {
        return URL + catalog + '?' + timeSpan.searchText;
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
        this.onLoad(this.props.timeSpan);
    }

    onSelect(projectModel) {
        this.props.navigator.push({
            component: PopularAndTrendDetail,
            params: {
                projectModel: projectModel,
                flag: FLAG_STORAGE.flag_trending,
                ...this.props
            }
        });
    }

    onFavorite(item, isFavorite) {
        if (isFavorite) {
            favoriteDao.saveFavoriteItem(item.fullName.toString(), JSON.stringify(item));
        } else {
            favoriteDao.removeFavoriteItem(item.fullName.toString());
        }
    }

    renderRow(projectModel) {
        return (
            <TrendCell
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