import React, {Component} from 'react';
import {
    StyleSheet,
    WebView,
    TouchableOpacity,
    Image,
    View
} from 'react-native';
import NavigationBar from '../../view/NavigationBar'
import ViewUtil from '../../utils/ViewUtil'
import FavoriteDao from '../../expand/dao/FavoriteDao'

const TREND_URL = 'https://github.com/';
/**
 * 最热和趋势模块的详情界面
 */
export default class PopularAndTrendDetail extends Component {

    constructor(props) {
        super(props);
        this.favoriteDao = new FavoriteDao(this.props.flag);
        this.url = this.props.projectModel.item.html_url ? this.props.projectModel.item.html_url :
            TREND_URL + this.props.projectModel.item.full_name;
        let title = this.props.projectModel.item.full_name ?
            this.props.projectModel.item.full_name :
            this.props.projectModel.item.fullName;
        title = title.length > 25 ?
            "..." + title.substr(title.length - 25, title.length) : title;
        this.title = title;
        this.state = {
            url: this.url,
            title: this.title,
            canGoBack: false,
            isFavorite: this.props.projectModel.isFavorite,
            favoriteIcon: this.props.projectModel.isFavorite ?
                require('../../../res/images/ic_star.png') :
                require('../../../res/images/ic_star_navbar.png')
        }
    }

    render() {
        return (
            <View style={styles.container}>
                {this.renderNavigationBar()}
                <WebView
                    startInLoadingState={true}
                    ref={webView => this.webView = webView}
                    source={{uri: this.state.url}}
                    onNavigationStateChange={(e) =>
                        this.onNavigationStateChange(e)}
                />
            </View>
        );
    }

    onNavigationStateChange(e) {
        this.setState({
            canGoBack: e.canGoBack,
        })
    }

    goBack() {
        if (this.state.canGoBack) {
            this.webView.goBack();
        } else {
            this.props.navigator.pop();
        }
    }

    go() {
        this.setState({
            url: this.text,
        });
    }

    setFavoriteState(isFavorite) {
        this.setState({
            isFavorite: isFavorite,
            favoriteIcon: isFavorite ?
                require('../../../res/images/ic_star.png') :
                require('../../../res/images/ic_star_navbar.png')
        })
    }

    /**
     * 收藏按钮的点击事件
     */
    onFavoriteBtnClick() {
        let projectModel = this.props.projectModel;
        this.setFavoriteState(projectModel.isFavorite = !this.state.isFavorite);
        let key = projectModel.item.fullName ?
            projectModel.item.fullName :
            projectModel.item.id.toString();
        if (projectModel.isFavorite) {
            this.favoriteDao.saveFavoriteItem(key, JSON.stringify(projectModel.item));
        } else {
            this.favoriteDao.removeFavoriteItem(key);
        }
    }

    /**
     * 创建导航栏
     * @returns {XML}
     */
    renderNavigationBar() {
        let rightButton = <TouchableOpacity
            onPress={() => this.onFavoriteBtnClick()}
        >
            <Image
                style={{width: 20, height: 20, marginRight: 10}}
                source={this.state.favoriteIcon}
            />
        </TouchableOpacity>
        return (
            <NavigationBar
                title={this.title}
                leftButton={ViewUtil.getLeftButton(() => this.goBack())}
                rightButton={rightButton}
            />
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
    },
    title: {
        backgroundColor: 'red',
        color: 'white',
        padding: 5,
    },
    input: {
        padding: 5,
        marginRight: 5,
        marginLeft: 5,
        height: 30,
        flex: 1,
        borderWidth: 1,
    },
});