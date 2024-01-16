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
    getFirestore,onSnapshot,
    getDocs,
    query,
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

    const HomeAdmin = ({ navigation }) => {
        const [writen, setWriten] = useState(0);

        useEffect(() => {
          const songs = collection(db, 'Songs');
      
          const unsubscribe = onSnapshot(songs, (snapshot) => {
            setWriten(snapshot.size);
          });
      
          // To stop listening for changes (when you no longer need it)
          return () => unsubscribe();
        }, [db]);
      
    return (
        <SafeAreaView style={styles.mainBg} >
            <ScrollView>
                <View style={styles.mainSliderImg}>
                    <Text style={[styles.blue, { color: 'white', padding: 6, textAlign: 'center', fontSize: 16 }]}>Overview / ibyigenz</Text>
                    <View style={styles.gridView}>
                        <Pressable style={[styles.musicBox, { padding: 3 }]} onPress={() => Alert.alert("Indirimbo Zanditse")}>
                            <Text style={[styles.circle, { color: 'white' }, styles.blue]}>
                                <FontAwesome style={{ fontSize: 34 }} name="print" />
                            </Text>
                            <View key={1} style={styles.musicdetails}>
                                <Text numberOfLines={1} ellipsizeMode="tail" style={[styles.musictitle, styles.mainColor]}>{writen}</Text>
                                <Text numberOfLines={1} ellipsizeMode="tail" style={[styles.musicdesc, styles.mainColor]}>Indirimbo Zanditse</Text>
                            </View>
                        </Pressable>
                        <Pressable style={[styles.musicBox, { padding: 3 }]} onPress={() => navigation.navigate('ChangePass')}>
                            <Text style={[styles.circle, { color: 'white' }, styles.blue]}>
                                <FontAwesome style={{ fontSize: 34 }} name="key" />
                            </Text>
                            <View key={1} style={styles.musicdetails}>
                                <Text numberOfLines={1} ellipsizeMode="tail" style={[styles.musictitle, styles.mainColor]}>Change Password</Text>
                                <Text numberOfLines={1} ellipsizeMode="tail" style={[styles.musicdesc, styles.mainColor]}>Hindura Ijambo Banga</Text>
                            </View>
                        </Pressable>
                        <Pressable style={[styles.musicBox,styles.hide, { padding: 3 }]} onPress={() => navigation.navigate('Home')}>
                            <Text style={[styles.circle, { color: 'white' }, styles.blue]}>
                                <FontAwesome style={{ fontSize: 34 }} name="video-camera" />
                            </Text>
                            <View key={1} style={styles.musicdetails}>
                                <Text numberOfLines={1} ellipsizeMode="tail" style={[styles.musictitle, styles.mainColor]}>345</Text>
                                <Text numberOfLines={1} ellipsizeMode="tail" style={[styles.musicdesc, styles.mainColor]}>Indirimbo Za Video</Text>
                            </View>
                        </Pressable>
                        <Pressable style={[styles.musicBox,styles.hide, { padding: 3 }]} onPress={() => navigation.navigate('Home')}>
                            <Text style={[styles.circle, { color: 'white' }, styles.blue]}>
                                <FontAwesome style={{ fontSize: 34 }} name="music" />
                            </Text>
                            <View key={1} style={styles.musicdetails}>
                                <Text numberOfLines={1} ellipsizeMode="tail" style={[styles.musictitle, styles.mainColor]}>345</Text>
                                <Text numberOfLines={1} ellipsizeMode="tail" style={[styles.musicdesc, styles.mainColor]}>Indirimbo Za Audio</Text>
                            </View>
                        </Pressable>
                        <Pressable style={[styles.musicBox,styles.hide, { padding: 3 }]} onPress={() => navigation.navigate('Home')}>
                            <Text style={[styles.circle, { color: 'white' }, styles.blue]}>
                                <FontAwesome style={{ fontSize: 34 }} name="rocket" />
                            </Text>
                            <View key={1} style={styles.musicdetails}>
                                <Text numberOfLines={1} ellipsizeMode="tail" style={[styles.musictitle, styles.mainColor]}>3435</Text>
                                <Text numberOfLines={1} ellipsizeMode="tail" style={[styles.musicdesc, styles.mainColor]}>Indirimbo Zose</Text>
                            </View>
                        </Pressable>
                    </View>
                    <Text style={[styles.green, { color: 'white', padding: 6, textAlign: 'center', fontSize: 16 }]}>Add And View / Ongera unarebe indirimbo</Text>
                    <View style={styles.gridView}>
                        <Pressable style={[styles.musicBox, { padding: 3 }]} onPress={() => navigation.navigate('AddNewSong')}>
                            <Text style={[styles.circle, { color: 'white' }, styles.green]}>
                                <FontAwesome style={{ fontSize: 34 }} name="plus" />
                            </Text>
                            <View key={1} style={styles.musicdetails}>
                                <Text numberOfLines={1} ellipsizeMode="tail" style={[styles.musictitle, styles.mainColor]}>Add New Song</Text>
                                <Text numberOfLines={1} ellipsizeMode="tail" style={[styles.musicdesc, styles.mainColor]}>Ongera Indirimbo</Text>
                            </View>
                        </Pressable>

                        <Pressable style={[styles.musicBox, { padding: 3 }]} onPress={() => navigation.navigate('ViewNewSongAdmin')}>
                            <Text style={[styles.circle, { color: 'white' }, styles.green]}>
                                <FontAwesome style={{ fontSize: 34 }} name="gear" />
                            </Text>
                            <View key={1} style={styles.musicdetails}>
                                <Text numberOfLines={1} ellipsizeMode="tail" style={[styles.musictitle, styles.mainColor]}>View Songs</Text>
                                <Text numberOfLines={1} ellipsizeMode="tail" style={[styles.musicdesc, styles.mainColor]}>Reba Indirimbo</Text>
                            </View>
                        </Pressable>
                        <Pressable style={[styles.musicBox, { padding: 3 }]} onPress={() => navigation.navigate('UpdateSong')}>
                            <Text style={[styles.circle, { color: 'white' }, styles.green]}>
                                <FontAwesome style={{ fontSize: 34 }} name="edit" />
                            </Text>
                            <View key={1} style={styles.musicdetails}>
                                <Text numberOfLines={1} ellipsizeMode="tail" style={[styles.musictitle, styles.mainColor]}>Edit Songs</Text>
                                <Text numberOfLines={1} ellipsizeMode="tail" style={[styles.musicdesc, styles.mainColor]}>Hindura Indirimbo</Text>
                            </View>
                        </Pressable>
                    </View>
                    <Text style={[styles.red, { color: 'white', padding: 6, textAlign: 'center', fontSize: 16 }]}>Delete And Logout / Siba unasohoke</Text>
                    <View style={styles.gridView}>
                        <Pressable style={[styles.musicBox, { padding: 3 }]} onPress={() => navigation.navigate('DeleteSong')}>
                            <Text style={[styles.circle, { color: 'white' }, styles.red]}>
                                <FontAwesome style={{ fontSize: 34 }} name="trash" />
                            </Text>
                            <View key={1} style={styles.musicdetails}>
                                <Text numberOfLines={1} ellipsizeMode="tail" style={[styles.musictitle, styles.mainColor]}>Delete Songs</Text>
                                <Text numberOfLines={1} ellipsizeMode="tail" style={[styles.musicdesc, styles.mainColor]}>Siba Indirimbo</Text>
                            </View>
                        </Pressable>
                        <Pressable style={[styles.musicBox, { padding: 3 }]} onPress={() => navigation.navigate('Home')}>
                            <Text style={[styles.circle, { color: 'white' }, styles.red]}>
                                <FontAwesome style={{ fontSize: 34 }} name="sign-out" />
                            </Text>
                            <View key={1} style={styles.musicdetails}>
                                <Text numberOfLines={1} ellipsizeMode="tail" style={[styles.musictitle, styles.mainColor]}>Logout Now</Text>
                                <Text numberOfLines={1} ellipsizeMode="tail" style={[styles.musicdesc, styles.mainColor]}>Sohoka</Text>
                            </View>
                        </Pressable>
                    </View>
                    <Text style={[styles.blue, { color: 'white', padding: 6, textAlign: 'center', fontSize: 16 }]}>Add New Slides/ Ongera Slides </Text>
                    <View style={styles.gridView}>
                        <Pressable style={[styles.musicBox, { padding: 3 }]} onPress={() => navigation.navigate('UploadImage')}>
                            <Text style={[styles.circle, { color: 'white' }, styles.blue]}>
                                <FontAwesome style={{ fontSize: 34 }} name="plus" />
                            </Text>
                            <View key={1} style={styles.musicdetails}>
                                <Text numberOfLines={1} ellipsizeMode="tail" style={[styles.musictitle, styles.mainColor]}>Add Slide</Text>
                                <Text numberOfLines={1} ellipsizeMode="tail" style={[styles.musicdesc, styles.mainColor]}>Siba Slide</Text>
                            </View>
                        </Pressable>
                        <Pressable style={[styles.musicBox, { padding: 3 }]} onPress={() => navigation.navigate('DeleteImage')}>
                            <Text style={[styles.circle, { color: 'white' }, styles.red]}>
                                <FontAwesome style={{ fontSize: 34 }} name="trash" />
                            </Text>
                            <View key={1} style={styles.musicdetails}>
                                <Text numberOfLines={1} ellipsizeMode="tail" style={[styles.musictitle, styles.mainColor]}>Delete Slide</Text>
                                <Text numberOfLines={1} ellipsizeMode="tail" style={[styles.musicdesc, styles.mainColor]}>Siba Slide</Text>
                            </View>
                        </Pressable>
                    </View>

                </View>
            </ScrollView>
        </SafeAreaView>
    )
}
export default HomeAdmin

const styles = StyleSheet.create({
    mainBg: {
        flex: 1,
        backgroundColor: 'black'
    },
    hide:{
        display:'none'
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
        width: '69%',
        display: 'block',

    },
    musicBox: {
        alignItems: 'center',
        flexDirection: 'row',
        gap: 3,
        marginTop: 20,
        padding: 4,
        borderRadius: 5,
        width: '49%',
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