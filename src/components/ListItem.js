import React from 'react';
import { View, Text, StyleSheet, TouchableNativeFeedback, Image } from 'react-native';

const ListItem = props => (
    <TouchableNativeFeedback onPress={() => props.handleVideo(props.vidUri)}>
        <View style={styles.listItem}>
            <Image source={{uri: props.vidUri}} style={styles.placeImg}/>
            <Text style={{color: 'white'}}>
                {props.vidName}
            </Text>
        </View>
    </TouchableNativeFeedback>
);

const styles = StyleSheet.create({
    listItem: {
        width: '98%',
        padding: 10,
        backgroundColor: '#181818',
        marginBottom: 5,
        marginLeft: 4,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'white',
        borderRadius: 10
    },
    placeImg: {
        marginRight: 8,
        height: 100,
        width: 100,
        marginLeft: 25
    }
});

export default ListItem;