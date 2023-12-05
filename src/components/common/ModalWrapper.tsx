import React from 'react'
import { Modal, Pressable, View } from 'react-native'
import tw from '../../utils.js/tw'

function ModalWrapper({ visible, onClose, children }) {
    return (
        <Modal transparent={true} visible={visible} onRequestClose={onClose} animationType='slide' presentationStyle='overFullScreen' style={tw`bg-transparent`}>
            <Pressable style={tw`flex flex-1`} onPress={onClose}>
                <View style={tw`flex flex-1 bg-lightGreyOpacity`} />
            </Pressable>
            <View style={tw`flex px-3 w-100 bg-white border-black border-rounded`}>
                {children}
            </View>
        </Modal>
    )
}

export default ModalWrapper