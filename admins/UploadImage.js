import React, { useEffect, useState, useRef } from 'react';
import { SafeAreaView, ScrollView, Text, TouchableOpacity, View, Image, Alert, StyleSheet } from 'react-native';
import {
    Button,
    DrawerLayoutAndroid,
    ActivityIndicator, TextInput
} from 'react-native';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import FontAwesome from '@expo/vector-icons/FontAwesome'
import {
    getDocs,
    updateDoc,addDoc,
    query,
    where,
} from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';

const firebaseConfig = {
    apiKey: "AIzaSyDLEq5Dzqh6LAoeKTJ7xb0pH5o5CBfJeVE",
    authDomain: "la-lumiere-choir.firebaseapp.com",
    projectId: "la-lumiere-choir",
    storageBucket: "la-lumiere-choir.appspot.com",
    messagingSenderId: "264115206395",
    appId: "1:264115206395:web:3734c97d9fbb47c553185e"
};

const UploadImage = () => {
    // Firebase initialization outside the component
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    const storage = getStorage();

    const slide = collection(db, 'slides');


    const [image, setImage] = useState(null);
    const [uploading, setUploading] = useState(false);
    // variables
    const [values, setValues] = useState({
        uname: '',
        pass: ''
    })
    const [error, setError] = useState({
        uname: '',
        pass: ''
    })

    const handleInputs = (key, value) => {
        const maxWordsForPass = 150; // Set the maximum number of words allowed for 'pass' input

        if (key === 'pass' && value.length > maxWordsForPass) {
            setError({
                uname: '',
                pass: 'Warengej umubare Wa magambo (inyuguti 150 characters)'
            });
          return; // Don't update state if the input key is 'pass' and the word limit exceeds
        }
        if (key === 'uname' && value.length > 73) {
            setError({
                uname: 'Warengej umubare Wa magambo (inyuguti 73 characters)',
                pass: ''
            });
          return; // Don't update state if the input key is 'pass' and the word limit exceeds
        }
      
        setValues((prevValues) => ({
          ...prevValues,
          [key]: value,
        }));
      };
    const [logData, setLogData] = useState(<Text>Emeza/Publish Changes <FontAwesome name="cloud-upload" style={[styles.bigicon, { color: 'white' }]} /></Text>);
    const [logData2, setLogData2] = useState(<Text>Hitamo Ifoto <FontAwesome name="camera" style={[styles.bigicon, { color: 'white' }]} /></Text>);


    const pickImage = async () => {
        setLogData2(<ActivityIndicator size="small" color="white" />)
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                console.log('Permission to access media library was denied');
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });

            console.log('Picker result:', result);
            if (!result.cancelled) {
                if (!result.cancelled && result.assets.length > 0 && result.assets[0].uri) {
                    const source = { uri: result.assets[0].uri };
                    console.log('Image source:', source);
                    setImage(source);
                    setLogData2(<Text>Hitamo Ifoto <FontAwesome name="camera" style={[styles.bigicon, { color: 'white' }]} /></Text>)
                } else if (result.cancelled) {
                    console.log('Image selection cancelled');
                    setLogData2(<Text>Hitamo Ifoto <FontAwesome name="camera" style={[styles.bigicon, { color: 'white' }]} /></Text>)
                } else {
                    console.log('Undefined or null URI');
                    setLogData2(<Text>Hitamo Ifoto <FontAwesome name="camera" style={[styles.bigicon, { color: 'white' }]} /></Text>)
                }
            }
        } catch (error) {
            console.error('Error picking image:', error);
            setLogData2(<Text>Hitamo Ifoto <FontAwesome name="camera" style={[styles.bigicon, { color: 'white' }]} /></Text>)
            // Handle any errors that occur during image picking
            // You might want to display an error message to the user
        }
    };

    function submit() {

        if (values.uname.trim() == "") {
            setError({
                uname: '!!! Izina jya Slide rirakenewe',
                pass: ''
            });
            unamerel.current.focus();
            setLogData(<Text>Emeza/Publish Changes <FontAwesome name="cloud-upload" style={[styles.bigicon, { color: 'white' }]} /></Text>)
        }
        else if (values.pass.trim() == "") {
            setError({
                uname: '',
                pass: '!!! Description (ubusobanuro bwa slide) burakenewe'
            });
            passrel.current.focus();
            setLogData(<Text>Emeza/Publish Changes <FontAwesome name="cloud-upload" style={[styles.bigicon, { color: 'white' }]} /></Text>)
        }
        else if (!image || !image.uri) {
            Alert.alert("Nafoto Wahisemo")
            setLogData(<Text>Emeza/Publish Changes <FontAwesome name="cloud-upload" style={[styles.bigicon, { color: 'white' }]} /></Text>)
        }
        else {
            setLogData(<ActivityIndicator size="small" color="white" />)
            UploadImage2()
        }
    }
    const UploadImage2 = async () => {
        setError({
            uname: '',
            pass: ''
        });
        if (!image || !image.uri) {
            console.log('No image selected');
            setLogData(<Text>Emeza/Publish Changes <FontAwesome name="cloud-upload" style={[styles.bigicon, { color: 'white' }]} /></Text>)
            return;
        }

        setUploading(true);

        try {
            const response = await fetch(image.uri);
            const blob = await response.blob();
            const filename = image.uri.substring(image.uri.lastIndexOf('/') + 1);
            const storageRef = ref(storage, filename);

            if (storageRef && blob) {
                const snapshot = await uploadBytes(storageRef, blob);

                try {
                    const downloadURL = await getDownloadURL(snapshot.ref);
                    console.log('File available at', downloadURL);
                    setUploading(false);
                    // add data to database
                    const dataToAdd = {
                        slideTitle: values.uname,
                        slideDesc: values.pass,
                        slideImage: filename,
                    };
                    addDoc(slide, dataToAdd)
                        .then((docRef) => {
                            setValues({
                                name: '',
                                pass: '',
                            })
                            setImage(null);
                            Alert.alert("Slide Yawe Yagiyemo Neza")
                            setLogData(<Text>Emeza/Publish   <FontAwesome name="cloud-upload" style={[styles.bigicon, { color: 'white' }]} /></Text>)
                        })
                        .catch((error) => {
                            Alert.alert(error)
                            setLogData(<Text>Emeza/Publish   <FontAwesome name="cloud-upload" style={[styles.bigicon, { color: 'white' }]} /></Text>)
                        });
                } catch (error) {
                    console.error('Error getting download URL:', error);
                    setUploading(false);
                    setLogData(<Text>Emeza/Publish Changes <FontAwesome name="cloud-upload" style={[styles.bigicon, { color: 'white' }]} /></Text>)
                    // Handle any errors while retrieving download URL
                    // You might want to display an error message to the user
                }
            } else {
                console.log('Invalid reference or blob');
                setUploading(false);
                setLogData(<Text>Emeza/Publish Changes <FontAwesome name="cloud-upload" style={[styles.bigicon, { color: 'white' }]} /></Text>)
                // Handle invalid reference or blob
                // You might want to display an error message to the user
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            setUploading(false);
            setLogData(<Text>Emeza/Publish Changes <FontAwesome name="cloud-upload" style={[styles.bigicon, { color: 'white' }]} /></Text>)
            // Handle any errors during image uploading
            // You might want to display an error message to the user
        }

    };

    const unamerel = useRef(null);
    const passrel = useRef(null);
    useEffect(() => {
        unamerel.current.focus();
    }, []);

    return (
        <SafeAreaView style={styles.mainBg}>
            <ScrollView>
                <View style={styles.form}>
                    <Text style={styles.title}>Injiza Slide Nshya</Text>
                    <TouchableOpacity onPress={pickImage} style={[styles.btn, { backgroundColor: '#3c6dc8' }]}>
                        <Text style={styles.textBtn}>{logData2}</Text>
                    </TouchableOpacity>
                    <View style={{ margin: 12 }}>
                        {image && <Image source={{ uri: image.uri }} style={{ width: 200, height: 200, }} />}
                    </View>
                    <Text style={styles.subtitle}>Izina Riranga Slide (Side Title) </Text>
                    <Text style={styles.error}>{error.uname}</Text>
                    <TextInput ref={unamerel} onChangeText={text => handleInputs('uname', text)} value={values.uname} placeholderTextColor="rgb(200, 212, 255)" style={styles.input} placeholder='Enter Title' />
                    <Text style={styles.subtitle}>Ubusobanuro Bwa Title (Description) </Text>
                    <Text style={styles.error}>{error.pass}</Text>
                    <TextInput multiline ref={passrel} onChangeText={text => handleInputs('pass', text)} value={values.pass} placeholderTextColor="rgb(200, 212, 255)" style={[styles.input, { height: 100 }]} placeholder='Enter Description' />
                    <TouchableOpacity onPress={() => submit()} style={[styles.btn, { backgroundColor: 'rgb(75, 155, 79)' }]}>
                        <Text style={styles.textBtn}>{logData}</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    mainBg: {
        flex: 1,
        padding: 12,
        backgroundColor: 'white'
    },
    mainBg: {
        flex: 1,
        padding: 12,
        backgroundColor: 'black'
    },
    error: {
        color: '#d64444',
        fontSize: 12
    },
    bigicon: {
        fontSize: 20,
        color: 'red'
    },
    form: {
        width: 'calc(100% - 22px)',
        borderWidth: 1,
        borderColor: 'rgb(67, 71, 117)',
        padding: 10,
        marginTop: 50,
        backgroundColor: 'rgb(67, 71, 117)',
        backgroundColor: 'rgb(8, 3, 18)',
        borderRadius: 5,
    },
    title: {
        fontSize: 26,
        textAlign: 'center',
        marginBottom: 17,
        color: 'rgb(208, 212, 255)',
        padding: 12,
        fontWeight: '900'
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'left',
        color: 'rgb(208, 212, 255)',
        fontWeight: '600'
    },
    input: {
        borderRadius: 5,
        borderWidth: 1,
        borderColor: 'rgb(67, 71, 117)',
        padding: 10,
        marginBottom: 20,
        marginTop: 10,
        backgroundColor: 'rgb(67, 71, 117)',
        color: 'rgb(20, 212, 255)', // This is for the entered text color
    },
    btn: {
        borderRadius: 5,
        padding: 12,
    },
    textBtn: {
        color: 'white',
        textAlign: 'center'
    }
});

export default UploadImage;
