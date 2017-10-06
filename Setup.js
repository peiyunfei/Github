/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {Navigator} from 'react-native-deprecated-custom-components'
import WelcomePage from './js/pages/welcome/WelcomePage'

export default class Setup extends Component {
    render() {
        return (
            <Navigator
                initialRoute={{component: WelcomePage}}
                configureScene={() => {// 过渡动画
                    return Navigator.SceneConfigs.PushFromRight;
                }}
                renderScene={(route, navigator) => {
                    let Component = route.component;
                    return <Component navigator={navigator} {...route.params}/>;
                }}
            />
        );
    }
}