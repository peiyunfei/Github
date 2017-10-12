import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    Image,
    TouchableOpacity,
    View
} from 'react-native';
import HTMLView from 'react-native-htmlview';

export default class TrendCell extends Component {

    render() {
        let data = this.props.data;
        let description = '<p>' + this.props.data.description + '</p>';
        return (
            <TouchableOpacity
                onPress={this.props.onSelect}
            >
                <View style={styles.container}>
                    <Text style={styles.fullName}>{data.fullName}</Text>
                    <HTMLView
                        value={description}
                        onLinkPress={(url) => {
                        }}
                        stylesheet={{
                            p: styles.description,
                            a: styles.description
                        }}
                    />
                    <Text style={styles.description}>{data.meta}</Text>
                    <View style={styles.bottomStyle}>
                        <View style={styles.textImg}>
                            <Text>Build by:</Text>
                            {data.contributors.map((result, i, arr) => {
                                return <Image
                                    key={i}
                                    style={styles.avatar}
                                    source={{uri: arr[i]}}
                                />
                            })}
                        </View>
                        <Image
                            style={styles.imgFavorite}
                            source={require('../../../../res/images/ic_star.png')}
                        />
                    </View>

                </View>
            </TouchableOpacity>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: 'white',
        borderColor: '#dddddd',
        borderWidth: 0.5,
        marginRight: 5,
        marginLeft: 5,
        marginVertical: 3,
        borderRadius: 3,
        shadowColor: 'gray',
        shadowOffset: {width: 0.5, height: 0.5},
        shadowOpacity: 0.5,
        shadowRadius: 1,
        elevation: 2
    },
    fullName: {
        color: 'black',
        marginBottom: 5,
        fontSize: 16,
    },
    description: {
        fontSize: 14,
        marginBottom: 5,
        color:'#757575'
    },
    bottomStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    textImg: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        marginLeft: 5,
        width: 22,
        height: 22,
    },
    imgFavorite: {
        marginLeft: 5,
        width: 22,
        height: 22,
        tintColor: '#2196f3'
    },
});