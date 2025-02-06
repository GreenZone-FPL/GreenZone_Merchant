import AsyncStorage from '@react-native-async-storage/async-storage'
const MyAsyncStorage = {
    readData: async (key, defaultValue) => {
        try {
            const jsonValue = await AsyncStorage.getItem(key)
            return jsonValue != null ? JSON.parse(jsonValue) : defaultValue
        } catch (error) {
            console.log(error)
        }
    },

    storeData: async (key, value) => {
        try {
            const jsonValue = JSON.stringify(value)
            await AsyncStorage.setItem(key, jsonValue)
        } catch (error) {
            console.log(error)
        }
    }
}

// export default MyAsyncStorage



class asyncStorage {

    static async readData() {
        try {
            const jsonValue = await AsyncStorage.getItem(key)
            return jsonValue != null ? JSON.parse(jsonValue) : defaultValue
        } catch (error) {
            console.log(error)
        }
    }
}

export default asyncStorage;