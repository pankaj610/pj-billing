import { RouteProp, useFocusEffect, useNavigation, useRoute } from '@react-navigation/native'
import React, { useCallback, useMemo } from 'react'
import { FlatList, Text, View, Alert } from 'react-native'
import { Customer } from '../../../types/billing';
import { Button, Card, TextInput } from 'react-native-paper';
import tw from '../../../utils.js/tw';
import { APP_ROUTES } from '../../../router/RootNavigation';
import Row from '../../common/Row';
import { createBilling, deleteBill, fetchBilling } from '../../../services/appService';
import { getDueAmount, transformObjectToArray } from '../../../utils.js/helpers';
import { convertToPrice, getInvoiceHtml } from '../../../utils.js/utils';
import FullScreenLoadingContainer from '../../common/FullScreenLoader';
import useFetchData from '../../../hooks/useFetchData';
import EmptyList from '../../common/EmptyList';
import ModalWrapper from '../../common/ModalWrapper';
import { FormBuilder } from 'react-native-paper-form-builder';
import CustomInput from '../../common/CustomInput';
import { useForm } from 'react-hook-form';
import { useAppStore } from '../../../store/appStore';
import RNHTMLtoPDF from 'react-native-html-to-pdf';


function CustomerBills() {
    const route = useRoute<RouteProp<{
        params: {
            customer: Customer
        }
    }>>();

    const { control, getValues, setFocus } = useForm({
        defaultValues: {
            paymentMode: '',
            amountPaid: '0',
        },
        mode: 'onChange',
    });
    const customer = route.params?.customer;
    const navigation = useNavigation();
    const [state, setState] = React.useState<{ visiblePayment: boolean }>({ visiblePayment: false });
    const hideModal = () => setState(s => ({ ...s, visible: false, visiblePayment: false }));

    const { data, loading, reload } = useFetchData(() => {
        return fetchBilling({ customer })
    })
    const showPaymentModal = () => setState(s => ({ ...s, visiblePayment: true }));
    const billings = useMemo(() => transformObjectToArray(data), [data]);

    useFocusEffect(useCallback(() => {
        reload()
    }, []))

    const printBill = async (jsonData) => {
        // Create HTML content dynamically
        const htmlContent = getInvoiceHtml(jsonData, customer);

        try {
            // Generate PDF
            const options = {
                html: htmlContent,
                fileName: 'invoice',
                directory: 'Documents',
            };
            const file = await RNHTMLtoPDF.convert(options);
            navigation.navigate('pdf_viewer', { url: file.filePath })
        } catch (error) {
            console.error('Error generating PDF:', error);
            Alert.alert('Error', 'Failed to generate PDF');
        }
    };

    const goToCreateBill = () => {
        // @ts-ignore
        navigation.navigate(APP_ROUTES.CREATE_BILL.name, { customer: customer });
    }

    const submitPayment = () => {
        console.log("Here")
        if (!getValues().amountPaid || !getValues().paymentMode) return
        const billRequest = {
            datetime: Date.now(),
            amountPaid: parseInt(getValues().amountPaid),
            paymentMode: getValues().paymentMode,
            goldPrice: useAppStore.getState().goldPrice,
            silverPrice: useAppStore.getState().silverPrice,
        }
        try {
            createBilling({ customer, billing: billRequest }).then(res => {
                reload()
            });
        } catch (err) {
            console.log('Error while getting customer', err);
        }
    }

    const renderBilling = ({ item }) => {
        return <View style={tw`my-2`}>
            <Card style={tw`p-2`}>
                <Text>Receipt - {new Date(item.datetime).toLocaleDateString()}</Text>
                {item.items?.map((el, i) => {
                    return <Card key={i} style={tw`p-2 border border-primary rounded my-2 rounded-lg`}>
                        <Row label={'Item Name'} value={el.item_name} />
                        <Row label={'Weight (g)'} value={el.weight_in_gram} />
                        <Row label={'Weight (mg)'} value={el.weight_in_milligram} />
                        <Row label={'Labour'} value={el.labour} />
                        <Row label={'Amount'} value={convertToPrice(el.total)} />
                    </Card>
                })}
                {item.items?.length > 0 && <>
                    <Row label="Gold Price (10g)" value={convertToPrice(item.goldPrice)} />
                    <Row label="Silver Price (1kg)" value={convertToPrice(item.silverPrice)} />
                    <Row label="Total" value={convertToPrice(item.totalBeforeTax)} />
                    <Row label="Discount" value={`- ${convertToPrice(item.totalDiscount)}`} />
                    <Row label="Tax" value={`+ ${convertToPrice(item.tax)}`} />
                    <Row label="Total (Taxed)" valueStyle='text-secondary' value={convertToPrice(item.totalAfterTax)} />
                </>}
                <Row label="Amount Paid" valueStyle='text-green' value={convertToPrice(item.amountPaid)} />
                {!isNaN(item.totalAfterTax - item.amountPaid) && <Row label="Amount Left" valueStyle='text-red' value={convertToPrice(item.totalAfterTax - item.amountPaid)} />}
                <Button mode={'contained'} style={tw`mt-2`} onPress={() => {
                    printBill(item)
                }} icon="printer">
                    Print Bill
                </Button>
                <Button mode={'outlined'} style={tw`mt-2`} onPress={() => {
                    deleteBill({ customer, billId: item.id }).then(reload)
                }} icon="delete">
                    Delete
                </Button>
            </Card>
        </View>
    }

    if (loading) {
        return <FullScreenLoadingContainer />
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
                    <Row label="Amount Due: " valueStyle='text-red' value={getDueAmount(billings)} />
                </Card>
                <Text style={tw`text-xl text-center mt-3`}>Customer Bills</Text>
                <View style={tw`flex flex-row px-3 justify-between`}>
                    <Button mode='contained' style={tw`bg-secondary self-center my-3`} onPress={goToCreateBill}>Create Bill</Button>
                    <Button mode='outlined' color='white' style={tw`bg-green self-center my-3`} onPress={showPaymentModal}>Add Payment</Button>
                </View>
            </View>
            <View style={tw`flex flex-3`}>
                <FlatList
                    data={billings}
                    renderItem={renderBilling}
                    keyExtractor={(obj) => obj.id?.toString()}
                    ListEmptyComponent={<EmptyList />}
                />
            </View>
            <ModalWrapper visible={state.visiblePayment} onClose={hideModal}>
                <Text>Payment Method</Text>
                <FormBuilder
                    control={control}
                    setFocus={setFocus}
                    formConfigArray={[
                        {
                            name: 'paymentMode',
                            type: 'autocomplete',
                            textInputProps: {
                                label: 'Payment Mode',
                                left: <TextInput.Icon name={'cash'} />,
                            },
                            rules: {
                                required: {
                                    value: true,
                                    message: 'Payment Mode is required',
                                },
                            },
                            options: [
                                {
                                    value: 'Cash',
                                    label: 'Cash',
                                },
                                {
                                    value: 'Online',
                                    label: 'Online',
                                },
                                {
                                    value: 'Exchange',
                                    label: 'Exchange',
                                },
                            ],
                        },
                        {
                            name: 'amountPaid',
                            type: 'custom',
                            textInputProps: {
                                label: 'Amount',
                                left: <TextInput.Icon name={'cash'} />,
                            },
                            defaultValue: '0',
                            rules: {
                                required: {
                                    value: true,
                                    message: 'Amount is required',
                                },
                            },
                            JSX: (props) => <CustomInput {...props} keyboardType='numeric' />
                        },
                    ]}
                />
                <Button mode={'contained'} style={tw`mb-4`} onPress={() => submitPayment()}>Submit</Button>
            </ModalWrapper>
        </View >
    )
}

export default CustomerBills