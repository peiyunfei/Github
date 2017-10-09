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
import DataRepository from "../../../expand/dao/DataRepository";
import RepositoryCell from '../RepositoryCell'
import PopularDetail from './detail/PopularDetail'
import LanguageDao, {FLAG_LANGUAGE} from '../../../expand/dao/LanguageDao'

const URL = 'https://api.github.com/search/repositories?q=';
const QUERY_STR = '&sort=stars';

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
                        {lan.name}</PopularTab> : null;
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
        this.dataRepository = new DataRepository()
        this.state = {
            result: '',
            isLoading: false,
            dataSource: new ListView.DataSource({
                    rowHasChanged: (r1, r2) => r1 !== r2
                }
            )
        }
    }

    componentDidMount() {
        this.onLoad();
    }

    onLoad() {
        this.setState({
            isLoading: true
        })
        let url = this.getUrl(this.props.tabLabel);
        this.dataRepository.fetchRepository(url)
            .then(result => {
                let items = result && result.items ? result.items : result ? result : [];
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(items),
                    isLoading: false
                });
                if (result && result.update_date && !this.dataRepository.checkDate(result.update_date)) {
                    // DeviceEventEmitter.emit('showToast', '缓存数据过期');
                    // 缓存数据过期，从网络获取数据
                    return this.dataRepository.fetchNetRepository(url);
                }
            })
            .then(items => {
                // DeviceEventEmitter.emit('showToast', '显示网络数据');
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(items),
                });

            })
            .catch(error => {
                this.setState({
                    result: JSON.stringify(error)
                })
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

    onSelect(data) {
        this.props.navigator.push({
            component: PopularDetail,
            params: {
                data: data,
                ...this.props
            }
        });
    }

    renderRow(data) {
        return (
            <RepositoryCell
                // 传递属性和数据
                onSelect={() => this.onSelect(data)}
                data={data}/>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});