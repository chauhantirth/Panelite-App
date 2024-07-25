import { View, Text, Alert, TouchableOpacity } from 'react-native';
import ColorList from '../../components/ColorList';
import AsyncStorage from "@react-native-async-storage/async-storage";
import logout from "../../components/api";
import { useState } from 'react';

const Profile = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    

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


    const handleLogout = async(key) => {
        console.log("Loggin Out...")
        const accessToken = await AsyncStorage.getItem(key)
        setIsLoading(true);

        logout(
            'https://rentry.co/ix87d4if/raw', accessToken
        ).then((data) => {
            setIsLoading(false);   
            if (data.success) {
                AsyncStorage.removeItem(key)
                setIsLoading(false);
                console.log("Successfully Logged Out");
                router.replace('login');
            } else {
                setIsLoading(false);
                console.log("Something went wrong.");
                setError(data.errorMsg);
            }
        }).catch(err => {
            setIsLoading(false);
            console.error(err);
            setError('Something went wrong.')
        });
    }


    return (
        <View>
            <TouchableOpacity onPress={() => {
                setError(null);
                Alert.alert("Logout", "Are you sure, you want to Logout ?", [
                    {
                        text: 'Cancel',
                        onPress: () => {},
                    },
                    {
                        text: 'Logout',
                        color: 'red',
                        onPress: () => {handleLogout('accessToken')},
                    }
                ])
            }}>
                <Text>Log Out</Text>
            </TouchableOpacity>
            <ColorList color="#0891b2"/>
        </View>
    )
}

export default Profile;