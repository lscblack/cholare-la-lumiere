import React, { useRef, useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Pressable, SafeAreaView, TouchableOpacity, Image, Animated, Alert, ScrollView, TextInput } from 'react-native';
import {
  Button,
  DrawerLayoutAndroid,
  Text,
  StyleSheet,
  View,
} from 'react-native';
import Songs from './Songs'
import { initializeApp } from 'firebase/app';
import {
  collection,
  getFirestore, onSnapshot,
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
const ListView = ({ navigation }) => {
  //----------------------------**************************Firebase Data Fetching 
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
  //----------------------------**************************End Firebase Data Fetching

  // Search functionality
  const [searchText, setSearchText] = useState('');

  // Filtering songs based on the search text in songName or song
  const filteredSongs = songsData.filter((song) =>
    song.songName.toLowerCase().includes(searchText.toLowerCase()) ||
    song.song.toLowerCase().includes(searchText.toLowerCase())
  );

  // Sorting the filtered songs alphabetically by song name
  const sortedSongsData = [...filteredSongs].sort((a, b) => {
    const songA = a.songName.toLowerCase();
    const songB = b.songName.toLowerCase();

    if (songA < songB) {
      return -1;
    }
    if (songA > songB) {
      return 1;
    }
    return 0;
  });
  //-----------------------------
  return (
    <SafeAreaView style={styles.mainBg}>
      <ScrollView>
        <Button style={[styles.musictitle2, { textAlign: 'center', fontWeight: 'bold' }]} title='Indirimbo Zanditse' />
        <View style={styles.input}>
          <Text style={{ color: 'rgb(208, 212, 255)', padding: 10, fontSize: 20, textAlign: 'center' }}>Ubushakiro</Text>
          <TextInput
            style={{ padding: 12, backgroundColor: 'black', color: 'rgb(208, 212, 255)' }}
            placeholderTextColor="rgb(67, 71, 117)"
            placeholder="Ubushakir / Search For Song"
            onChangeText={(text) => setSearchText(text)}
            value={searchText}
          />
        </View>
        {sortedSongsData.map((song, index) => {
          return (
            <Pressable key={song.id} style={[styles.musicBox, { padding: 3 }]} onPress={() => navigation.navigate('ViewSong', { song_id: song.id })}>
              <Text style={styles.circle}>
                {index + 1}
              </Text>
              <View style={styles.musicdetails}>
                <Text numberOfLines={1} ellipsizeMode="tail" style={[styles.musictitle, styles.mainColor]}>{song.songName}</Text>
                <Text numberOfLines={1} ellipsizeMode="tail" style={[styles.musicdesc, styles.mainColor]}>Writer {song.songWrite}</Text>
                <Text style={{ textAlign: 'right', width: '100%', fontWeight: '900', fontSize: 10, color: 'rgb(67, 71, 117)' }}>{song.SongDate}</Text>
              </View>
            </Pressable>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ListView
const styles = StyleSheet.create({
  mainBg: {
    flex: 1,
    backgroundColor: 'black'
  },
  input: {
    backgroundColor: 'black'
  },
  circle: {
    backgroundColor: 'white',
    color: 'rgb(67, 71, 117)',
    width: 47,
    height: 47,
    borderRadius: 100,
    paddingTop: 10,
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'bold'
  },
  musictitle2: {
    fontWeight: 'bold',
    color: 'rgb(208, 212, 255)',
    fontSize: 20,
    textAlign: 'center',
    color: 'rgb(208, 212, 255)',
  },
  musictitle: {
    fontWeight: 'bold',
    color: 'rgb(208, 212, 255)',
  },
  musicdesc: {
    fontSize: 12,
    color: 'rgb(208, 212, 255)',
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
    width: '83%',
    display: 'block',

  },
  musicBox: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 3,
    marginTop: 20,
    backgroundColor: 'black',
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
  //-----------End of Music
  mainSliderImg: {
    width: '100%',
    height: 250,
  },

});