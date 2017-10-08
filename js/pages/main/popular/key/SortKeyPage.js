import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    TouchableHighlight,
    Alert,
} from 'react-native';
import NavigationBar from "../../../../view/NavigationBar";
import ViewUtil from '../../../../utils/ViewUtil'
import SortableListView from 'react-native-sortable-listview'
import ArrayUtil from '../../../../utils/ArrayUtil'
import LanguageDao, {FLAG_LANGUAGE} from '../../../../expand/dao/LanguageDao'

/**
 * 标签排序界面
 */
export default class SortKeyPage extends Component {

    constructor(props) {
        super(props);
        this.languageDao = new LanguageDao(FLAG_LANGUAGE.flag_key);
        // 数据库中存储的标签
        this.dataArray = [];
        // 排序之后存入数据库的标签
        this.sortResultArray = []
        // 刚开始从数据库取出用户选择的标签，原始的排序方式
        this.originalCheckedArray = []
        this.state = {
            // 排序后用户选择的标签
            checkArray: []
        }
    }

    componentDidMount() {
        this.loadData();
    }

    loadData() {
        this.languageDao.fetch()
            .then(result => {
                this.getCheckedItem(result);
            })
            .catch(error => {
                console.log(error);
            })
    }

    getCheckedItem(result) {
        this.dataArray = result;
        let checkArray = [];
        for (let i = 0; i < result.length; i++) {
            let tab = result[i];
            if (tab.checked) {
                checkArray.push(tab);
            }
        }
        this.setState({
            checkArray: checkArray
        })
        this.originalCheckedArray = ArrayUtil.clone(checkArray);
    }

    render() {
        return (
            <View style={styles.container}>
                {this.renderNavigationBar()}
                {this.renderSotrableListView()}
            </View>
        );
    }

    /**
     * 创建可排序的ListView
     * @returns {XML}
     */
    renderSotrableListView() {
        return <SortableListView
            style={{flex: 1}}
            data={this.state.checkArray}
            order={Object.keys(this.state.checkArray)}
            onRowMoved={e => {
                this.state.checkArray.splice(e.to, 0, this.state.checkArray.splice(e.from, 1)[0])
                this.forceUpdate()
            }}
            renderRow={row => <SortCell data={row}/>}
        />;
    }

    onBack() {
        // 判断是否排序了
        if (ArrayUtil.isEqual(this.originalCheckedArray, this.state.checkArray)) {
            // 没有排序
            this.props.navigator.pop();
            return;
        }
        Alert.alert(
            '提示',
            '是否保存修改',
            [
                {text: '否', onPress: () => this.props.navigator.pop(), style: 'cancel'},
                {text: '是', onPress: () => this.onSave(true)},
            ],
            // 点击提示框的外面不取消提示框
            {cancelable: false}
        )
    }

    onSave(isChecked) {
        if (!isChecked && ArrayUtil.isEqual(this.originalCheckedArray, this.state.checkArray)) {
            this.props.navigator.pop();
            return;
        }
        this.getSortResult();
        // 保存排序后的标签到数据库
        this.languageDao.save(this.sortResultArray);
        this.props.navigator.pop();
    }

    /**
     * 获取排序后的结果
     */
    getSortResult() {
        this.sortResultArray = ArrayUtil.clone(this.dataArray);
        let len = this.originalCheckedArray.length;
        for (let i = 0; i < len; i++) {
            let item = this.originalCheckedArray[i];
            let index = this.dataArray.indexOf(item);
            this.sortResultArray.splice(index, 1, this.state.checkArray[i]);
        }
    }

    /**
     * 创建导航栏
     */
    renderNavigationBar() {
        let rightButton = <TouchableOpacity
            onPress={() => this.onSave()}
        >
            <View style={{margin: 10}}>
                <Text style={styles.title}>保存</Text>
            </View>
        </TouchableOpacity>
        return (
            <NavigationBar
                title={'标签排序'}
                leftButton={ViewUtil.getLeftButton(() => this.onBack())}
                rightButton={rightButton}
            />
        );
    }
}

class SortCell extends Component {
    render() {
        return (
            <TouchableHighlight
                underlayColor={'#eee'}
                style={styles.item}
                {...this.props.sortHandlers}
            >
                <View style={styles.row}>
                    <Image
                        style={styles.image}
                        source={require('../../../../../res/images/ic_sort.png')}
                    />
                    <Text>{this.props.data.name}</Text>
                </View>
            </TouchableHighlight>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    title: {
        color: 'white',
        fontSize: 20
    },
    item: {
        padding: 15,
        backgroundColor: '#F8F8F8',
        borderBottomWidth: 1,
        borderColor: '#eee',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    image: {
        width: 16,
        height: 16,
        tintColor: '#2196f3',
        marginRight: 10,
    },
});