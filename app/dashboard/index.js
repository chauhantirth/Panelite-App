import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { View, SafeAreaView, Text, StyleSheet, ScrollView, Image, Svg, Touchable, TouchableOpacity, Modal } from 'react-native';
import solarImage from '../../assets/solar-cell.png';
import calenderImage from '../../assets/calendar.png';
import { Calendar } from 'react-native-calendars';
import moment from 'moment';

const dashboard = () => {

    const [userSession, setUserSession] = useState({});
    const [showCalendar, setShowCalendar] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);

    const [dateRange, setDateRange] = useState({});
    const [predictedVal, setPredictedVal] = useState('-');

    const handleDateSelection = (date) => {
        const parsedDate = moment(date.dateString, 'YYYY-MM-DD')
        const dayOfMonth = parsedDate.format('DD');
        const monthName = parsedDate.format('MMM'); 

        setSelectedDate({
            formated: {
                month: monthName,
                day: dayOfMonth
            },
            raw: date,
        })
    };

    const retrieve = async(key) => {
        const result = await AsyncStorage.getItem(key);
        if(result) {
            const rs = JSON.parse(result)
            setUserSession(JSON.parse(atob(rs.userData)));
        }
    }

    useEffect(() => {
        retrieve('userSession');
        setDateRange({
            minDate: moment().add(1, 'days').format("YYYY-MM-DD"),
            maxDate: moment().add(6, 'days').format("YYYY-MM-DD")
        });
    }, [])

    useEffect(() => {
        setPredictedVal('-');
    }, [selectedDate])

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

                <View>
                    <Text style={styles.subHeading}>Plant Summary</Text>
                </View>

                <View style={styles.subcontainer}>
                    <View style={styles.scTwoMain}>
                        <View style={styles.scTwoLeft}>
                            <Text style={styles.scTwoHeading}>
                                Plant Capacity
                            </Text>
                            {userSession ? (
                                <Text style={styles.scTwoHeadingVal}>
                                    {userSession.plantCapacity}
                                </Text>
                            ) : (<></>)}
                        </View>
                        <View style={styles.scTwoRight}>
                            <Text style={styles.scTwoHeading}>
                                Panels
                            </Text>
                            {userSession ? (
                                <Text style={styles.scTwoHeadingVal}>
                                    {userSession.plantNumberOfPanels}
                                </Text>
                            ) : (<></>)}
                        </View>
                    </View>
                    <View
                        style={{
                            borderBottomColor: 'black',
                            borderBottomWidth: StyleSheet.hairlineWidth,
                            marginHorizontal: 40
                        }}
                    />
                    <View style={styles.scTwoBottom} >
                        <Text style={styles.scTwoHeading2}>Location</Text>
                        {userSession ? (
                            <Text style={[styles.scTwoHeadingVal2]}>
                                {userSession.orgCity}, IN
                            </Text>
                        ) : (<></>)}
                    </View>
                </View>

                <View>
                    <Text style={styles.subHeading}>AI Prediction</Text>
                </View>

                <View style={styles.subcontainer} >
                    <View style={styles.scThreeMain} >
                        <View style={styles.scThreeLeft}>
                            <Text style={styles.scThreeHeading}>Select Date</Text>
                            <View style={{flexDirection: 'row'}}>

                                <TouchableOpacity
                                    onPress={() => setShowCalendar(true)}
                                    style={styles.scThreeDateButton}
                                >
                                    <Image source={calenderImage} style={styles.scThreeCalenderImg} />
                                    {selectedDate ? (
                                        <Text style={styles.scThreeHeadingVal}>  {selectedDate.formated.day} {selectedDate.formated.month}
                                        </Text>
                                    ) : (
                                        // <Text style={styles.scThreeHeadingValEmpty}> - </Text>
                                        <></>
                                    )}
                                </TouchableOpacity>
                                <Modal visible={showCalendar} animationType='fade'>
                                    <Calendar 
                                        style={styles.scThreeCalendar}
                                        onDayPress={(date) => {
                                            handleDateSelection(date)
                                            setShowCalendar(false)
                                        }}
                                        minDate={dateRange.minDate}
                                        maxDate={dateRange.maxDate}

                                    />
                                </Modal>
                            </View>
                        </View>
                        <View style={styles.scThreeRight}>
                            <Text style={styles.scThreeHeading}>Generation</Text>
                            <Text style={styles.scThreeHeadingValRight}>{predictedVal}</Text>
                        </View>
                    </View>
                    <View style={styles.scThreeButtonContainer}>
                        <TouchableOpacity 
                            activeStyle
                            style={styles.scThreeButton}
                        >
                            <Text style={styles.scThreeButtonText}>Predict</Text>
                        </TouchableOpacity>
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
    subHeading: {
        fontSize: 18,
        fontWeight: '700',
        marginHorizontal: 6,
        marginTop: 12,
        marginBottom: 15
    },
    heading: {
        fontSize: 38,
        fontWeight: '700',
        marginHorizontal: 6,
        marginTop: 12,
        marginBottom: 15
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
    scThreeCalendar: {
        borderRadius: 10,
        elevation: 4,
        margin: 40,
    },
    scThreeDateButton: {
        borderRadius: 10,
        width: 'auto',
        paddingHorizontal: 8,
        flexDirection: 'row',
        // backgroundColor: '#CBCCC7', 
        backgroundColor: 'white',
        borderWidth: 0.5,
        borderColor: '#D0D0CD',
        shadowColor: 'black',
        shadowOffset: {width: 0, height: 0},
        shadowRadius: 10,
        shadowOpacity: 0.05
    },
    scThreeHeading: {
        fontSize: 14,
        fontWeight: '300',
        marginBottom: 4
    },
    scThreeHeadingValRight: {
        fontSize: 32,
        fontWeight: '700',
        marginTop: 0        
    },
    scThreeHeadingVal: {
        fontSize: 16,
        fontWeight: '700',
        marginVertical: 10      
    },
    scThreeHeadingValEmpty: {
        fontSize: 32,
        fontWeight: '400',
        marginTop: 0        
    },
    scThreeCalenderImg: {
        marginTop: 8,
        width: 24,
        height: 24,
        resizeMode: "cover",
        marginBottom: 8,
    },
    scThreeLeft: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 14,
        marginLeft: 55,
    },
    scThreeRight: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 14,
        marginRight: 55,
    },
    scThreeMain: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        // gap: 40
    },
    scTwoHeading2: {
        fontSize: 14,
        fontWeight: '300'
    },
    scTwoHeadingVal2: {
        fontSize: 16,
        fontWeight: '700'
    },
    scTwoBottom: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 14,
        marginHorizontal: 50
    },
    scTwoHeading: {
        fontSize: 14,
        fontWeight: '300',
    },
    scTwoHeadingVal: {
        fontSize: 32,
        fontWeight: '700',
        marginTop: 0        
    },
    scTwoLeft: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 14
    },
    scTwoRight: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 14,
        marginRight: 16
    },
    scTwoMain: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 80
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

export default dashboard;