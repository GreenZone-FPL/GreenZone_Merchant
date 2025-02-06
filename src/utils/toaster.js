import { ToastAndroid } from 'react-native'
export const Toaster = {
    show(message){
        ToastAndroid.show(message, ToastAndroid.SHORT)
    }
}

