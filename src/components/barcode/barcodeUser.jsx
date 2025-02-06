import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ImageBackground,
    TouchableOpacity,
    Image,
    Pressable,
} from 'react-native';
import PropTypes from 'prop-types';
import { TitleText } from '../texts/TitleText'; 
import { colors, GLOBAL_KEYS } from '../../constants'; 
import { Column } from '../containers/Column';
import { Row } from '../containers/Row';
import { NormalText } from '../texts/NormalText';

const BarcodeUserCardPropTypes = {
    imageBg: PropTypes.string, // Link hình nền
    nameUser: PropTypes.string, // Tên người dùng
    code: PropTypes.string, // Thông điệp mã
    codeId: PropTypes.string, // Mã vạch
    onPress: PropTypes.func, 
};

export const BarcodeUser = ({ imageBg, nameUser, code, codeId, onPress }) => {
    return (
        <View style={styles.container}>
            {/* View để bo góc */}
            <View style={styles.imageWrapper}>
                <ImageBackground
                    source={require('../../assets/images/bgvoucher.png')} // Thay bằng đường dẫn ảnh của bạn
                    resizeMode="cover"
                    style={styles.imageBackground}
                >
                    <Column style={{padding: 16}}>
                        {/* Nội dung thông báo */}
                        <Row style={{justifyContent: 'space-between'}}>
                        <Column>
                            <TitleText text={nameUser} color={colors.white}/>
                            <TitleText text='Mới' color={colors.white}/>
                            </Column>
                            <Pressable style={styles.btnBEAN} onPress={onPress}>
                                <TitleText text='Đổi 0 Xu' color={colors.white}/>
                            </Pressable>
                        </Row>
                        {/* Mã vạch */}
                        <View style={styles.barCode}>
                            <Image
                                source={require('../../assets/images/barcode.png')} // Thay bằng đường dẫn ảnh mã vạch
                                style={styles.imgcode}
                            />
                            <NormalText text={codeId}/>
                        </View>

                    </Column>
                </ImageBackground>
            </View>
        </View>
    );
};

BarcodeUser.propTypes = BarcodeUserCardPropTypes;

const styles = StyleSheet.create({
    container: {
        margin: 16,
    },
    imageWrapper: {
        borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT, // Bo góc cho ảnh nền
        overflow: 'hidden', // Cắt phần thừa
    },
    imageBackground: {
        width: '100%',
        justifyContent: 'center'
    },
    title: {
        fontSize: GLOBAL_KEYS.TEXT_SIZE_TITLE,
        fontWeight: 'bold',
        color: colors.white,
    },
    btnBEAN: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.overlay,
        padding: GLOBAL_KEYS.PADDING_DEFAULT,
        paddingVertical: GLOBAL_KEYS.PADDING_SMALL,
        gap: GLOBAL_KEYS.GAP_SMALL,
        borderBottomStartRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
        borderStartStartRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
        marginRight: -16
    },
    barCode: {
        backgroundColor: colors.white,
        paddingHorizontal: GLOBAL_KEYS.PADDING_DEFAULT,
        borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
        alignItems: 'center',
    },
    imgcode: {
        width: '100%',
        height: 70,
        resizeMode: 'contain',
    },
});
