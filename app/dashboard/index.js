import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { View, SafeAreaView, Text, StyleSheet, ScrollView, Image } from 'react-native';
import solarImage from '../../assets/solar-cell.png';

const dashboard = () => {

    const [userSession, setUserSession] = useState({});

    const retrieve = async(key) => {
        const result = await AsyncStorage.getItem(key);
        if(result) {
            const rs = JSON.parse(result)
            setUserSession(JSON.parse(atob(rs.userData)));
        }
    }

    useEffect(() => {
        retrieve('userSession');
    }, [])

    return (
        <SafeAreaView>
            <ScrollView 
                contentContainerStyle={styles.container}>
                <View>
                    <Text style={styles.heading}>Dashboard</Text>
                </View>

                <View style={styles.subcontainer} >
                    <View style={styles.scOneMain} >
                        <View style={styles.scOneLeft}>
                            <Text style={styles.scOneStatus}>
                                ● Active Status
                            </Text>
                            <Text style={styles.scOneHeading}>
                                Solar Power Plant
                            </Text>
                            {userSession ? (
                                <Text style={styles.scOneHeadingVal}>
                                    {userSession.orgNameShort}
                                </Text>
                            ) : (<></>)}
                        </View>
                        <View>
                        <Image source={solarImage} style={styles.scOneSolarImg} />
                        </View>
                    </View>
                </View>
                {
                    [1, 0.8, 0.5].map(opacity=> (
                    <View 
                        key={opacity} 
                        style={[styles.subcontainer, {opacity}]} 
                    />
                    ))
                }
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    heading: {
        fontSize: 38,
        fontWeight: '700',
        marginHorizontal: 6,
        marginTop: 12,
        marginBottom: 15
    },
    scOneSolarImg: {
        marginVertical: 24,
        width: 120,
        height: 120,
        resizeMode: "cover",
        marginRight: 40,
    },
    scOneStatus: {
        fontSize: 11,
        color: 'green',
        fontWeight: '300',
        marginTop: 4,
    },
    scOneHeading: {
        fontSize: 12,
        fontWeight: '300',
        marginTop: 40
    },
    scOneHeadingVal: {
        fontSize: 28,
        fontWeight: '700',
        marginTop: 0        
    },
    scOneLeft: {
        flexDirection: 'column',
        marginLeft: 22,
    },
    scOneMain: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    subcontainer: {
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

export default dashboard;