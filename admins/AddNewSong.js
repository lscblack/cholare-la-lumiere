import React, { useEffect, useState, useRef } from 'react';
import {
    Button,
    DrawerLayoutAndroid,
    Text,
    StyleSheet, ActivityIndicator,
    View, TextInput
} from 'react-native';
import { Pressable, SafeAreaView, TouchableOpacity, Image, Animated, Alert, ScrollView } from 'react-native';
import { initializeApp } from 'firebase/app';
import FontAwesome from '@expo/vector-icons/FontAwesome'
import {
    collection,
    getFirestore,
    getDocs,
    addDoc,
    query,
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

const AddNewSong = ({ navigation }) => {
    const [logData, setLogData] = useState(<Text>Emeza/Save   <FontAwesome name="save" style={[styles.bigicon, { color: 'white' }]} /></Text>);
    const [admin, setAdmin] = useState([]);
    // variables
    const [values, setValues] = useState({
        name: '',
        author: '',
        date: '',
        song: '',
        key: '',
    })
    const [error, setError] = useState({
        name: '',
        author: '',
        date: '',
        song: '',
        key: '',
    })

    const handleInputs = (key, value) => {
        setValues(prevValues => ({
            ...prevValues,
            [key]: value
        }));
    };

    // Initialize Firebase and Firestore
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    const admins = collection(db, 'admins');
    const songs = collection(db, 'Songs');

    function addSong(title, writer, date, song, key) {
        const dataToAdd = {
            songName: title,
            songWrite: writer,
            SongDate: date,
            song: song,
            songKey: key,
        };
        addDoc(songs, dataToAdd)
            .then((docRef) => {
                setValues({
                    name: '',
                    author: '',
                    date: '',
                    song: '',
                    key: '',
                })
                Alert.alert("Indirimbo Yawe Yagiyemo Neza")
                setLogData(<Text>Emeza/Save   <FontAwesome name="save" style={[styles.bigicon, { color: 'white' }]} /></Text>)
            })
            .catch((error) => {
                Alert.alert(error)
                setLogData(<Text>Emeza/Save   <FontAwesome name="save" style={[styles.bigicon, { color: 'white' }]} /></Text>)
            });

    }

    const namerel = useRef(null);
    const authorrel = useRef(null);
    const daterel = useRef(null);
    const songrel = useRef(null);
    const keyrel = useRef(null);
    // forma submit
    const submitHandel = () => {
        if (values.name.trim() == "") {
            setError({
                name: 'Izina Ryi ndirimbo rirakenewe',
                author: '',
                date: '',
                song: '',
                key: '',
            });
            namerel.current.focus();
            setLogData(<Text>Emeza/Save   <FontAwesome name="save" style={[styles.bigicon, { color: 'white' }]} /></Text>)
        }
        else if (values.author.trim() == "") {
            setError({
                name: '',
                author: 'uwanditse indirimbo arakenewe cg ushirimo Unkown',
                date: '',
                song: '',
                key: '',
            });
            authorrel.current.focus();
            setLogData(<Text>Emeza/Save   <FontAwesome name="save" style={[styles.bigicon, { color: 'white' }]} /></Text>)
        }
        else if (values.date.trim() == "") {
            setError({
                name: '',
                author: '',
                date: 'Italiki irakenewe cg ushirimo Unkown',
                song: '',
                key: '',
            });
            daterel.current.focus();
            setLogData(<Text>Emeza/Save   <FontAwesome name="save" style={[styles.bigicon, { color: 'white' }]} /></Text>)
        }
        else if (values.song.trim() == "") {
            setError({
                name: '',
                author: '',
                date: '',
                song: 'Indirimbo irakenewe',
                key: '',
            });
            songrel.current.focus();
            setLogData(<Text>Emeza/Save   <FontAwesome name="save" style={[styles.bigicon, { color: 'white' }]} /></Text>)
        }
        else if (values.key.trim() == "") {
            setError({
                name: '',
                author: '',
                date: '',
                song: '',
                key: 'note yinditimbo irakenewe cg Any',
            });
            songrel.current.focus();
            setLogData(<Text>Emeza/Save   <FontAwesome name="save" style={[styles.bigicon, { color: 'white' }]} /></Text>)
        }
        else {
            setError({
                name: '',
                author: '',
                date: '',
                song: '',
                key: '',
            });
            setLogData(<ActivityIndicator size="small" color="white" />)
            addSong(values.name, values.author, values.date, values.song,values.key)
        }
    }


    useEffect(() => {
        namerel.current.focus();
    }, []);
    const [btnColor, setBtnColor] = useState('#2f59a7');

    const handlePressIn = () => {
        // Change button color when pressed
        setBtnColor('#3869c3');
        setLogData(<ActivityIndicator size="small" color="white" />)
    };

    const handlePressOut = () => {
        // Change button color back to default when released
        setBtnColor('#2f59a7');
    };
    return (
        <SafeAreaView style={styles.mainBg} >
            <ScrollView>
                <View style={styles.form}>
                    <Text style={styles.title}>Injiza Indirimbo Nshya</Text>

                    <Text style={styles.subtitle}>Izina Ryi Ndirimbo (Song Name) <FontAwesome style={styles.bigicon} name="user-circle" /></Text>
                    <Text style={styles.error}>{error.name}</Text>
                    <TextInput ref={namerel} onChangeText={text => handleInputs('name', text)} value={values.name} placeholderTextColor="rgb(200, 212, 255)" style={styles.input} placeholder='Injiza Izina Jyi Ndirimbo' />

                    <Text style={styles.subtitle}>Uwanditse Indirimbo (Song Writer) <FontAwesome style={styles.bigicon} name="user" /></Text>
                    <Text style={styles.error}>{error.author}</Text>
                    <TextInput ref={authorrel} onChangeText={text => handleInputs('author', text)}
                        value={values.author} placeholderTextColor="rgb(200, 212, 255)" style={styles.input} placeholder='Uwanditse Indirimbo (Song Writer)' />

                    <Text style={styles.subtitle}>Italiki yanditse Ho (Date) <FontAwesome style={styles.bigicon} name="calendar" /></Text>
                    <Text style={styles.error}>{error.date}</Text>
                    <TextInput ref={daterel} onChangeText={text => handleInputs('date', text)} value={values.date} placeholderTextColor="rgb(200, 212, 255)" style={styles.input} placeholder='Enter Registration Date Ex: 12.20.2023' />

                    <Text style={styles.subtitle}>Ibitero Byi Ndirimbo (write full song here) <FontAwesome style={styles.bigicon} name="print" /></Text>
                    <Text style={styles.error}>{error.song}</Text>
                    <TextInput multiline ref={songrel} onChangeText={text => handleInputs('song', text)} value={values.song} placeholderTextColor="rgb(200, 212, 255)" style={[styles.input, { minHeight: 100, maxHeight: 500, }]} placeholder='Copy Paste full Song Here' />

                    <Text style={styles.subtitle}>Note yindirimbo (Key) <FontAwesome style={styles.bigicon} name="music" /></Text>
                    <Text style={styles.error}>{error.key}</Text>
                    <TextInput ref={keyrel} onChangeText={text => handleInputs('key', text)} value={values.key} placeholderTextColor="rgb(200, 212, 255)" style={styles.input} placeholder='Enter Song Key Ex: F# or Do#' />

                    <TouchableOpacity style={[styles.btn, { backgroundColor: btnColor }]}
                        onPressIn={handlePressIn}
                        onPressOut={handlePressOut} onPress={() => submitHandel()}>
                        <Text style={styles.textBtn}>{logData}</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default AddNewSong;
const styles = StyleSheet.create({
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