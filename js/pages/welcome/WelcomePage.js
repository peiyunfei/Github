import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View
} from 'react-native';
import NavigationBar from '../../view/NavigationBar'
import Main from '../main/Main'

/**
 * 欢迎界面，两秒后进入主界面
 */
export default class WelcomePage extends Component<{}> {

    /**
     * 界面加载完成
     */
    componentDidMount() {
        this.timer = setTimeout(() => {
            this.props.navigator.resetTo({
                component: Main
            })
        }, 2000);
    }

    componentWillUnmount() {
        this.timer && clearTimeout(this.timer);
    }

    render() {
        return (
            <View>
                <NavigationBar
                    title={'欢迎'}
                    style={{
                        backgroundColor: 'red'
                    }}
                    statusBar={{
                        backgroundColor: 'red'
                    }
                    }
                />
                <Text>欢迎</Text>
            </View>
        );
    }
}