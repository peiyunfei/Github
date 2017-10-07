import React, {Component} from 'react';
import {
    StyleSheet,
    ListView,
    RefreshControl,
    View
} from 'react-native';
import NavigationBar from "../../../view/NavigationBar";
import ScrollableTabView, {ScrollableTabBar} from 'react-native-scrollable-tab-view'
import DataRepository from "../../../expand/dao/DataRepository";
import RepositoryCell from '../RepositoryCell'

const URL = 'https://api.github.com/search/repositories?q=';
const QUERY_STR = '&sort=stars';

/**
 * 最热界面
 */
export default class PopularPages extends Component {

    render() {
        return (
            <View style={styles.container}>
                {this.renderNavigationBar()}
                <ScrollableTabView
                    tabBarBackgroundColor='#2196f3'
                    // 为选中的颜色
                    tabBarInactiveTextColor='mintcream'
                    // 选中的颜色
                    tabBarActiveTextColor='white'
                    // 指示器的样式
                    tabBarUnderlineStyle={{backgroundColor: '#e7e7e7', height: 2}}
                    renderTabBar={() => <ScrollableTabBar/>}
                >
                    <PopularTab tabLabel='Java'>Java</PopularTab>
                    <PopularTab tabLabel='IOS'>IOS</PopularTab>
                    <PopularTab tabLabel='Android'>Android</PopularTab>
                    <PopularTab tabLabel='JavaScript'>JavaScript</PopularTab>
                </ScrollableTabView>
            </View>
        );
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
        this.dataRepository.fetchNetRepository(url)
            .then(result => {
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(result.items),
                    isLoading: false
                })
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

    renderRow(data) {
        return (
            <RepositoryCell data={data}/>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});