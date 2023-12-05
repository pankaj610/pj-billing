import React, { useEffect, useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import tw from "../../utils.js/tw";
import { getCustomer, getTodaysCustomers } from "../../services/appService";
import { Avatar, Button, Card, Divider, TextInput } from "react-native-paper";
import { useAppStore } from "../../store/appStore";
import { ScrollView } from "react-native-gesture-handler";
import { Customer } from "../../types/billing";
import { useNavigation } from "@react-navigation/native";
import { APP_ROUTES } from "../../router/RootNavigation";

const LeftContent = props => <Avatar.Icon {...props} icon="account" />

const RightContent = props => <Avatar.Icon {...props} icon="eye" style={tw`mr-4`} />

const Home = () => {
  const { customers, getTodaysCustomers, getCustomer } = useAppStore();
  const [search, setSearchText] = useState("");
  const navigation = useNavigation();

  useEffect(() => {
    // if (search != null && search != "") {
    //   getTodaysCustomers();
    // } else {
    // }
    getCustomer(search);
  }, [search]);

  const renderCustomer = ({ item }: { item: Customer }) => {

    const navigateToBills = () => {
      navigation.navigate(APP_ROUTES.CUSTOMER_BILLS.name, { customer: item });
    }

    return <TouchableOpacity style={tw`my-2`} onPress={navigateToBills}>
      <Card>
        <Card.Title title={item.name} subtitle={item.phone} left={LeftContent} right={RightContent} />
      </Card>
    </TouchableOpacity>
  }

  return (
    <View style={tw`flex flex-1 flex-col`}>
      <View style={tw`flex flex-col px-3`}>
        <Text style={tw`title text-black py-2 text-center`}>Todays Customer</Text>
        <TextInput
          label="Seach customer (Name or Phone)"
          value={search}
          onChangeText={text => setSearchText(text)}
          mode="outlined"
        />
        <Divider style={tw`py-[1px] my-3`} />
      </View>

      <View style={tw`flex flex-1 w-full px-3`}>
        {customers.length === 0 && <Text style={tw`title text-center`}>No Customers</Text>}
        {customers.length > 0 && <FlatList
          data={customers}
          renderItem={renderCustomer}
          keyExtractor={(item) => item.id.toString()}
          scrollEnabled={true}
        />}
      </View>

    </View>
  );

}




export default Home;
