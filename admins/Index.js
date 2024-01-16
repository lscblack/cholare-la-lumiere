import React, { useEffect, useState, useRef } from 'react';
import {
    Button,
    DrawerLayoutAndroid,
    Text,
    StyleSheet,ActivityIndicator,
    View, TextInput
} from 'react-native';
import { Pressable, SafeAreaView, TouchableOpacity, Image, Animated, Alert, ScrollView } from 'react-native';
import { initializeApp } from 'firebase/app';
import FontAwesome from '@expo/vector-icons/FontAwesome'
import {
    collection,
    getFirestore,
    getDocs,
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

const AdminView = ({ navigation }) => {
    const [logData, setLogData] = useState(<Text>Emeza/Login <FontAwesome name="sign-in" style={[styles.bigicon, { color: 'white' }]} /></Text>);
    const [admin, setAdmin] = useState([]);
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
        setValues(prevValues => ({
            ...prevValues,
            [key]: value
        }));
    };

    // Initialize Firebase and Firestore
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    const admins = collection(db, 'admins');

    function adminsLogin(phone, pass) {

        const q = query(
            admins,
            where('adminPhone', '==', phone),
            where('adminPassword', '==', pass)
        );

        getDocs(q)
            .then((snapshot) => {
                const adminData = [];
                snapshot.docs.forEach((doc) => {
                    adminData.push({ ...doc.data(), id: doc.id });
                });
                if (adminData.length > 0) {
                    // Alert.alert("Login Okay")
                    navigation.navigate('HomeAdmin')
                    setLogData(<Text>Emeza/Login <FontAwesome name="sign-in" style={[styles.bigicon, { color: 'white' }]} /></Text>)
                } else {
                    setLogData(<Text>Emeza/Login <FontAwesome name="sign-in" style={[styles.bigicon, { color: 'white' }]} /></Text>)
                    Alert.alert("Phone And Password Dont Match", "Nimero ni jambo banga Nabwo Bihura")
                }
            })
            .catch((error) => {
                console.error('Error getting documents: ', error);
            });

    }

    const unamerel = useRef(null);
    const passrel = useRef(null);
    // forma submit
    const submitHandel = () => {
        if (values.uname.trim() == "") {
            setError({
                uname: '!!! Nimero Ya Telephone Irakenewe',
                pass: ''
            });
            unamerel.current.focus();
            setLogData(<Text>Emeza/Login <FontAwesome name="sign-in" style={[styles.bigicon, { color: 'white' }]} /></Text>)
        } else if (values.pass.trim() == "") {
            setError({
                uname: '',
                pass: '!!! Passowrd (Ijambo Banga) Irakenewe'
            });
            passrel.current.focus();
            setLogData(<Text>Emeza/Login <FontAwesome name="sign-in" style={[styles.bigicon, { color: 'white' }]} /></Text>)
        } else {
            setError({
                uname: '',
                pass: ''
            });
            setLogData(<ActivityIndicator size="small" color="white" />)
            adminsLogin(values.uname, values.pass)
        }
    }


    useEffect(() => {
        unamerel.current.focus();
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
                    <Text style={styles.title}>Injiza Imyirondoro Yawe</Text>
                    <Text style={styles.subtitle}>Injiza Nimero ya Telephone (Phone Number) <FontAwesome style={styles.bigicon} name="phone" /></Text>
                    <Text style={styles.error}>{error.uname}</Text>
                    <TextInput ref={unamerel} onChangeText={text => handleInputs('uname', text)} value={values.uname} placeholderTextColor="rgb(200, 212, 255)" style={styles.input} placeholder='Injiza Nimero Ya Telephone Yawe' />
                    <Text style={styles.subtitle}>Injiza Ijambo Banga (Password) <FontAwesome style={styles.bigicon} name="key" /></Text>
                    <Text style={styles.error}>{error.pass}</Text>
                    <TextInput ref={passrel} onChangeText={text => handleInputs('pass', text)} value={values.pass} placeholderTextColor="rgb(200, 212, 255)" style={styles.input} placeholder='Injiza Ijambo Banga Ryawe' />
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

export default AdminView;
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