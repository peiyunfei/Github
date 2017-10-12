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

    constructor(props) {
        super(props);
        this.state = {
            isFavorite: this.props.projectModel.isFavorite,
            favoriteIcon: this.props.projectModel.isFavorite ?
                require('../../../../res/images/ic_star.png') :
                require('../../../../res/images/ic_unstar_transparent.png')
        }
    }

    setFavoriteState(isFavorite) {
        this.setState({
            isFavorite: isFavorite,
            favoriteIcon: isFavorite ? require('../../../../res/images/ic_star.png') :
                require('../../../../res/images/ic_unstar_transparent.png')
        })
    }

    onPressFavorite() {
        this.setFavoriteState(!this.state.isFavorite);
        this.props.onFavorite(this.props.projectModel.item, !this.state.isFavorite);
    }

    componentWillReceiveProps(nextProps) {
        this.setFavoriteState(nextProps.projectModel.isFavorite);
    }

    render() {
        let item = this.props.projectModel.item;
        let favoriteIcon = <TouchableOpacity
            onPress={() => this.onPressFavorite()}
        >
            <Image
                style={styles.imgFavorite}
                source={this.state.favoriteIcon}
            />
        </TouchableOpacity>
        let description = '<p>' + item.description + '</p>';
        return (
            <TouchableOpacity
                onPress={this.props.onSelect}
            >
                <View style={styles.container}>
                    <Text style={styles.fullName}>{item.fullName}</Text>
                    <HTMLView
                        value={description}
                        onLinkPress={(url) => {
                        }}
                        stylesheet={{
                            p: styles.description,
                            a: styles.description
                        }}
                    />
                    <Text style={styles.description}>{item.meta}</Text>
                    <View style={styles.bottomStyle}>
                        <View style={styles.textImg}>
                            <Text>Build by:</Text>
                            {item.contributors.map((result, i, arr) => {
                                return <Image
                                    key={i}
                                    style={styles.avatar}
                                    source={{uri: arr[i]}}
                                />
                            })}
                        </View>
                        {favoriteIcon}
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