/**
 * 更多菜单
 * @flow
 */
import React, {Component, PropTypes} from 'react';

import {
    StyleSheet,
    Platform,
    TouchableOpacity,
    Image,
    Text,
    View,
    Linking,

} from 'react-native'
import CustomKeyPage from "../pages/main/mine/key/CustomKeyPages";
import SortKeyPagePage from "../pages/main/mine/key/SortKeyPage";
import Popover from '../view/Popover'
import {FLAG_LANGUAGE} from "../expand/dao/LanguageDao";

export const MORE_MENU = {
    Custom_Language: '自定义语言',
    Sort_Language: '语言排序',
    Custom_Theme: '自定义主题',
    Custom_Key: '自定义标签',
    Sort_Key: '标签排序',
    Remove_Key: '标签移除',
    About_Author: '关于作者',
    About: '关于',
    Website: 'Website',
    Feedback: '反馈',
    Share: '分享',
}