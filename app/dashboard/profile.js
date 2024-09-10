import { View, SafeAreaView, Text, Alert, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
// import ColorList from '../../components/ColorList';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from 'expo-router';
import { logout } from "../../components/api";
import { useState, useEffect } from 'react';
import loaderImage from '../../assets/fade-stagger-circles.png'

const Profile = () => {

    const [userSessionData, setUserSessionData] = useState({});
    const [sessionToken, setSessionToken] = useState({});

    const [logoutLoading, setLogoutLoading] = useState(false);
    const [networkError, setNetworkError] = useState(null);
    
    // success: https://rentry.co/9bqubcgh/raw
    // failure: https://rentry.co/3pwr53xd/raw
    
    const handleLogout = async(key) => {
        setLogoutLoading(true);
        setNetworkError(null);

        try {
            const response = await fetch(
                "http://127.0.0.1:5050/api/logout", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    }, 
                    body: JSON.stringify({
                        "data": {
                            "sessionToken": sessionToken,
                        }
                    })
            });
            setLogoutLoading(false);
    
            if (!response.ok) {
                setNetworkError('Something went wrong, please try again later.')
                // throw new Error('Failed to push data to Database.');
                return;
            }
    
            const resData = await response.json();
            if (resData) {
                if (resData.status === "success") {
                    AsyncStorage.removeItem(key)
                    console.log("Successfully Logged Out.")
                    router.replace('login')
                } else {
                    console.log("Logout Failure.")
                    setNetworkError(resData.errorMsg)
                }
            } else {
                setNetworkError('An Error occured parsing the server response, Try again later.')
            }
        } catch (e) {
            setLogoutLoading(false)
            setNetworkError("Something went wrong, check your internet connection and try again.")
            console.log(e)
        }
    }


    const retrieve = async(key) => {
        const result = await AsyncStorage.getItem(key);
        if(result) {
            const rs = JSON.parse(result)
            setUserSessionData(JSON.parse(atob(rs.userData)));
            setSessionToken(rs.sessionToken)
        }
    }

    useEffect(() => {
        retrieve('userSession');
    }, [])

    return (
        <SafeAreaView>
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.subcontainer}>
                    <View style={styles.scTwoMain}>
                        <View style={styles.scTwoLeft}>
                            <Text style={styles.scTwoHeading}>
                                Profile Settings
                            </Text>
                        </View>
                    </View>
                    <View
                        style={styles.scSeparatingLine}
                    />

                    <View style={styles.scTwoBottom} >
                        <Text style={styles.scTwoHeading2}>Email</Text>
                        {userSessionData ? (
                            <Text style={[styles.scTwoHeadingVal2]}>
                                {userSessionData.userEmail}
                            </Text>
                        ) : (<></>)}
                    </View>
                    <View
                        style={styles.scSeparatingLine}
                    />

                    <View style={styles.scTwoBottom} >
                        <Text style={styles.scTwoHeading2}>Contact Number</Text>
                        {userSessionData ? (
                            <Text style={[styles.scTwoHeadingVal2]}>
                                {userSessionData.userMobile}
                            </Text>
                        ) : (<></>)}
                    </View>
                    <View
                        style={styles.scSeparatingLine}
                    />

                    <View style={styles.scTwoBottom} >
                        <Text style={styles.scTwoHeading2}>App Version</Text>
                        {userSessionData ? (
                            <Text style={[styles.scTwoHeadingVal2]}>
                                1.08.68
                            </Text>
                        ) : (<></>)}
                    </View>

                    {logoutLoading ? (
                        <View style={styles.scThreeButtonContainerDisable}>
                            <TouchableOpacity 
                            disabled={logoutLoading}
                            style={styles.scThreeButton}
                        >
                            <Image source={loaderImage} style={styles.scThreeCalenderImg} />
                        </TouchableOpacity>
                    </View>
                    ) : (
                        <View style={styles.scThreeButtonContainer}>
                            <TouchableOpacity onPress={() => {
                                setNetworkError(null);
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
                                }}
                                style={styles.scThreeButton}
                            >
                                <Text style={styles.scThreeButtonText}>Log Out</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>

                {networkError ? (
                    <View style={styles.networkErrorBox}>
                        <Text style={styles.networkErrorText}>{networkError}
                        </Text>
                    </View>
                ) : (<></>)}
            </ScrollView>
        </SafeAreaView>
    )
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
        marginHorizontal: 10,
        justifyContent: 'center',
        alignItems: 'center',
        height: 'auto'
    },  
    scThreeButtonText: {
        fontSize: 18,
        fontWeight: '600',
        marginVertical: 8,
        color: 'black'
    },
    scThreeButton: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    scThreeButtonContainer: {
        marginHorizontal: 20,
        marginVertical: 2,
        width: 'auto',
        height: 40,
        borderRadius: 45,
        borderCurve: 'continuous', 
        marginBottom: 15,
        backgroundColor: '#0891b2', 
        shadowColor: 'black',
        shadowOffset: {width: 0, height: 0},
        shadowRadius: 10,
        shadowOpacity: 0.2      
    },
    scThreeCalenderImg: {
        marginTop: 8,
        width: 24,
        height: 24,
        resizeMode: "cover",
        marginBottom: 8,
    },
    scThreeButtonContainerDisable: {
        marginHorizontal: 20,
        marginVertical: 2,
        width: 'auto',
        height: 40,
        borderRadius: 45,
        borderCurve: 'continuous', 
        marginBottom: 15,
        backgroundColor: '#737373', 
        shadowColor: 'black',
        shadowOffset: {width: 0, height: 0},
        shadowRadius: 10,
        shadowOpacity: 0.2      
    },
    scSeparatingLine: {
        borderBottomColor: 'black',
        borderBottomWidth: StyleSheet.hairlineWidth,
        marginHorizontal: 25
    },
    scTwoHeading2: {
        fontSize: 14,
        fontWeight: '300'
    },
    scTwoHeadingVal2: {
        fontSize: 16,
        fontWeight: '500'
    },
    scTwoBottom: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 14,
        marginHorizontal: 25
    },
    scTwoHeading: {
        fontSize: 28,
        fontWeight: '700',
    },
    scTwoLeft: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 14,
        marginLeft: 25,
    },
    scTwoMain: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 80
    },
    subcontainer: {
        flexDirection: 'column',
        width: '100%',
        height: 'auto',
        borderRadius: 25,
        borderCurve: 'continuous', 
        marginBottom: 15,
        backgroundColor: 'white', 
        shadowColor: 'black',
        shadowOffset: {width: 0, height: 0},
        shadowRadius: 10,
        shadowOpacity: 0.05
    },
    container: {
      paddingHorizontal: 20, 
      paddingVertical: 10, 
      height: '100%'
    }
})

export default Profile;