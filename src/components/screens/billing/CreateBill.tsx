import React, { useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Text, View, FlatList, Modal } from 'react-native';
import { Button, Card, Checkbox, TextInput } from 'react-native-paper';
import { FormBuilder } from 'react-native-paper-form-builder';
import tw from '../../../utils.js/tw';
import { createBilling } from '../../../services/appService';
import { BillItem, Billing, Customer, MetalType } from '../../../types/billing';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { CheckBoxAndroid } from './CreateCustomer';
import CustomInput from '../../common/CustomInput';
import { useAppStore } from '../../../store/appStore';
import ModalWrapper from '../../common/ModalWrapper';
import Row from '../../common/Row';
import { convertToPrice } from '../../../utils.js/utils';
import EmptyList from '../../common/EmptyList';
import EmptyCart from '../../common/EmptyCart';


const BILL_ITEMS = [
    {
        value: '1',
        label: 'Payal',
        metalType: MetalType.GOLD,
    },
    {
        value: '2',
        label: 'Ring',
        metalType: MetalType.SILVER,
    },
    {
        value: '3',
        label: 'Tagdi',
        metalType: MetalType.SILVER,
    },

]

const TAX_RATE = 0.03;


function CreateBill() {
    const itemsRef = useRef<FlatList<BillItem> | null>();
    const navigation = useNavigation();
    const route = useRoute<RouteProp<{
        params: {
            customer: Customer
        }
    }>>();
    const { control, getValues, setFocus, handleSubmit, reset, setValue } = useForm({
        defaultValues: {
            item_name: '',
            weight_in_gram: '',
            weight_in_milligram: '',
            quantity: '1',
            total: 0,
            editableIndex: null,
            labour: '0',
            discount: '0',
            showLabour: 'checked',
            paymentMode: '',
            amountPaid: '0',
        },
        mode: 'onChange',
    });
    const { getCustomer } = useAppStore();
    const [state, setState] = React.useState<{ taxable: "checked" | "unchecked" | "indeterminate", visible: boolean, visiblePayment: boolean }>({ taxable: 'unchecked', visible: false, visiblePayment: false });
    const [items, setItems] = React.useState<BillItem[]>([]);
    const customer = route.params?.customer;

    const showModal = () => setState(s => ({ ...s, visible: true }));

    const showPaymentModal = () => setState(s => ({ ...s, visiblePayment: true }));
    const hideModal = () => setState(s => ({ ...s, visible: false, visiblePayment: false }));

    const totalAmount = items.reduce((acc, item) => item.finalAmount + acc, 0);


    const saveBilling = () => {
        if (items.length === 0) {
            alert("Add some items");
            return
        }
        const totalDiscount = items.reduce((acc, item) => item.discount + acc, 0);
        let tax = totalAmount * TAX_RATE;
        const totalAfterTax = totalAmount * (1 + TAX_RATE);
        const billRequest: Billing = {
            datetime: Date.now(),
            taxable: state.taxable,
            isHideLabour: true,
            items,
            discountReason: "",
            pdfLink: '',
            totalBeforeTax: totalAmount,
            tax,
            totalDiscount: totalDiscount,
            totalAfterTax: totalAfterTax,
            amountPaid: parseInt(getValues().amountPaid),
            paymentMode: getValues().paymentMode,
            goldPrice: useAppStore.getState().goldPrice,
            silverPrice: useAppStore.getState().silverPrice,
        }
        try {
            createBilling({ customer, billing: billRequest }).then(res => {
                navigation.goBack();
                getCustomer({ search: '', isRefresh: true })
            });
        } catch (err) {
            console.log('Error while getting customer', err);
        }
    }

    const renderItem = ({ item: bill, index }: { item: BillItem, index: number }) => {

        return <Card key={index} style={tw`mb-3 p-3`}>
            <Row label='Item Name' value={bill.item_name} />
            <Row label='Metal Type' value={`${bill.metalType}`} />
            <Row label='Price' value={`${convertToPrice(bill.price)}`} />
            <Row label='Weight (gram)' value={`${bill.weight_in_gram} g`} />
            <Row label='Weight (milligram)' value={`${bill.weight_in_milligram} mg`} />
            <Row label='Total' value={`= ${convertToPrice(bill.total)}`} />
            <Row label='Labour' value={`+ ${convertToPrice(bill.labour)}`} />
            <Row label='Discount' value={`- ${convertToPrice(bill.discount)}`} />
            <Row label='Quantity' value={bill.quantity} />
            <Row label='Final Amount' value={`= ${convertToPrice(bill.finalAmount)}`} />
            <View style={tw`flex flex-row justify-between`}>
                <Button mode={'contained'} onPress={() => {
                    for (let key in bill) {
                        setValue(key, bill[key]);
                    }
                    setValue('editableIndex', index);
                    showModal();
                }} style={tw`my-2 w-[49%] bg-purple`} icon="pencil-plus-outline">
                    Edit
                </Button>
                <Button mode={'contained'} onPress={() => {
                    setItems(b => b.filter((_, i) => i !== index));
                }} style={tw`my-2 w-[49%] bg-red`} icon="delete">
                    Delete
                </Button>
            </View>
        </Card>
    }

    const amountLeft = totalAmount - parseInt(getValues().amountPaid)

    return (<>
        <View style={tw`px-3 py-3`}>
            <View style={tw`flex flex-row justify-between items-center py-2`}>
                <Text style={tw`text-black`}>Gold Rate: {useAppStore.getState().goldPrice}</Text>
                <Text style={tw`text-black`}>Silver Rate: {useAppStore.getState().silverPrice}</Text>
                <View style={tw`flex flex-row justify-between items-center`}>
                    <Checkbox.Android
                        status={state.taxable}
                        onPress={() => {
                            setState(prevState => ({ ...prevState, taxable: prevState.taxable === 'checked' ? 'unchecked' : 'checked' }));
                        }}
                    />
                    <Text style={tw`text-black`}>Taxable</Text>
                </View>
            </View>
            <View style={tw`flex h-[70%]`}>
                <FlatList
                    ref={itemsRef}
                    data={items}
                    renderItem={renderItem}
                    keyExtractor={(_, index) => index.toString()}
                    ListFooterComponent={() => parseInt(getValues().amountPaid) > 0 && <Card style={tw`mb-3 p-3`}>
                        <Row label='Amount Paid' style="text-success" value={`${convertToPrice(getValues().amountPaid)}`} />
                        <Row label='Payment Mode' value={getValues().paymentMode} />
                    </Card>}
                    ListEmptyComponent={<EmptyCart />}
                    contentContainerStyle={{ flex: 1 }}
                />
            </View>
            <View style={tw`flex h-[110px] border-t-[1px] border-primary`}>
                <Row label="Total Bill Amount" value={`= ${convertToPrice(totalAmount)}`} style="pt-2" valueStyle='text-right' />
                <Row label="Total Amount Paid" value={` - ${convertToPrice(getValues().amountPaid)}`} style="pt-2" valueStyle='text-right text-success' />
                <Row label="Amount Left" value={`= ${convertToPrice(amountLeft)}`} style="pt-2" valueStyle='text-right' />
                <View style={tw`flex flex-row justify-between`}>
                    <Button mode={'contained'} onPress={() => { showModal(); reset() }} style={tw`my-2 w-[49%] bg-secondary`} icon="cart-plus">
                        Add Item
                    </Button>
                    <Button mode={'contained'} onPress={showPaymentModal} style={tw`my-2 w-[49%] bg-green`} icon="cash-multiple">
                        Add Payment
                    </Button>
                </View>
                <Button mode={'contained'} onPress={() => saveBilling()} icon="printer">
                    Print Bill
                </Button>
            </View>
        </View >
        <ModalWrapper visible={state.visible} onClose={hideModal} >
            <Text style={tw`title text-black text-center py-3`}>Add Item</Text>
            <FormBuilder
                control={control}
                setFocus={setFocus}
                formConfigArray={[
                    {
                        name: 'item_id',
                        type: 'autocomplete',
                        textInputProps: {
                            label: 'Item Name',
                            left: <TextInput.Icon name={'tab-search'} />,
                        },
                        rules: {
                            required: {
                                value: true,
                                message: 'Item name is required',
                            },
                        },
                        options: BILL_ITEMS,
                    },
                    {
                        name: 'weight_in_gram',
                        type: 'custom',
                        textInputProps: {
                            label: 'Weight (gram)',
                            left: <TextInput.Icon name={'weight'} />,
                        },
                        rules: {
                            required: {
                                value: true,
                                message: 'Weight (gram) is required',
                            },
                        },
                        JSX: (props) => <CustomInput {...props} keyboardType='numeric' />
                    },
                    {
                        name: 'weight_in_milligram',
                        type: 'custom',
                        textInputProps: {
                            label: 'Weight (milligram)',
                            left: <TextInput.Icon name={'weight'} />,
                        },
                        rules: {
                            required: {
                                value: true,
                                message: 'Weight (milligram) is required',
                            },
                        },
                        JSX: (props) => <CustomInput {...props} keyboardType='numeric' />
                    },
                    {
                        name: 'labour',
                        type: 'custom',
                        textInputProps: {
                            label: 'Labour (Rs)',
                            left: <TextInput.Icon name={'human-dolly'} />,
                        },
                        rules: {
                            required: {
                                value: true,
                                message: 'Labour is required',
                            },
                        },
                        JSX: (props) => <CustomInput {...props} keyboardType='numeric' />
                    },
                    {
                        name: 'quantity',
                        type: 'custom',
                        textInputProps: {
                            label: 'Quantity',
                            left: <TextInput.Icon name={'fraction-one-half'} />,
                        },
                        defaultValue: '1',
                        rules: {
                            required: {
                                value: true,
                                message: 'Quantity is required',
                            },
                        },
                        JSX: (props) => <CustomInput {...props} keyboardType='numeric' />
                    },
                    {
                        name: 'discount',
                        type: 'custom',
                        textInputProps: {
                            label: 'Discount',
                            left: <TextInput.Icon name={'cash'} />,
                        },
                        defaultValue: '0',
                        rules: {
                            required: {
                                value: true,
                                message: 'Discount is required',
                            },
                        },
                        JSX: (props) => <CustomInput {...props} keyboardType='numeric' />
                    },
                    {
                        name: 'discount',
                        type: 'custom',
                        defaultValue: 0,
                    },
                    {
                        name: 'isShowLabour',
                        type: 'custom',
                        defaultValue: 'checked',
                        JSX: (props) => <CheckBoxAndroid title="Show Labour Charge on Bill" {...props} />,
                    },
                ]}
            />

            <Button mode={'contained'} style={tw`mb-4`} onPress={handleSubmit(async (bill: BillItem) => {
                const isUpdate = getValues().total > 0;
                const itemId = bill['item_id'];
                const selectedItem = BILL_ITEMS.find(b => b.value === itemId);
                switch (selectedItem.metalType) {
                    case MetalType.GOLD:
                        bill.price = useAppStore.getState().goldPrice; // per 10 g
                        var total = Math.floor(((Math.floor(bill.weight_in_gram) * 1000 + Math.floor(bill.weight_in_milligram)) * Math.floor(bill.price)) / 10000); // per gram gold price
                        break;
                    case MetalType.SILVER:
                        bill.price = useAppStore.getState().silverPrice;
                        var total = Math.floor(((Math.floor(bill.weight_in_gram * 1000) + Math.floor(bill.weight_in_milligram)) * Math.floor(bill.price)) / 1000000); // per kilo gram silver price
                        break;
                    case MetalType.ARTIFICIAL:
                        bill.price = 0;
                        var total = Math.floor(bill.price);
                        break;
                }
                let finalAmount = total + Math.floor(bill.labour) - Math.floor(bill.discount);
                const editableIndex = getValues().editableIndex;

                if (editableIndex >= 0 && editableIndex != null) {
                    setItems(b => [...b.slice(0, editableIndex), { ...bill, total, finalAmount, metalType: selectedItem.metalType, item_name: selectedItem.label }, ...b.slice(editableIndex + 1)]);
                } else {
                    setItems(b => [...b, { ...bill, total, finalAmount, metalType: selectedItem.metalType, item_name: selectedItem.label }]);
                }
                hideModal();
                reset();
                itemsRef.current.scrollToEnd();
            })}>
                {getValues().total > 0 ? "Update" : "Add"}
            </Button>
            <Button color='red' mode={'outlined'} style={tw`mb-4`} onPress={() => hideModal()}>Cancel</Button>
        </ModalWrapper>
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
            <Button mode={'contained'} style={tw`mb-4`} onPress={() => hideModal()}>Submit</Button>
        </ModalWrapper>
    </>
    );
}
export default CreateBill;