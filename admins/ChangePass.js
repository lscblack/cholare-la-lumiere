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
    updateDoc,
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

const ChangePass = ({ navigation }) => {
    const [logData, setLogData] = useState(<Text>Emeza/Save Changes <FontAwesome name="gear" style={[styles.bigicon, { color: 'white' }]} /></Text>);
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
        // Define the collection and create a query based on a condition
        const myCollection = collection(db, 'admins');
        const q = query(myCollection, where('adminPhone', '==', phone));

        // Get the documents that match the query
        getDocs(q)
        .then((querySnapshot) => {
          if (!querySnapshot.empty) {
            querySnapshot.forEach((doc) => {
              const docRef = doc.ref; // Access the reference using doc.ref
      
              // Update the document with new data
              const newData = {
                adminPassword: pass,
                // Add other fields you want to update
              };
      
              // Update the document
              updateDoc(docRef, newData)
                .then(() => {
                  Alert.alert('ijambo banga Ryahindutse Neza',`successfully Changed Your Password!`);
                  navigation.navigate('Admins')
                  setLogData(<Text>Emeza/Save Changes <FontAwesome name="gear" style={[styles.bigicon, { color: 'white' }]} /></Text>)
                })
                .catch((error) => {
                  Alert.alert(`Ijambo Banga Nabwo RyaHindutse`, error);
                  setLogData(<Text>Emeza/Save Changes <FontAwesome name="gear" style={[styles.bigicon, { color: 'white' }]} /></Text>)
                });
            });
          } else {
            Alert.alert('Nimero Ushizemo nabwo iri muri system yacyu','your number is not found on our system');
            setLogData(<Text>Emeza/Save Changes <FontAwesome name="gear" style={[styles.bigicon, { color: 'white' }]} /></Text>)
          }
        })
        .catch((error) => {
          Alert.alert('Error fetching Data:', error);
          setLogData(<Text>Emeza/Save Changes <FontAwesome name="gear" style={[styles.bigicon, { color: 'white' }]} /></Text>)
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
            setLogData(<Text>Emeza/Save Changes <FontAwesome name="gear" style={[styles.bigicon, { color: 'white' }]} /></Text>)
        } else if (values.pass.trim() == "") {
            setError({
                uname: '',
                pass: '!!! Passowrd (Ijambo Banga) Irakenewe'
            });
            passrel.current.focus();
            setLogData(<Text>Emeza/Save Changes <FontAwesome name="gear" style={[styles.bigicon, { color: 'white' }]} /></Text>)
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
    const [btnColor, setBtnColor] = useState('#d64444');

    const handlePressIn = () => {
        // Change button color when pressed
        setBtnColor('#3869c3');
        setLogData(<ActivityIndicator size="small" color="white" />)
    };

    const handlePressOut = () => {
        // Change button color back to default when released
        setBtnColor('#d64444');
    };
    return (
        <SafeAreaView style={styles.mainBg} >
            <ScrollView>
                <View style={styles.form}>
                    <Text style={styles.title}>Hindura Ijambo Banga</Text>
                    <Text style={styles.subtitle}>Nimero ukoresha (Phone Number) <FontAwesome style={styles.bigicon} name="phone" /></Text>
                    <Text style={styles.error}>{error.uname}</Text>
                    <TextInput ref={unamerel} onChangeText={text => handleInputs('uname', text)} value={values.uname} placeholderTextColor="rgb(200, 212, 255)" style={styles.input} placeholder='Injiza Nimero Ya Telephone Yawe' />
                    <Text style={styles.subtitle}>Ijambo Banga rishya (New Password) <FontAwesome style={styles.bigicon} name="key" /></Text>
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

export default ChangePass;
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