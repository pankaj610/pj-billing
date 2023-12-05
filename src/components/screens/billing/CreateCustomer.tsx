import React, { Fragment } from 'react';
import { useController, useForm } from 'react-hook-form';
import { Text, View } from 'react-native';
import { Button, Checkbox, List, TextInput } from 'react-native-paper';
import { FormBuilder } from 'react-native-paper-form-builder';
import { LogicProps } from 'react-native-paper-form-builder/dist/Types/Types';
import tw from '../../../utils.js/tw';
import { createCustomer, getCustomer } from '../../../services/appService';
import { Customer } from '../../../types/billing';
import { useNavigation } from '@react-navigation/native';

function CreateCustomer() {
    const navigation = useNavigation();
    const { control, setFocus, handleSubmit } = useForm({
        defaultValues: {
            name: '',
            phone: '',
            address: '',
            gender: '',
            rememberMe: 'checked',
        },
        mode: 'onChange',
    });

    return (
        <View style={tw`px-3 py-3`}>
            <Text style={tw`title text-black text-center py-3`}>Customer Information</Text>
            <FormBuilder
                control={control}
                setFocus={setFocus}
                formConfigArray={[
                    {
                        name: 'name',
                        type: 'text',
                        textInputProps: {
                            label: 'Name',
                            left: <TextInput.Icon name={'account'} />,
                        },
                        rules: {
                            required: {
                                value: true,
                                message: 'Name is required',
                            },
                        },
                    },
                    {
                        name: 'phone',
                        type: 'text',
                        textInputProps: {
                            label: 'Phone',
                            left: <TextInput.Icon name={'phone'} />,
                        },
                        rules: {
                            required: {
                                value: true,
                                message: 'Phone is required',
                            },
                            pattern: {
                                value:
                                    /[0-9]{10}/,
                                message: 'Phone is invalid',
                            },
                        },
                    },
                    {
                        name: 'address',
                        type: 'text',
                        textInputProps: {
                            label: 'Address',
                            left: <TextInput.Icon name={'office-building'} />,
                        },
                        rules: {
                            required: {
                                value: true,
                                message: 'Address is required',
                            },
                        },
                    },
                    {
                        name: 'gender',
                        type: 'select',
                        textInputProps: {
                            label: 'Gender',
                            left: <TextInput.Icon name={'account'} />,
                        },
                        rules: {
                            required: {
                                value: true,
                                message: 'Gender is required',
                            },
                        },
                        options: [
                            {
                                value: 'female',
                                label: 'Female',
                            },
                            {
                                value: 'male',
                                label: 'Male',
                            },
                            {
                                value: 'others',
                                label: 'Others',
                            },
                        ],
                    },
                    {
                        name: 'rememberMe',
                        type: 'custom',
                        JSX: (props) => <CheckBoxAndroid title="Save this customer for future" {...props} />,
                    },
                ]}
            />
            <Button mode={'contained'} onPress={handleSubmit(async (data: Customer) => {
                try {
                    const existingCustomer = await getCustomer(data.phone);
                    if (existingCustomer) {
                        alert('Customer already exists');
                    } else {
                        createCustomer(data).then(() => {
                            alert('Customer created successfully');
                            navigation.goBack();
                        });
                    }
                } catch (err) {
                    alert('Error while getting customer');
                }
            })}>
                Submit
            </Button>
        </View >
    );
}

export function CheckBoxAndroid(props: LogicProps & { title: string }) {
    const { name, rules, shouldUnregister, defaultValue, control, title } = props;
    const { field } = useController({
        name,
        rules,
        shouldUnregister,
        defaultValue,
        control,
    });

    return (
        <List.Item
            title={title}
            left={() => (
                <Checkbox.Android
                    status={field.value}
                    onPress={() => {
                        field.onChange(field.value === 'checked' ? 'unchecked' : 'checked');
                    }}
                />
            )}
        />
    );
}

export default CreateCustomer;