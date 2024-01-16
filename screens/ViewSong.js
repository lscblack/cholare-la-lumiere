import React, { useState, useEffect } from 'react';

import {
    Button,
    DrawerLayoutAndroid,
    Text,
    StyleSheet,
    View,
} from 'react-native';
import { Pressable, SafeAreaView, TouchableOpacity, Image, Animated, Alert, ScrollView } from 'react-native';
import { initializeApp } from 'firebase/app';
import FontAwesome from '@expo/vector-icons/FontAwesome'
import {
    collection,
    getFirestore,
    getDocs, getDoc,
    addDoc,
    query, doc,
    where,
} from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDLEq5Dzqh6LAoeKTJ7xb0pH5o5CBfJeVE",
    authDomain: "la-lumiere-choir.firebaseapp.com",
    projectId: "la-lumiere-choir",
    storageBucket: "la-lumiere-choir.appspot.com",
    messagingSenderId: "264115206395",
    appId: "1:264115206395:web:3734c97d9fbb47c553185e"
};
const ViewSong = (props) => {
    const { song_id } = props.route.params; // Access the song ID from the route params
    const [Songs, setSongs] = useState([])
    // Initialize Firebase and Firestore
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    const docRef = doc(db, 'Songs', song_id);

    useEffect(() => {
        const docRef = doc(db, 'Songs', song_id);

        getDoc(docRef)
            .then((docSnap) => {
                if (docSnap.exists()) {
                    // Document found, retrieve its data using .data()
                    const data = docSnap.data();
                    setSongs([data]);
                } else {
                    Alert.alert('Nabwo ibyo mwasabye bikunze');
                }
            })
            .catch((error) => {
                console.error('Error getting document:', error);
            });
    }, []);
    return (
        <SafeAreaView style={{ backgroundColor: 'black', height: '100%', }}>
            <ScrollView >
                <View style={styles.mainBg}>

                    {
                        Songs.map(song => {
                            return (
                                <React.Fragment key={song.id} >
                                    <View key={song.id+1000} style={styles.ds}>
                                        <Text style={styles.musictitle} >{song.songName}</Text>
                                        <View style={styles.gridView}>
                                            <Text style={styles.musicheads} >Writer: {song.songWrite}</Text>
                                            <Text style={styles.musicheads} >Key: {song.songKey}</Text>
                                            <Text style={styles.musicheads} >{song.SongDate}</Text>
                                        </View>
                                    </View>
                                    <Text  style={[styles.musictitle2, { textAlign: 'center', display: 'none', fontWeight: 'bold' }]}>Ibitero By'indirimbo: </Text>

                                    <View style={styles.ds} >
                                            <Text style={styles.musicdesc}>{song.song}</Text>
                                    </View>
                                </React.Fragment>
                            );


                        })
                    }
                </View>

            </ScrollView>
        </SafeAreaView>
    );
};

export default ViewSong;

const styles = StyleSheet.create({
    mainBg: {
        flex: 1,
        marginTop: 12,

    },
    //-------start of music
    gridView: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        padding: 10,
        marginHorizontal: 'auto', // Margin horizontally centered
        alignItems: 'center',
    },
    ds: {
        padding: 12,
        textAlign: 'right'
    },
    musictitle: {
        fontWeight: 'bold',
        color: 'white',
        fontSize: 20,
        textAlign: 'center',
        color: 'rgb(208, 212, 255)',
    },
    musicheads: {
        fontWeight: 'bold',
        color: 'white',
        fontSize: 13,
        textAlign: 'center',
        color: 'rgb(208, 212, 255)',
    },
    musicdesc: {
        fontSize: 16,
        fontStyle: 'italic',
        color: 'rgb(208, 212, 255)',
        textAlign: 'left',
        paddingLeft: 5,
        fontFamily: 'serif'
    },

    mainColor: {
        backgroundColor: 'none',
    },

});
