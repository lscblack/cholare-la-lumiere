import React, { useRef, useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Pressable, SafeAreaView, Image, RefreshControl, Alert, ScrollView, BackHandler } from 'react-native';
import Swiper from 'react-native-swiper';
import AdminView from './admins/Index'
import HomeAdmin from './admins/HomeAdmin'
import AddNewSong from './admins/AddNewSong'
import ViewNewSongAdmin from './admins/ViewNewSongAdmin';
import DeleteSong from './admins/DeleteSong';
import ChangePass from './admins/ChangePass';
import UpdateSong from './admins/UpdateSong';
import UpdateSongForm from './admins/UpdateSongForm';
import UploadImage from './admins/UploadImage';
import DeleteImage from './admins/DeleteImage';
import { useIsFocused } from '@react-navigation/native';
import {
  Button,
  DrawerLayoutAndroid,
  Text,
  StyleSheet,
  View, ActivityIndicator
} from 'react-native';
//-------include icons
import FontAwesome from '@expo/vector-icons/FontAwesome'
import ListView from './screens/ListView';
import ViewSong from './screens/ViewSong';
import { initializeApp } from 'firebase/app';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { SplashScreen } from 'expo';
import { useFocusEffect } from '@react-navigation/native';

//import OfflineData from './admins/OfflineData';
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
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

///// botom navigation

// top navigation
const App = () => {


  //--------------*********************************_________________________+++++++++++++++++++++++++++++++++++
  const [loading, setLoading] = useState(true);



  // ---------------- setup refresh
  const [refresh, setRefresh] = useState(false);

  const onRefresh = () => {
    setRefresh(true); // Set to true to trigger a re-render
    setLoading(true);
    // Perform any refresh-related tasks here if needed
    setTimeout(() => {
      setRefresh(false); // Set back to false after a certain delay
      setLoading(false);
    }, 1000); // Adjust the delay as needed
  };



  const handleExitApp = () => {
    Alert.alert(
      'Exit App/ Sohoka',
      'Are you sure you want to exit?/ urashak gufunga Programme',
      [
        {
          text: 'Cancel/Oya',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'OK/Yego',
          onPress: () => BackHandler.exitApp(),
        },
      ],
      { cancelable: false }
    );
  };

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
  // -------------------------------------************************* My Fuctions


  // ----------------------------- ads
  const [images, setImages] = useState([])
  useEffect(() => {
    const fetchData = async () => {
      try {
        const slidesCollection = collection(db, 'slides');
        const snapshot = await getDocs(slidesCollection);

        const slidesList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const fetchImages = async () => {
          const storage = getStorage();
          const imagesWithUrls = await Promise.all(
            slidesList.map(async (slide) => {
              try {
                const storageRef = ref(storage, slide.slideImage); // Assuming slideImage holds the image path
                const url = await getDownloadURL(storageRef);
                return {
                  id: slide.id,
                  name: url,
                  title: slide.slideTitle,
                  desc: slide.slideDesc,
                };
              } catch (error) {
                console.error('Error getting download URL:', error);
                return null;
              }
            })
          );
          setImages(imagesWithUrls.filter(Boolean));
        };

        fetchImages();
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();

    const unsubscribe = onSnapshot(collection(db, 'slides'), (snapshot) => {
      const updatedSlides = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const fetchUpdatedImages = async () => {
        const storage = getStorage();
        const updatedImagesWithUrls = await Promise.all(
          updatedSlides.map(async (slide) => {
            try {
              const storageRef = ref(storage, slide.slideImage); // Assuming slideImage holds the image path
              const url = await getDownloadURL(storageRef);
              return {
                id: slide.id,
                name: url,
                title: slide.slideTitle,
                desc: slide.slideDesc,
              };
            } catch (error) {
              console.error('Error getting download URL:', error);
              return null;
            }
          })
        );
        setImages(updatedImagesWithUrls.filter(Boolean));
      };

      fetchUpdatedImages();
    });

    return () => unsubscribe();
  }, [db]);
  // -------------------------- la luimiere Choir Ads
  const sortedSongsData = [...songsData].sort((a, b) => {
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
  const swiperRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (swiperRef.current) {
        const newIndex = (swiperRef.current.state.index + 1) % images.length;
        swiperRef.current.scrollBy(1, true);
      }
    }, 100000); // 100 seconds in milliseconds

    return () => clearInterval(interval);
  }, [images]);




  const drawer = useRef(false);
  const [drawerPosition, setDrawerPosition] = useState('left');

  const HomeScreen = ({ navigation, route }) => {
    const { reload } = route.params || {};
    const isFocused = useIsFocused();
    // -------------------------------------************************* End Of My Fuctions
    React.useEffect(() => {
      // Check if the 'reload' parameter is true and the screen is focused
      if (reload && isFocused) {
        setRefresh(true); // Set to true to trigger a re-render
        setLoading(true);
        // Perform any refresh-related tasks here if needed
        setTimeout(() => {
          setRefresh(false); // Set back to false after a certain delay
          setLoading(false);
        }, 10); // Adjust the delay as needed
        navigation.setParams({ reload: false });
      }
    }, [reload, isFocused]);
    return (
      <DrawerLayoutAndroid
        ref={drawer}
        drawerWidth={300}
        drawerPosition={drawerPosition}
        drawerBackgroundColor="rgb(8, 3, 18)"
        renderNavigationView={() => navigationView({ navigation })}
      >
        <SafeAreaView style={styles.mainBg} >
          <ScrollView refreshControl={
            <RefreshControl onRefresh={onRefresh} />
          }>
            <View style={styles.mainSliderImg}>
              <Button onPress={() => drawer.current.openDrawer()} title='Urakaze Neza' />
              <Swiper
                ref={swiperRef}
                loop={true}
                autoplay={true}
                showsPagination={true}
                style={styles.wrapper}
              >
                {images.map((image, index) => (
                  <View key={image.id} style={styles.slide}>
                    <Image source={{ uri: image.name }} style={styles.image} />

                    <Text style={styles.text}>
                      <Text numberOfLines={1} ellipsizeMode="tail" style={styles.slidetitle}>
                        {image.title}
                      </Text>
                      {'\n'}
                      <Text style={styles.slidedesc}>{image.desc}</Text>
                    </Text>
                  </View>
                ))}
              </Swiper>
            </View>

            <View style={{ padding: 14 }}>
              <Text style={[styles.mainIcons, { textAlign: 'center', marginBottom: 20 }]}>Ahabanza <FontAwesome name='home' style={styles.mainIcons} /></Text>
              <Text style={[styles.mainIcons, { textAlign: 'left', fontSize: 13 }]}>Indirimbo Zanditse (Za Vuba)   <FontAwesome name='book' style={[styles.mainIcons, { fontSize: 13 }]} /></Text>
              <View style={styles.gridView}>
                {

                  // Mapping through the sorted songsData to display
                  sortedSongsData.map((song, index) => (
                    <Pressable key={song.id} style={[styles.musicBox, { padding: 3 }]} onPress={() => navigation.navigate('ViewSong', { song_id: song.id })}>
                      <Text style={styles.circle}>
                        {index + 1}
                      </Text>
                      <View style={styles.musicdetails}>
                        <Text numberOfLines={1} ellipsizeMode="tail" style={[styles.musictitle, styles.mainColor]}>{song.songName}</Text>
                        <Text numberOfLines={1} ellipsizeMode="tail" style={[styles.musicdesc, styles.mainColor]}>Writer: {song.songWrite}</Text>
                        <Text style={{ textAlign: 'right', width: '100%', fontWeight: '900', fontSize: 10, color: 'rgb(67, 71, 117)' }}>{song.SongDate}</Text>
                      </View>
                    </Pressable>
                  ))}
              </View>
              <Text style={[styles.mainIcons, styles.hiden, { textAlign: 'left', fontSize: 13 }]}>Indirimbo Za Audio (Za Vuba)  <FontAwesome name='music' style={[styles.mainIcons, { fontSize: 13 }]} /></Text>
              <View style={[styles.gridView, styles.hiden]}>

                {songsData.reverse().map((song, index) => {
                  return (
                    <Pressable key={song.id} style={[styles.musicBox, { padding: 3 }]} onPress={() => navigation.navigate('ViewSong', { song_id: song.id })}>
                      <Text style={styles.circle}>
                        {songsData.length - index + 1 - 1}
                      </Text>
                      <View style={styles.musicdetails}>
                        <Text numberOfLines={1} ellipsizeMode="tail" style={[styles.musictitle, styles.mainColor]}>{song.songName}</Text>
                        <Text numberOfLines={1} ellipsizeMode="tail" style={[styles.musicdesc, styles.mainColor]}>Writer: {song.songWrite}</Text>
                        <Text style={{ textAlign: 'right', width: '100%', fontWeight: '900', fontSize: 10, color: 'rgb(67, 71, 117)' }}>{song.SongDate}</Text>
                      </View>
                    </Pressable>
                  );
                })}
              </View>
              <Text style={[styles.mainIcons, styles.hiden, { textAlign: 'left', fontSize: 13 }]}>Indirimbo Za Video (Za Vuba)   <FontAwesome name='video-camera' style={[styles.mainIcons, { fontSize: 13 }]} /></Text>
              <View style={[styles.gridView, styles.hiden]}>

                {songsData.map((song, index) => {
                  return (
                    <Pressable key={song.id} style={[styles.musicBox, { padding: 3 }]} onPress={() => navigation.navigate('ViewSong', { song_id: song.id })}>
                      <Text style={styles.circle}>
                        {index + 1}
                      </Text>
                      <View style={styles.musicdetails}>
                        <Text numberOfLines={1} ellipsizeMode="tail" style={[styles.musictitle, styles.mainColor]}>{song.songName}</Text>
                        <Text numberOfLines={1} ellipsizeMode="tail" style={[styles.musicdesc, styles.mainColor]}>Writer: {song.songWrite}</Text>
                        <Text style={{ textAlign: 'right', width: '100%', fontWeight: '900', fontSize: 10, color: 'rgb(67, 71, 117)' }}>{song.SongDate}</Text>
                      </View>
                    </Pressable>
                  );
                })}

              </View>
            </View>
          </ScrollView>

        </SafeAreaView>
      </DrawerLayoutAndroid>
    );
  };

  //   ------------------------ Side Bar

  const navigationView = ({ navigation }) => (
    <View style={[styles.navigationContainer]}>
      <Pressable style={styles.menuCloseNav} onPress={() => drawer.current.closeDrawer()}>
        <Text style={{ textAlign: 'right' }}>
          {/* <FontAwesome name='times' style={[styles.menuIcon, styles.Textred]} /> */}
        </Text>
      </Pressable>
      <Text style={{ textAlign: 'center', fontSize: 26, color: 'rgb(208, 212, 255)', fontWeight: 'bold' }}>Menu</Text>
      <View style={styles.mainMenu}>
        <Pressable style={[styles.mainNavLi]} onPress={() => navigation.navigate('Home')} >
          <Text style={{ textAlign: 'left', fontSize: 16 }}>
            <Text>
              <FontAwesome style={styles.mainIcons} name='home' />
            </Text>
            <Text style={styles.mainText}>    Ahabanza</Text>
          </Text>
        </Pressable>
        <Pressable style={[styles.mainNavLi]} onPress={() => navigation.navigate('Indirimbo')} >
          <Text style={{ textAlign: 'left', fontSize: 16 }}>
            <Text>
              <FontAwesome style={styles.mainIcons} name='book' />
            </Text>
            <Text style={styles.mainText}>    Indirimbo Zanditse</Text>
          </Text>
        </Pressable>
        <Pressable style={[styles.mainNavLi,]} onPress={() =>Alert.alert("Indirimbo Za Audio","Ziraza Vuba")} >
          <Text style={{ textAlign: 'left', fontSize: 16 }}>
            <Text>
              <FontAwesome style={styles.mainIcons} name='music' />
            </Text>
            <Text style={styles.mainText}>    Indirimbo Za Audio</Text>
          </Text>
        </Pressable>
        <Pressable style={[styles.mainNavLi]} onPress={() =>Alert.alert("Indirimbo Za Video","Ziraza Vuba")} >
          <Text style={{ textAlign: 'left', fontSize: 16 }}>
            <Text>
              <FontAwesome style={styles.mainIcons} name='video-camera' />
            </Text>
            <Text style={styles.mainText}>    Indirimbo Za Video</Text>
          </Text>
        </Pressable>
        <Pressable style={[styles.mainNavLi, styles.hiden]}  >
          <Text style={{ textAlign: 'left', fontSize: 16 }}>
            <Text>
              <FontAwesome style={styles.mainIcons} name='comments' />
            </Text>
            <Text style={styles.mainText}>    Siga Ubutumwa/Icyifuzo</Text>
          </Text>
        </Pressable>
        <Pressable style={[styles.mainNavLi, styles.hiden]}  >
          <Text style={{ textAlign: 'left', fontSize: 16 }}>
            <Text>
              <FontAwesome style={styles.mainIcons} name='heart' />
            </Text>
            <Text style={styles.mainText}>    Dukurikire</Text>
          </Text>
        </Pressable>
        <Pressable style={[styles.mainNavLi,]} onPress={() => navigation.navigate('Admins')} >
          <Text style={{ textAlign: 'left', fontSize: 16 }}>
            <Text>
              <FontAwesome style={styles.mainIcons} name='gear' />
            </Text>
            <Text style={styles.mainText}>    Admins</Text>
          </Text>
        </Pressable>
        <Pressable style={[styles.mainNavLi]} onPress={handleExitApp} >
          <Text style={{ textAlign: 'left', fontSize: 16 }}>
            <Text>
              <FontAwesome style={styles.mainIcons} name='sign-out' />
            </Text>
            <Text style={styles.mainText}>    Sohoka </Text>
          </Text>
        </Pressable>
      </View>
    </View>
  );


  useEffect(() => {
    const loadScreen = setTimeout(() => {
      setLoading(false);
    }, 6000);

    return () => clearTimeout(loadScreen);
  }, []);

  return loading ? (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'black' }}>
      <Image source={require('./assets/icon3.png')} />
      <Text style={[styles.musictitle, { textAlign: 'center', fontSize: 22 }]}>Cholare La Lumiere</Text>
      <Text style={{ color: 'white' }}><ActivityIndicator size="large" color="white" /></Text>
    </View>
  ) : (
    //---------------------------Nav Bar
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName='Home'
        screenOptions={{
          headerStyle: {
            backgroundColor: 'rgb(8, 3, 18)',
          },
          tabBarStyle: {
            backgroundColor: 'rgb(8, 3, 18)',
            display:'none',
            
          },
          headerTintColor: 'rgb(208, 212, 255)',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 24,
          },
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={({ navigation }) => ({
            title: 'Cholare La Lumiere',
            tabBarLabel: 'Ahabanza',
            display: 'none',
            tabBarIcon: ({ color, size }) => (
              <FontAwesome name="home" color={color} size={size} /> // Replace 'home' with your icon name
            ),
            headerLeft: () => (
              <Pressable onPress={() => { drawer.current.openDrawer() }}>
                <Text style={{ marginRight: 70, color: 'rgb(208, 212, 255)' }}>
                  <FontAwesome name="bars" style={styles.mainIcons} />
                </Text>
              </Pressable>
            ),
          })}
        />
        <Tab.Screen
          name="Indirimbo"
          component={ListView}
          options={({ navigation }) => ({
            tabBarLabel: 'Indirimbo',
            title: 'Cholare La lumiere',
            tabBarIcon: ({ color, size }) => (
              <FontAwesome name="music" color={color} size={size} /> // Replace 'home' with your icon name
            ),
            headerLeft: () => (
              <Pressable onPress={() => { navigation.navigate('Home', { reload: true }) }}>
                <Text style={{ marginRight: 80, color: 'rgb(208, 212, 255)' }}>
                  <FontAwesome name="angle-left" style={styles.mainIcons} />
                </Text>
              </Pressable>
            ),
          })}
        />
        <Tab.Screen
          name="Admins"
          component={AdminView}
          options={({ navigation }) => ({
            tabBarLabel: 'Admins',
            title: 'La lumiere Admins',
            tabBarIcon: ({ color, size }) => (
              <FontAwesome name="user-circle" color={color} size={size} /> // Replace 'home' with your icon name
            ),
            headerLeft: () => (
              <Pressable onPress={() => { navigation.navigate('Home', { reload: true }) }}>
                <Text style={{ marginRight: 80, color: 'rgb(208, 212, 255)' }}>
                  <FontAwesome name="angle-left" style={styles.mainIcons} />
                </Text>
              </Pressable>
            ),
          })}
        />
        <Tab.Screen
          name="ViewSong"
          component={ViewSong}
          options={({ navigation }) => ({
            title: 'Cholare La lumiere',
            tabBarIcon: ({ focused, color, size }) => null, // Hide the tab icon
            tabBarLabel: () => null, // Hide the tab label
            tabBarButton: () => null,
            headerLeft: () => (
              <Pressable onPress={() => { navigation.navigate('Home', { reload: true }) }}>
                <Text style={{ marginRight: 80, color: 'rgb(208, 212, 255)' }}>
                  <FontAwesome name="angle-left" style={styles.mainIcons} />
                </Text>
              </Pressable>
            ),
          })}
        />
        <Tab.Screen
          name="HomeAdmin"
          component={HomeAdmin}
          options={({ navigation }) => ({
            title: 'La lumiere Admins',
            tabBarIcon: ({ focused, color, size }) => null, // Hide the tab icon
            tabBarLabel: () => null, // Hide the tab label
            tabBarButton: () => null,
            headerLeft: () => (
              <Pressable onPress={() => { navigation.navigate('Home', { reload: true }) }}>
                <Text style={{ marginRight: 80, color: 'rgb(208, 212, 255)' }}>
                  <FontAwesome name="angle-left" style={styles.mainIcons} />
                </Text>
              </Pressable>
            ),
          })}
        />
        <Tab.Screen
          name="AddNewSong"
          component={AddNewSong}
          options={({ navigation }) => ({
            title: 'La lumiere Admins',
            tabBarIcon: ({ focused, color, size }) => null, // Hide the tab icon
            tabBarLabel: () => null, // Hide the tab label
            tabBarButton: () => null,
            headerLeft: () => (
              <Pressable onPress={() => { navigation.navigate('HomeAdmin') }}>
                <Text style={{ marginRight: 80, color: 'rgb(208, 212, 255)' }}>
                  <FontAwesome name="angle-left" style={styles.mainIcons} />
                </Text>
              </Pressable>
            ),
          })}
        />
        <Tab.Screen
          name="ViewNewSongAdmin"
          component={ViewNewSongAdmin}
          options={({ navigation }) => ({
            title: 'La lumiere Admins',
            tabBarIcon: ({ focused, color, size }) => null, // Hide the tab icon
            tabBarLabel: () => null, // Hide the tab label
            tabBarButton: () => null,
            headerLeft: () => (
              <Pressable onPress={() => { navigation.navigate('HomeAdmin') }}>
                <Text style={{ marginRight: 80, color: 'rgb(208, 212, 255)' }}>
                  <FontAwesome name="angle-left" style={styles.mainIcons} />
                </Text>
              </Pressable>
            ),
          })}
        />
        <Tab.Screen
          name="DeleteSong"
          component={DeleteSong}
          options={({ navigation }) => ({
            title: 'La lumiere Admins',
            tabBarIcon: ({ focused, color, size }) => null, // Hide the tab icon
            tabBarLabel: () => null, // Hide the tab label
            tabBarButton: () => null,
            headerLeft: () => (
              <Pressable onPress={() => { navigation.navigate('HomeAdmin') }}>
                <Text style={{ marginRight: 80, color: 'rgb(208, 212, 255)' }}>
                  <FontAwesome name="angle-left" style={styles.mainIcons} />
                </Text>
              </Pressable>
            ),
          })}
        />
        <Tab.Screen
          name="ChangePass"
          component={ChangePass}
          options={({ navigation }) => ({
            title: 'La lumiere Admins',
            tabBarIcon: ({ focused, color, size }) => null, // Hide the tab icon
            tabBarLabel: () => null, // Hide the tab label
            tabBarButton: () => null,
            headerLeft: () => (
              <Pressable onPress={() => { navigation.navigate('HomeAdmin') }}>
                <Text style={{ marginRight: 80, color: 'rgb(208, 212, 255)' }}>
                  <FontAwesome name="angle-left" style={styles.mainIcons} />
                </Text>
              </Pressable>
            ),
          })}
        />
        <Tab.Screen
          name="UpdateSong"
          component={UpdateSong}
          options={({ navigation }) => ({
            title: 'La lumiere Admins',
            tabBarIcon: ({ focused, color, size }) => null, // Hide the tab icon
            tabBarLabel: () => null, // Hide the tab label
            tabBarButton: () => null,
            headerLeft: () => (
              <Pressable onPress={() => { navigation.navigate('HomeAdmin') }}>
                <Text style={{ marginRight: 80, color: 'rgb(208, 212, 255)' }}>
                  <FontAwesome name="angle-left" style={styles.mainIcons} />
                </Text>
              </Pressable>
            ),
          })}
        />
        <Tab.Screen
          name="UpdateSongForm"
          component={UpdateSongForm}
          options={({ navigation }) => ({
            title: 'La lumiere Admins',
            tabBarIcon: ({ focused, color, size }) => null, // Hide the tab icon
            tabBarLabel: () => null, // Hide the tab label
            tabBarButton: () => null,
            headerLeft: () => (
              <Pressable onPress={() => { navigation.navigate('HomeAdmin') }}>
                <Text style={{ marginRight: 80, color: 'rgb(208, 212, 255)' }}>
                  <FontAwesome name="angle-left" style={styles.mainIcons} />
                </Text>
              </Pressable>
            ),
          })}
        />
        <Tab.Screen
          name="UploadImage"
          component={UploadImage}
          options={({ navigation }) => ({
            title: 'La lumiere Admins',
            tabBarIcon: ({ focused, color, size }) => null, // Hide the tab icon
            tabBarLabel: () => null, // Hide the tab label
            tabBarButton: () => null,
            headerLeft: () => (
              <Pressable onPress={() => { navigation.navigate('HomeAdmin') }}>
                <Text style={{ marginRight: 80, color: 'rgb(208, 212, 255)' }}>
                  <FontAwesome name="angle-left" style={styles.mainIcons} />
                </Text>
              </Pressable>
            ),
          })}
        />
        <Tab.Screen
          name="DeleteImage"
          component={DeleteImage}
          options={({ navigation }) => ({
            title: 'La lumiere Admins',
            tabBarIcon: ({ focused, color, size }) => null, // Hide the tab icon
            tabBarLabel: () => null, // Hide the tab label
            tabBarButton: () => null,
            headerLeft: () => (
              <Pressable onPress={() => { navigation.navigate('HomeAdmin') }}>
                <Text style={{ marginRight: 80, color: 'rgb(208, 212, 255)' }}>
                  <FontAwesome name="angle-left" style={styles.mainIcons} />
                </Text>
              </Pressable>
            ),
          })}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};



const styles = StyleSheet.create({
  mainBg: {
    flex: 1,
    backgroundColor: 'black'
  },
  hiden: {
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
    width: '69%',
    display: 'block',

  },
  musicBox: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 3,
    marginTop: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
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
  //-----------End of Music
  mainSliderImg: {
    width: '100%',
    height: 280,
  },

  wrapper: {},
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 280,
    position: 'relative',
    borderRadius: 5,
  },
  mainColor: {
    color: 'rgb(208, 212, 255)',

  },
  text: {
    color: 'white',
    position: 'absolute',
    height: '100%',
    paddingTop: 50,
    width: '100%',
    textAlign: 'center',
    backgroundColor: 'rgba(0, 0, 255, 0.3)'
  },
  slidedesc: {
    fontSize: 16,
    padding: 12,
  },
  slidetitle: {
    padding: 12,
    fontWeight: 'bold',
    fontSize: 26,
  },
  mainMenu: {
    padding: 12,
    color: 'rgb(89, 94, 149)',
  },
  mainIcons: {
    flexDirection: 'row',
    color: 'rgb(208, 212, 255)',
    fontSize: 26,
  },
  mainText: {
    color: 'rgb(208, 212, 255)',
    marginHorizontal: 'auto'
  },
  mainNavLi: {
    display: 'flex',
    padding: 8,
    textDecorationLine: 'none',
    marginVertical: 4,
    marginHorizontal: 'auto',
    fontSize: 16,
    borderRadius: 5,

  },
  menuCloseNav: {
    padding: 5,
    textAlign: 'right',
  },
  menuIcon: {
    fontSize: 30,
  },
  Textred: {
    fontSize: 30,
    color: 'rgb(236, 59, 59)',
  },
});

export default App;