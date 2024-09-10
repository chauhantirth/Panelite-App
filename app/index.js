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
    const [networkError, setNetworkError] = useState(null);


    // const navigation = useNavigation();
    //const rootNavigationState = useRootNavigationState();

    const retrieve = async (key) => {
        const result = await AsyncStorage.getItem(key)
        if (result) {
            const rs = JSON.parse(result)

            try {
                setIsLoading(true);
                setNetworkError(null);
                const response = await fetch(
                    "https://rentry.co/9o3dxoqr/raw", {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        }, 
                        // body: JSON.stringify({
                        //     "session-token": rs.sessionToken,
                        // })
                });
                setIsLoading(false);
        
                if (!response.ok) {
                    setNetworkError('Something went wrong, please try again later.')
                    // throw new Error('Failed to push data to Database.');
                    return;
                }
        
                const resData = await response.json();
                if (resData) {
                    if (resData.status === "success") {
                        console.log("Valid Token, Go to Dashboard.");
                        setNextPage('/dashboard')
                        router.replace('dashboard')
                    } else {
                        console.log("Token Invalid, move to login.");
                        setNextPage('login/');
                        router.replace('login')
                    }
                } else {
                    setNetworkError('An Error occured parsing the server response, Try again later.')
                }
            } catch (e) {
                setPredLoading(false)
                setNetworkError("Something went wrong, check your internet connection and try again.")
                console.log(e)
            }

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
            {networkError ? (
                <View style={styles.networkErrorBox}>
                    <Text style={styles.networkErrorText}>{networkError}
                    </Text>
                </View>
            ) : (<></>)}
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