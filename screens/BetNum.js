import React, { useRef, useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Pressable, SafeAreaView, TouchableOpacity, Image, Animated, Alert, ScrollView } from 'react-native';
import Swiper from 'react-native-swiper';
import Songs from './screens/Songs'
import {
  Button,
  DrawerLayoutAndroid,
  Text,
  StyleSheet,
  View,
} from 'react-native';
//-------include icons
import FontAwesome from '@expo/vector-icons/FontAwesome'

const App = () => {
  const Stack = createNativeStackNavigator();
  // -------------------------------------************************* My Fuctions
  const images = [

    {
      name: require('./assets/choir2.png'),
      title: 'Chorale La Luimere Mugiterane',
      desc: 'Turabashimiye mwese mukunda kand mudusengera imana ibane namwe iyi ni app wasangah indirimbo za choir la luimire'
    },
    {
      name: require('./assets/choir3.png'),
      title: 'Umunsi Wu Munezero',
      desc: 'Turabashimiye mwese mukunda kand mudusengera imana ibane namwe iyi ni app wasangah indirimbo za choir la luimire'
    },
    {
      name: require('./assets/choir4.png'),
      title: 'Solute Mu Gatenga',
      desc: 'Turabashimiye mwese mukunda kand mudusengera imana ibane namwe iyi ni app wasangah indirimbo za choir la luimire'
    },
    {
      name: require('./assets/choir5.png'),
      title: 'Night Of Praise And Worship',
      desc: 'Turabashimiye mwese mukunda kand mudusengera imana ibane namwe iyi ni app wasangah indirimbo za choir la luimire'
    },
    {
      name: require('./assets/choir6.png'),
      title: 'Repition Yo Kuwa Gatandatu',
      desc: 'Turabashimiye mwese mukunda kand mudusengera imana ibane namwe iyi ni app wasangah indirimbo za choir la luimire'
    },
    {
      name: require('./assets/choir7.png'),
      title: 'Ijoro Ryo Gutitiriza',
      desc: 'Turabashimiye mwese mukunda kand mudusengera imana ibane namwe iyi ni app wasangah indirimbo za choir la luimire'
    },
  ];

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

  // --------------------------- got page
  const mainClick = (togo) => {
    Alert.alert("ukanze kuri", togo)
  }
  // -------------------------------------************************* End Of My Fuctions


  const drawer = useRef(null);
  const [drawerPosition, setDrawerPosition] = useState('left');
  const changeDrawerPosition = () => {
    if (drawerPosition === 'left') {
      setDrawerPosition('right');
    } else {
      setDrawerPosition('left');
    }
  };
  const HomeScreen = ({ navigation }) => {

    return (
      <DrawerLayoutAndroid
  ref={drawer}
  drawerWidth={300}
  drawerPosition={drawerPosition}
  drawerBackgroundColor="rgb(8, 3, 18)"
  renderNavigationView={() => navigationView({ navigation })}
>
        <SafeAreaView style={styles.mainBg} >
          <ScrollView>
            <View style={styles.mainSliderImg}>
              <Swiper
                ref={swiperRef}
                loop={true}
                autoplay={true}
                showsPagination={true}
                style={styles.wrapper}
              >
                {images.map((image, index) => (
                  <View key={index} style={styles.slide}>
                    <Image source={image.name} style={styles.image} />
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
              <Text style={[styles.mainIcons, { textAlign: 'left', fontSize: 13 }]}>Indirimbo Nshya <FontAwesome name='music' style={[styles.mainIcons, { fontSize: 13 }]} /></Text>
              <View style={styles.gridView}>
                {Songs.map((song, index) => {
                  return (
                    <View style={[styles.musicBox, { padding: 3 }]}>
                      <Image style={{ width: 50, height: 50 }} source={require('./assets/img1.png')} />
                      <View key={index} style={styles.musicdetails}>
                        <Text numberOfLines={1} ellipsizeMode="tail" style={[styles.musictitle, styles.mainColor]}>{song.name}</Text>
                        <Text numberOfLines={1} ellipsizeMode="tail" style={[styles.musicdesc, styles.mainColor]}>By {song.author}</Text>
                        <Text style={{ textAlign: 'right', width: '100%', fontWeight: '900', fontSize: 10, color: 'rgb(67, 71, 117)' }}>{song.date}</Text>
                      </View>
                    </View>
                  );
                })}
              </View>
              <Text style={[styles.mainIcons, { textAlign: 'left', fontSize: 13 }]}>Indirimbo Zo Kuramya <FontAwesome name='music' style={[styles.mainIcons, { fontSize: 13 }]} /></Text>
              <View style={styles.gridView}>

                {Songs.map((song, index) => {
                  return (
                    <View style={[styles.musicBox, { padding: 3, }]}>
                      <Image style={{ width: 50, height: 50 }} source={require('./assets/img3.png')} />
                      <View key={index} style={styles.musicdetails}>
                        <Text numberOfLines={1} ellipsizeMode="tail" style={[styles.musictitle, styles.mainColor]}>{song.name}</Text>
                        <Text numberOfLines={1} ellipsizeMode="tail" style={[styles.musicdesc, styles.mainColor]}>By {song.author}</Text>
                        <Text style={{ textAlign: 'right', width: '100%', fontWeight: '900', fontSize: 10, color: 'rgb(67, 71, 117)' }}>{song.date}</Text>
                      </View>
                    </View>
                  );
                })}

              </View>
              <Text style={[styles.mainIcons, { textAlign: 'left', fontSize: 13 }]}>Indirimbo Zo Guhimbaza <FontAwesome name='music' style={[styles.mainIcons, { fontSize: 13 }]} /></Text>
              <View style={styles.gridView}>

                {Songs.map((song, index) => {
                  return (
                    <View style={[styles.musicBox, { padding: 3, }]}>
                      <Image style={{ width: 50, height: 50 }} source={require('./assets/img.png')} />
                      <View key={index} style={styles.musicdetails}>
                        <Text numberOfLines={1} ellipsizeMode="tail" style={[styles.musictitle, styles.mainColor]}>{song.name}</Text>
                        <Text numberOfLines={1} ellipsizeMode="tail" style={[styles.musicdesc, styles.mainColor]}>By {song.author}</Text>
                        <Text style={{ textAlign: 'right', width: '100%', fontWeight: '900', fontSize: 10, color: 'rgb(67, 71, 117)' }}>{song.date}</Text>
                      </View>
                    </View>
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
  const ProfileScreen = ({ navigation }) => {
    return (
      <View>
        <Text>hello</Text>
        {/* Your ProfileScreen content here */}
      </View>
    );
  };
  const navigationView = (navigation) => (
    <View style={[styles.navigationContainer]}>
      <Button
        title="Go to Jane's profile"
        onPress={() =>
          navigation.navigate('Indirimbo', { name: 'Jane' })
        }
      />
      <Pressable style={styles.menuCloseNav} onPress={() => drawer.current.closeDrawer()}>
        <Text style={{ textAlign: 'right' }}>
          {/* <FontAwesome name='times' style={[styles.menuIcon, styles.Textred]} /> */}
        </Text>
      </Pressable>
      <Text style={{ textAlign: 'center', fontSize: 26, color: 'rgb(208, 212, 255)', fontWeight: 'bold' }}>Menu</Text>
      <View style={styles.mainMenu}>
        <Pressable style={[styles.mainNavLi]} onPress={() => mainClick('home')} >
          <Text style={{ textAlign: 'left', fontSize: 16 }}>
            <Text>
              <FontAwesome style={styles.mainIcons} name='home' />
            </Text>
            <Text style={styles.mainText}>    Ahabanza</Text>
          </Text>
        </Pressable>
        <Pressable style={[styles.mainNavLi]} onPress={() => mainClick('lyrics')} >
          <Text style={{ textAlign: 'left', fontSize: 16 }}>
            <Text>
              <FontAwesome style={styles.mainIcons} name='book' />
            </Text>
            <Text style={styles.mainText}>    Indirimbo Zanditse</Text>
          </Text>
        </Pressable>
        <Pressable style={[styles.mainNavLi]} onPress={() => mainClick('audio')} >
          <Text style={{ textAlign: 'left', fontSize: 16 }}>
            <Text>
              <FontAwesome style={styles.mainIcons} name='music' />
            </Text>
            <Text style={styles.mainText}>    Indirimbo Za Audio</Text>
          </Text>
        </Pressable>
        <Pressable style={[styles.mainNavLi]} onPress={() => mainClick('Video')} >
          <Text style={{ textAlign: 'left', fontSize: 16 }}>
            <Text>
              <FontAwesome style={styles.mainIcons} name='video-camera' />
            </Text>
            <Text style={styles.mainText}>    Indirimbo Za Video</Text>
          </Text>
        </Pressable>
        <Pressable style={[styles.mainNavLi]} onPress={() => mainClick('feedback')} >
          <Text style={{ textAlign: 'left', fontSize: 16 }}>
            <Text>
              <FontAwesome style={styles.mainIcons} name='comments' />
            </Text>
            <Text style={styles.mainText}>    Siga Ubutumwa/Icyifuzo</Text>
          </Text>
        </Pressable>
        <Pressable style={[styles.mainNavLi]} onPress={() => mainClick('follow')} >
          <Text style={{ textAlign: 'left', fontSize: 16 }}>
            <Text>
              <FontAwesome style={styles.mainIcons} name='heart' />
            </Text>
            <Text style={styles.mainText}>    Dukurikire</Text>
          </Text>
        </Pressable>
        <Pressable style={[styles.mainNavLi]} onPress={() => mainClick('setting')} >
          <Text style={{ textAlign: 'left', fontSize: 16 }}>
            <Text>
              <FontAwesome style={styles.mainIcons} name='gear' />
            </Text>
            <Text style={styles.mainText}>    Settings</Text>
          </Text>
        </Pressable>
        <Pressable style={[styles.mainNavLi]} onPress={() => mainClick('exit')} >
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

  return (
    //---------------------------Nav Bar
    <NavigationContainer>
      <Stack.Navigator screenOptions={{
        headerStyle: {
          backgroundColor: 'rgb(8, 3, 18)',
        },
        headerTintColor: 'rgb(208, 212, 255)',
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 24,
        }
      }}>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            title: 'Cholare La Lumiere',
            headerLeft: () => (
              <Pressable onPress={() => drawer.current.openDrawer()}>
                <Text style={{ marginRight: 70, color: 'rgb(208, 212, 255)' }}>
                  <FontAwesome name='bars' style={styles.menuIcon} />
                </Text>
              </Pressable>
            ),
          }}

        />
        <Stack.Screen
          name="Indirimbo"
          component={ProfileScreen}
          options={({ navigation }) => ({
            title: 'Indirimbo',
            headerLeft: () => (
              <Pressable onPress={() => navigation.navigate('Home')}>
                <Text style={{ marginRight: 70, color: 'rgb(208, 212, 255)' }}>
                  <FontAwesome name='arrow-left' style={styles.menuIcon} />
                </Text>
              </Pressable>
            ),
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  mainBg: {
    flex: 1,
    backgroundColor: 'black'
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
    height: 250,
  },

  wrapper: {},
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 250,
    position: 'relative',
    borderRadius: 5,
  },
  mainColor: {
    color: 'rgb(208, 212, 255)',
    backgroundColor: 'none',
  },
  text: {
    color: 'white',
    position: 'absolute',
    height: '100%',
    paddingTop: 60,
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
  }
});

export default App;