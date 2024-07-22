import { useEffect, useState } from "react";
import { View, SafeAreaView, Text } from "react-native";
import { useRootNavigationState, router, useNavigation } from "expo-router";

const Main = () => {
    const [initLoad, setInitLoad] = useState(true);
    // const token = null;

    // const navigation = useNavigation();
    // const rootNavigationState = useRootNavigationState();

    useEffect(() => {
        const timer = setTimeout(() => {
            setInitLoad(false);
        }, 3000);

        // Clear the timeout if the component unmounts
        return () => clearTimeout(timer);
    }, []);

    if (initLoad) {
        return <Text>Panelite.</Text>;
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