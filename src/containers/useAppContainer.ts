import { useEffect, useState } from 'react';
import { showMessage } from 'react-native-flash-message';
import { OrderStatus } from '../constants';
import { useAppContext } from '../context/appContext';
import merchantSocketService from '../sevices/merchantSocketService';
import { AppAsyncStorage } from '../utils';

export const useAppContainer = () => {
    const { orderNew, setOrderNew, orderUpdate, setOrderUpdate } = useAppContext();
    const [tokenValid, setTokenValid] = useState<boolean>(false);
    const [loadingSplash, setLoadingSplash] = useState<boolean>(true);

    const orderNewCallBack = (newOrder: any) => {
        console.log('newOrder', newOrder);
        setOrderNew(newOrder);
    }
    const updateOrderCallBack = (data: any) => {

        console.log('updateStatus', data);
        setOrderUpdate(data);
        // if (data.status === OrderStatus.PENDING_CONFIRMATION.value) {
        //     console.log('newOrder', data);
        //     setOrderUpdate(data);
        // }
    }

    // Initialize the socket
    useEffect(() => {
        console.log('Initializing socket...');
        merchantSocketService.initialize(orderNewCallBack, updateOrderCallBack);

        return () => {
            merchantSocketService.disconnect();
        };
    }, [setOrderNew]);

    // Check token validity
    useEffect(() => {
        const checkToken = async () => {
            const tokenIsValid = await AppAsyncStorage.isTokenValid();
            setTokenValid(tokenIsValid);
            setLoadingSplash(false);
        };
        checkToken();
    }, []);

    useEffect(() => {
        console.log('orderNew:', orderNew);
        if (orderNew) {

            showMessage({
                message: 'Đơn hàng mới',
                description: orderNew.message,
                type: 'success',
                icon: 'success',
                duration: 2000,
                titleStyle: { fontSize: 18, fontWeight: 'bold' },
                textStyle: { fontSize: 16, color: 'white' },
            });
        }
    }, [orderNew]);

    useEffect(() => {
        console.log('orderUpdate:', orderUpdate);
        if (orderUpdate) {

            showMessage({
                message: 'Đơn hàng cập nhật',
                description: orderUpdate.message,
                type: 'info',
                icon: 'info',
                duration: 2000,
                titleStyle: { fontSize: 18, fontWeight: 'bold' },
                textStyle: { fontSize: 16, color: 'white' },
            });
        }
    }, [orderUpdate]);

    return {
        tokenValid,
        loadingSplash,
        orderNewCallBack,
        updateOrderCallBack
    }


}