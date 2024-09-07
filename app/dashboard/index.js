import { View, SafeAreaView, Text, StyleSheet, ScrollView } from 'react-native';
// import ColorList from '../../components/ColorList';

const dashboard = () => {
    return (
        <SafeAreaView>
            <ScrollView 
                contentContainerStyle={styles.container}>
                <View>
                    <Text style={styles.heading}>Dashboard</Text>
                </View>
                {
                    [1, 0.8, 0.5].map(opacity=> (
                    <View 
                        key={opacity} 
                        style={[styles.color, {backgroundColor: "#059661", opacity}]} 
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
    color: {
        width: '100%',
        height: 150,
        borderRadius: 25,
        borderCurve: 'continuous', 
        marginBottom: 15,
    },
    container: {
      paddingHorizontal: 20, 
      paddingVertical: 10, 
      height: '100%'
    }
})

export default dashboard;