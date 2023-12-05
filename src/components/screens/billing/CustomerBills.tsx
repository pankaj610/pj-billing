import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import React, { useEffect } from 'react'
import { FlatList, Text, View } from 'react-native'
import { Customer } from '../../../types/billing';
import { Button, Card } from 'react-native-paper';
import tw from '../../../utils.js/tw';
import { APP_ROUTES } from '../../../router/RootNavigation';
import Row from '../../common/Row';
import { fetchBilling } from '../../../services/appService';
import { transformObjectToArray } from '../../../utils.js/helpers';

function CustomerBills() {
    const route = useRoute<RouteProp<{
        params: {
            customer: Customer
        }
    }>>();
    const [billings, setBillings] = React.useState([]);
    const customer = route.params?.customer;
    const navigation = useNavigation();

    useEffect(() => {
        fetchBilling({ customer }).then((res) => {
            const billings = transformObjectToArray(res);
            setBillings(billings);
        });
    }, []);


    const goToCreateBill = () => {
        navigation.navigate(APP_ROUTES.CREATE_BILL.name, { customer: customer });
    }

    const renderBilling = () => {
        return <View style={tw`my-2`}>
            <Card>
                <Card.Title title="Bill" />
            </Card>
        </View>
    }

    return (
        <View style={tw`flex flex-1 px-3`}>
            <View style={tw`flex flex-2`}>
                <Text style={tw`text-xl text-center py-3`}>Customer Information</Text>
                <Card style={tw`p-3`}>
                    <Row label="Name: " value={customer.name} />
                    <Row label="Phone: " value={customer.phone} />
                    <Row label="Address: " value={customer.address} />
                    <Row label="Unique Code: " value={customer.unique_code} />
                    <Row label="Last Visited: " value={customer.lastVisit} />
                </Card>
                <Text style={tw`text-xl text-center mt-3`}>Customer Bills</Text>
                <Button mode='outlined' style={tw`w-50 self-center my-3`} onPress={goToCreateBill}>Create Bill</Button>
            </View>
            <View style={tw`flex flex-2`}>
                <FlatList
                    data={billings}
                    renderItem={renderBilling}
                    keyExtractor={(_, index) => index.toString()}
                />
            </View>
            <View style={tw`flex flex-1`}>
                <Button mode={'contained'} onPress={() => console.log("asdf")} icon="printer">
                    Print Bill
                </Button>
            </View>
        </View >
    )
}

export default CustomerBills