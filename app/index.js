import { useEffect, useState } from "react";
import { ActivityIndicator, View, SafeAreaView, Text, StyleSheet, Image} from "react-native";
import { useRootNavigationState, router, useNavigation } from "expo-router";
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { validity } from "../components/api";
import splashImage from "../assets/splashscreen.png";

const Main = () => {
    console.log("============SplashScreen=================")
    
    const [nextPage, setNextPage] = useState('login/');
    const [isLoading, setIsLoading] = useState(false);
    const [userSession, setUserSession] = useState(null); //remove 

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
        if (result) {
            setUserSession(JSON.parse(result))
            // console.log('Found Token: '+userSession.userData);

            // success: https://rentry.co/horg2r5p/raw
            // new success: https://rentry.co/9o3dxoqr/raw
            // failure: https://rentry.co/krwmtcf5/raw

            //check token validity
            setIsLoading(true);
            validity(
                'https://rentry.co/9o3dxoqr/raw',
                JSON.parse(result).sessionToken
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
            setNextPage('login/');
            router.replace('login')
        }
    }


    useEffect(() => {

        const timer = setTimeout(() => {
            retrieve('userSession');
            setIsLoading(true);
        }, 3000);

        // Clear the timeout if the component unmounts
        return () => clearTimeout(timer);
    }, []);

    return (<>
        <View style={{}}>
            <Image source={splashImage} style={styles.spsImage} />
            {!isLoading ? (<></>) : (
                <ActivityIndicator />
            )} 
        </View>
        </>
    );
}


const Home = () => {
    return (<>
            <View style={styles.spsContainer}>
                <Main/>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    spsContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
    },
    spsImage: {
        width: 300,
        height: 300,
        resizeMode: "cover",
    }
})

export default Home;