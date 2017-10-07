import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    Image,
    TouchableOpacity,
    View
} from 'react-native';

export default class RepositoryCell extends Component {

    render() {
        return (
            <TouchableOpacity>
                <View style={styles.container}>
                    <Text style={styles.fullName}>{this.props.data.full_name}</Text>
                    <Text style={styles.description}>{this.props.data.description}</Text>
                    <View style={styles.bottomStyle}>
                        <View style={styles.textImg}>
                            <Text>Author:</Text>
                            <Image
                                style={styles.imgFavorite}
                                source={{uri: this.props.data.owner.avatar_url}}
                            />
                        </View>
                        <View style={styles.textImg}>
                            <Text style={{marginRight: 5}}>Stars:</Text>
                            <Text>{this.props.data.stargazers_count}</Text>
                        </View>
                        <Image
                            style={styles.imgFavorite}
                            source={require('../../../res/images/ic_star.png')}
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
    },
    bottomStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    textImg: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    imgFavorite: {
        marginLeft: 5,
        width: 22,
        height: 22,
    },
});