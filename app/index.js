import { useEffect, useState } from "react";
import { ActivityIndicator, View, SafeAreaView, Text } from "react-native";
import { useRootNavigationState, router, useNavigation } from "expo-router";
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { validity } from "../components/api";

const Main = () => {
    console.log("=====================================")
    const [initLoad, setInitLoad] = useState(true);
    const [nextPage, setNextPage] = useState('login/');

    const [isLoading, setIsLoading] = useState(false);

    const [accessToken, setAccessToken] = useState(null);
    // const navigation = useNavigation();
    //const rootNavigationState = useRootNavigationState();

    const save = async(key, value) => {
        setAccessToken(value);
        AsyncStorage.setItem(key, value);
    }

    const deleteToken = async(key) => {
        setAccessToken(null);
        AsyncStorage.removeItem(key)
    }

    const retrieve = async (key) => {
        const result = await AsyncStorage.getItem(key)
        // console.log(result)

        if (result) {
            console.log('Found Token: '+result);

            // success: https://rentry.co/horg2r5p/raw
            // failure: https://rentry.co/krwmtcf5/raw

            //check token validity
            setIsLoading(true);
            validity(
                'https://rentry.co/horg2r5p/raw',
                accessToken
            ).then((data) => {
                setIsLoading(false);
                // console.log(data)
                if (data.status == 'failure') {
                    console.log("Token Invalid, move to login.");
                    setNextPage('login/');
                    router.replace('login')
                } else {
                    console.log("Valid Token, Go to Dashboard.");
                    setNextPage('/dashboard');
                    router.replace('dashboard')
                }
            })

        } else {
            console.log("Not Found, move to login");
            // save('accessToken', 'thisIsTheAccessToken');
            setNextPage('login/');
            router.replace('login')
        }
    }


    useEffect(() => {

        const timer = setTimeout(() => {
            setInitLoad(false);
            retrieve('accessToken');
        }, 3000);

        //Checking for cached Auth Token...
        // deleteToken('accessToken')

        // Clear the timeout if the component unmounts
        return () => clearTimeout(timer);
    }, []);

    if (initLoad) {
        return (<>
            <Text>
                Panelite.
            </Text>
            {!isLoading ? (<></>) : (
                <ActivityIndicator />
            )} 
            </>
        );

    }

    return (
        <Text>Done</Text>
    );
}


const Home = () => {
    return (
        <View>
            <Main/>
        </View>
    )
}

export default Home;