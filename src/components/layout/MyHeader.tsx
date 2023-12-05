import React from "react";
import { SafeAreaView, Text, View } from "react-native";
import IonIcons from "react-native-vector-icons/Ionicons";
import tw from "../../utils.js/tw";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { APP_ROUTES } from "../../router/RootNavigation";

function MyHeader({ title }) {
  const navigation = useNavigation();
  return (
    <SafeAreaView>
      <View style={tw`flex flex-row justify-between px-3 py-3 items-center border-solid border-b-[1px]  border-primary`}>
        <IonIcons
          name="menu-outline"
          size={30}
          onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
        />
        <Text>{title}</Text>
        <IonIcons
          name="add-outline"
          size={30}
          onPress={() => navigation.navigate(APP_ROUTES.CREATE_CUSTOMER.name)}
        />
      </View>
    </SafeAreaView>
  );
}


export default MyHeader;
