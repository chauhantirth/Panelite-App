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

            // success: https://rentry.co/horg2r5p/raw
            // new success: https://rentry.co/9o3dxoqr/raw
            // failure: https://rentry.co/krwmtcf5/raw

            try {
                setIsLoading(true);
                setNetworkError(null);
                const response = await fetch(
                    "http://127.0.0.1:5050/api/refresh", {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        }, 
                        body: JSON.stringify({
                            "data": {
                                "sessionToken": rs.sessionToken
                            }
                        })
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
                setIsLoading(false);
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
            // setIsLoading(true);
        }, 3000);

        // Clear the timeout if the component unmounts
        return () => clearTimeout(timer);
    }, []);

    return (<>
    <SafeAreaView>
        <View style={styles.container}>
            <View style={styles.subcontainer}>
                {/* <Image source={splashImage} style={styles.spsImage} /> */}
                <Text style={styles.label}>Panelite</Text>
            </View>
            {!isLoading ? (<></>) : (
                <View style={styles.subcontainer}>
                    <ActivityIndicator style={styles.activityLoader}/>
                </View>
                )} 
            {networkError ? (
                <View style={styles.subcontainer}>
                    <View style={styles.networkErrorBox}>
                        <Text style={styles.networkErrorText}>{networkError}
                        </Text>
                    </View>
                </View>
                ) : (<></>)}
        </View>
    </SafeAreaView>
        </>
    );
}


const styles = StyleSheet.create({
    networkErrorText: {
        textAlign: 'center',
        fontSize: 14,
        fontWeight: '300',
        color: 'red',
    },  
    networkErrorBox: {
        width: 'auto',
        marginTop: 40,
        marginHorizontal: 10,
        justifyContent: 'center',
        alignItems: 'center',
        height: 'auto'
    }, 
    spsImage: {
        width: 300,
        height: 300,
        resizeMode: "cover",
    },
    label: {
        color: 'black',
        fontSize: 72,
        fontWeight: '700',
        shadowColor: 'black',
        shadowOffset: {width: 0, height: 2},
        shadowRadius: 10,
        shadowOpacity: 0.15,
    },
    activityLoader: {
        position: 'relative'
    },
    subcontainer: {
        flexDirection: 'column',
        width: '100%',
        height: 'auto',
        borderRadius: 25,
        borderCurve: 'continuous', 
        marginBottom: 15,
        alignItems: "center",
    },
    container: {
        marginTop: 280,
        paddingHorizontal: 20, 
        paddingVertical: 10, 
        height: '100%'
    }
})

export default Main;