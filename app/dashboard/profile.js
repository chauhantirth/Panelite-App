import { View, SafeAreaView, Text, Alert, TouchableOpacity } from 'react-native';
import ColorList from '../../components/ColorList';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from 'expo-router';
import { logout } from "../../components/api";
import { useState, useEffect } from 'react';

const Profile = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [userSession, setUserSession] = useState(null);
    // success: https://rentry.co/9bqubcgh/raw
    
    const handleLogout = async(key) => {
        setIsLoading(true);
        try {
            logout(
                'https://rentry.co/9bqubcgh/raw',
                userSession
            ).then((data) => {
                if (data.status == "success") {
                    setIsLoading(false)
                    AsyncStorage.removeItem(key)
                    console.log("Successfully Logged Out.")
                    router.replace('login')
                } else {
                    setIsLoading(false);
                    console.log("Logout Failure.")
                    setError(data.errorMsg)
                }
            }).catch( err => {
                console.error(err)
                setIsLoading(false)
                setError("Something went wrong.")
            });
        } catch (e) {
            setIsLoading(false)
            setError("Something went wrong, check your internet connection and try again.")
            console.log(e)
        }
    }


    const retrieve = async(key) => {
        const userSession = await AsyncStorage.getItem(key);
        setUserSession(userSession);
    }

    useEffect(() => {
        retrieve('userSession');
    }, [])

    // useEffect(() => {
    //     console.log("Triggered.")
    //     handleLogout(accessToken);
    // }, [triggerLogout])

    // const deleteToken = async(key) => {
    //     const accessToken = await AsyncStorage.getItem(key)
    //     setIsLoading(true);

    //     logout(
    //         'https://rentry.co/ix87d4if/raw', accessToken
    //     ).then((data) => {
    //         setIsLoading(false);   
    //         if (data.success) {
    //             AsyncStorage.removeItem(key)
    //             setIsLoading(false);
    //             console.log("Successfully Logged Out");
    //             router.replace('login');
    //         } else {
    //             setIsLoading(false);
    //             console.log("Something went wrong.");
    //             setError(data.errorMsg);
    //         }
    //     }).catch(err => {
    //         setIsLoading(false);
    //         console.error(err);
    //         setError('Something went wrong.')
    //     });
    // }


    return (
        <SafeAreaView>
            <TouchableOpacity onPress={() => {
                setError(null);
                Alert.alert("Logout", "Are you sure, you want to Logout ?", [
                    {
                        text: 'Cancel',
                        onPress: () => {},
                    },
                    {
                        text: 'Logout',
                        onPress: () => {handleLogout('userSession')},
                    }
                ]);
            }}>
            <Text>Log Out</Text>
            </TouchableOpacity>
            <ColorList color="#0891b2"/>
        </SafeAreaView>
    )
}

export default Profile;