import React, {Component} from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    Text,
    Image,
    ScrollView,
    Alert,
    View,
} from 'react-native';
import CheckBox from 'react-native-check-box'
import NavigationBar from "../../../../view/NavigationBar";
import ViewUtil from '../../../../utils/ViewUtil'
import ArrayUtil from '../../../../utils/ArrayUtil'
import LanguageDao, {FLAG_LANGUAGE} from '../../../../expand/dao/LanguageDao'

/**
 * 自定义标签界面
 */
export default class CustomKeyPage extends Component {

    constructor(props) {
        super(props);
        this.isRemoveKey = this.props.isRemoveKey;
        this.changeValues = [];
        this.languageDao = new LanguageDao(this.props.flag);
        this.state = {
            dataArray: []
        }
    }

    /**
     * 界面加载完成加载数据
     */
    componentDidMount() {
        this.loadData();
    }

    /**
     * 加载数据
     */
    loadData() {
        this.languageDao.fetch()
            .then(result => {
                this.setState({
                    dataArray: result
                })
            })
            .catch(error => {
                console.log(error);
            })
    }

    render() {
        return (
            <View style={styles.container}>
                {this.renderNavigationBar()}
                <ScrollView>
                    {this.renderView()}
                </ScrollView>
            </View>
        );
    }

    renderView() {
        if (!this.state.dataArray || this.state.dataArray.length === 0)
            return;
        let len = this.state.dataArray.length;
        let views = [];
        for (let i = 0, l = len - 2; i < l; i += 2) {
            views.push(
                <View key={i}>
                    <View style={styles.item}>
                        {this.renderCheckBox(this.state.dataArray[i])}
                        {this.renderCheckBox(this.state.dataArray[i + 1])}
                    </View>
                    <View style={styles.line}/>
                </View>
            )
        }
        views.push(
            <View key={len - 1}>
                <View style={styles.item}>
                    {len % 2 === 0 ? this.renderCheckBox(this.state.dataArray[len - 2]) : null}
                    {this.renderCheckBox(this.state.dataArray[len - 1])}
                </View>
            </View>
        )
        return views;
    }

    renderCheckBox(data) {
        let leftText = data.name;
        let checked = this.isRemoveKey ? false : data.checked;
        return (
            <CheckBox
                style={{flex: 1, padding: 10}}
                leftText={leftText}
                onClick={() => this.onCheckClick(data)}
                checkedImage={
                    <Image
                        style={styles.checkBox}
                        source={require('../../../../../res/images/ic_check_box.png')}/>
                }
                unCheckedImage={
                    <Image
                        style={styles.checkBox}
                        source={require('../../../../../res/images/ic_check_box_outline_blank.png')}/>
                }
                isChecked={checked}
                isIndeterminate={false}/>
        );
    }

    onCheckClick(data) {
        if (!this.isRemoveKey) {
            data.checked = !data.checked;
        }
        ArrayUtil.updateItem(this.changeValues, data);
    }

    /**
     * 创建导航栏
     */
    renderNavigationBar() {
        let title = this.isRemoveKey ? '移除标签' : '自定义标签';
        title = this.props.flag === FLAG_LANGUAGE.flag_language ? '自定义语言' : title;
        let right = this.isRemoveKey ? '移除' : '保存';
        let rightButton = <TouchableOpacity
            onPress={() => this.onSave()}
        >
            <View style={{margin: 10}}>
                <Text style={styles.title}>{right}</Text>
            </View>
        </TouchableOpacity>
        return (
            <NavigationBar
                title={title}
                leftButton={ViewUtil.getLeftButton(() => this.onBack())}
                rightButton={rightButton}
            />
        );
    }

    onBack() {
        if (this.changeValues.length === 0) {
            this.props.navigator.pop();
            return;
        }
        Alert.alert(
            '提醒',
            '你修改了标签，需要保存吗',
            [
                {text: '不保存', onPress: () => this.props.navigator.pop(), style: 'cancel'},
                {text: '保存', onPress: () => this.onSave()},
            ],
            // 点击提示框的外面不取消提示框
            {cancelable: false}
        )
    }

    onSave() {
        if (this.changeValues.length === 0) {
            this.props.navigator.pop();
            return;
        }
        if (this.isRemoveKey) {
            // 移除标签
            for (let i = 0; i < this.changeValues.length; i++) {
                ArrayUtil.remove(this.state.dataArray, this.changeValues[i]);
            }
        }
        this.languageDao.save(this.state.dataArray);
        this.props.navigator.pop();
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    title: {
        color: 'white',
        fontSize: 20
    },
    checkBox: {
        tintColor: '#2196f3',
    },
    line: {
        height: 0.3,
        backgroundColor: 'darkgray',
    },
});