import React from 'react';
import ListItem from './ListItem';
import { StyleSheet, FlatList } from 'react-native';

const VideoList = props => {
    return(
      <FlatList 
        style={styles.listContainer}
        data={props.videos}
        renderItem = {(info) =>
            <ListItem 
                vidUri={info.item.uri}
                id={info.item.key}
                vidName={info.item.name} 
                handleVideo={props.handleVideo}
            />}
        keyExtractor={item => item.key.toString()}
    />)
}

const styles = StyleSheet.create({
    listContainer: {
        width: '100%',
        height: 600
    }
})
 
export default VideoList;