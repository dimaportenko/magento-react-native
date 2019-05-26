import React, { Component } from 'react';
import {
    View,
    Text,
} from 'react-native';
import CheckoutCustomerAccount from "../checkout/CheckoutCustomerAccount";

class AddressScreen extends Component {
    static navigationOptions = () => ({
        title: 'Add Address',
        headerBackTitle: ' '
    });

    render() {
        return (
            <View style={{ flex: 1 }}>
                <CheckoutCustomerAccount />
            </View>
        );
    }
}

export default AddressScreen;
