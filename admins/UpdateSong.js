import React, { useEffect, useState } from 'react';
import {
    Button,
    DrawerLayoutAndroid,
    Text,
    StyleSheet,
    View, TextInput
} from 'react-native';
import { Pressable, SafeAreaView, TouchableOpacity, Image, Animated, Alert, ScrollView } from 'react-native';
import { initializeApp } from 'firebase/app';
import FontAwesome from '@expo/vector-icons/FontAwesome'
import {
    collection,
    getFirestore, onSnapshot,
    getDocs,
    query, doc, deleteDoc,
    where,
    count,
} from 'firebase/firestore';


const firebaseConfig = {
    apiKey: "AIzaSyDLEq5Dzqh6LAoeKTJ7xb0pH5o5CBfJeVE",
    authDomain: "la-lumiere-choir.firebaseapp.com",
    projectId: "la-lumiere-choir",
    storageBucket: "la-lumiere-choir.appspot.com",
    messagingSenderId: "264115206395",
    appId: "1:264115206395:web:3734c97d9fbb47c553185e"
};
// Initialize Firebase and Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const admins = collection(db, 'admins');

const UpdateSong = ({ navigation }) => {
    const [songsData, setSongsData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const songsCollection = collection(db, 'Songs');
                const snapshot = await getDocs(songsCollection);

                const songsList = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                setSongsData(songsList);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();

        // Listen for realtime updates
        const unsubscribe = onSnapshot(collection(db, 'Songs'), (snapshot) => {
            const updatedSongs = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setSongsData(updatedSongs);
        });

        // To stop listening for changes (when you no longer need it)
        return () => unsubscribe();
    }, [db]);
    //------------------------delete Songs
    function deleteHandle(id) {
        const documentRef = doc(db, 'Songs', id);

        // Delete the document
        deleteDoc(documentRef)
            .then(() => {
                //Alert.alert('Document successfully deleted!');
            })
            .catch((error) => {
                Alert.alert('Error removing document: ', Error);
            });
    }
    //------------------------End delete Songs
    //----------------------------- Search
    const [searchText, setSearchText] = useState('');
    const filteredSongs = songsData.filter((song) =>
        song.songName.toLowerCase().includes(searchText.toLowerCase())
    );

    //-----------------------------
    return (
        <SafeAreaView style={styles.mainBg} >
            <ScrollView>
                <View style={styles.input}>
                    <Text style={{ color: 'rgb(208, 212, 255)', padding: 10, fontSize: 20, textAlign: 'center' }}>Ubushakiro</Text>
                    <TextInput
                        style={{ padding: 12, backgroundColor: 'black', color: 'rgb(208, 212, 255)' }}
                        placeholderTextColor="rgb(67, 71, 117)"
                        placeholder="Ubushakiro / Search For Song"
                        onChangeText={(text) => setSearchText(text)}
                        value={searchText}
                    />
                </View>
                {filteredSongs.map((song, index) => (

                    <Pressable key={song.id} style={[styles.musicBox, { padding: 3 }]} onPress={() => navigation.navigate('ViewSong', { song_id: song.id })}>
                        <Text style={styles.circle}>
                            {index + 1}
                        </Text>
                        <View style={styles.musicdetails}>
                            <Text numberOfLines={1} ellipsizeMode="tail" style={[styles.musictitle, styles.mainColor]}>{song.songName}</Text>
                            <Text numberOfLines={1} ellipsizeMode="tail" style={[styles.musicdesc, styles.mainColor]}>Writer: {song.songWrite}</Text>
                            <Pressable onPress={() =>  navigation.navigate('UpdateSongForm', { song_id: song.id })} style={[styles.btn, styles.green]}><Text style={{ color: 'white' }}>Hindura /Edit <FontAwesome name='edit' /></Text></Pressable>
                        </View>
                    </Pressable>

                ))}
            </ScrollView>
        </SafeAreaView>
    )
}
export default UpdateSong

const styles = StyleSheet.create({
    mainBg: {
        flex: 1,
        backgroundColor: 'black'
    },
    hide: {
        display: 'none'
    },
    circle: {
        backgroundColor: 'white',
        color: 'rgb(67, 71, 117)',
        width: 50,
        height: 50,
        borderRadius: 100,
        paddingTop: 10,
        fontSize: 20,
        textAlign: 'center',
        fontWeight: 'bold'
    },
    musictitle: {
        fontWeight: 'bold',
        color: 'white',
    },
    musicdesc: {
        fontSize: 12,
        color: 'white',
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
    musicdetails: {
        width: '80%',
        display: 'block',

    },
    btn: {
        fontSize: 10,
        padding: 3,
        width: 112,
        alignSelf: 'flex-end',
        borderRadius: 5
    },
    musicBox: {
        alignItems: 'center',
        flexDirection: 'row',
        gap: 3,
        marginTop: 20,
        padding: 4,
        borderRadius: 5,
        width: '100%',
        marginHorizontal: 'auto', // To horizontally center the element
        shadowColor: 'black',
        shadowOffset: { width: 2, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
        elevation: 5, // Android shadow
    },
    red: {
        backgroundColor: '#d64444',

    },
    blue: {
        backgroundColor: '#2f59a7',

    },
    green: {
        backgroundColor: 'rgb(52, 145, 57)',

    }

});