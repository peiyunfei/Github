import React, {Component} from 'react';
import {
    StyleSheet,
    WebView,
    View
} from 'react-native';
import NavigationBar from '../../../../view/NavigationBar'
import ViewUtil from '../../../../utils/ViewUtil'

/**
 * 最热模块的详情界面
 */
export default class PopularDetail extends Component {

    constructor(props) {
        super(props);
        this.url = this.props.data.html_url;
        let title = this.props.data.full_name;
        title = title.length > 25 ?
            "..." + title.substr(title.length - 25, title.length) : title;
        this.title = title;
        this.state = {
            url: this.url,
            title: this.title,
            canGoBack: false,
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

    /**
     * 创建导航栏
     * @returns {XML}
     */
    renderNavigationBar() {
        return (
            <NavigationBar
                title={this.title}
                leftButton={ViewUtil.getLeftButton(() => this.goBack())}
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