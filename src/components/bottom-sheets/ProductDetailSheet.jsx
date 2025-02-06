import React, { useState } from 'react';
import { View, StyleSheet, Image, Text, ScrollView, Pressable, StatusBar , Button} from 'react-native';
import { IconButton, Icon } from 'react-native-paper';

import { NotesList, RadioGroup, OverlayStatusBar, SelectableGroup, CheckoutFooter } from '../../components'
import { colors, GLOBAL_KEYS } from '../../constants';
import { DialogBasic } from '../../components';
import ImageViewer from 'react-native-image-zoom-viewer';
import { ShoppingGraph } from '../../layouts/graphs';


export const ProductDetailSheet = (props) => {

    const { navigation } = props;
    const [showFullDescription, setShowFullDescription] = useState(false);

    const [selectedSize, setSelectedSize] = useState('');
    const [selectedSugarLevel, setSelectedSugarLevel] = useState('');
    const [selectedIceLevel, setSelectedIceLevel] = useState('');
    const [selectedGroup, setSelectedGroup] = useState([]);
    const [selectedNotes, setSelectedNotes] = useState([]);
    const [quantity, setQuantity] = useState(1); // Số lượng sản phẩm



    const totalPrice = quantity * product.price; // Tính tổng tiền
    return (
        <View style={styles.modalContainer}>
            <OverlayStatusBar />
            <ScrollView style={styles.modalContent}>
                <ProductImage hideModal={() => navigation.goBack()} />

                <ProductInfo
                    product={product}
                    addToFavorite={() => { }}
                    showFullDescription={showFullDescription}
                    toggleDescription={() => { setShowFullDescription(!showFullDescription); }}
                />

                <RadioGroup
                    items={product.sizes}
                    selectedValue={selectedSize}
                    onValueChange={setSelectedSize}
                    title="Size"
                    required={true}
                    note="Bắt buộc"
                />

                <RadioGroup
                    items={product.sugarLevels}
                    selectedValue={selectedSugarLevel}
                    onValueChange={setSelectedSugarLevel}
                    title="Chọn mức đường"
                    required={true}
                />

                <RadioGroup
                    items={product.iceLevels}
                    selectedValue={selectedIceLevel}
                    onValueChange={setSelectedIceLevel}
                    title="Chọn mức đá"
                    required={true}
                />

                <SelectableGroup
                    items={product.toppings}
                    title='Chọn topping'
                    selectedGroup={selectedGroup}
                    setSelectedGroup={setSelectedGroup}
                    note="Tối đa 3 toppings"
                    activeIconColor={colors.primary}
                    activeTextColor={colors.primary}
                />

                <NotesList
                    title='Lưu ý cho quán'
                    items={notes}
                    selectedNotes={selectedNotes}
                    onToggleNote={(note) => {
                        if (selectedNotes.includes(note)) {
                            setSelectedNotes(selectedNotes.filter((item) => item !== note));
                        } else {
                            setSelectedNotes([...selectedNotes, note]);
                        }
                    }}

                    style={{ paddingHorizontal: GLOBAL_KEYS.PADDING_DEFAULT }}
                />
            </ScrollView>

            <CheckoutFooter
                quantity={quantity}
                handlePlus={() => {
                    if (quantity < 10) {
                        setQuantity(quantity + 1)
                    }
                }}
                handleMinus={() => {
                    if (quantity > 1) {
                        setQuantity(quantity - 1)
                    }
                }}
                totalPrice={68000}
                onButtonPress={() => navigation.navigate(ShoppingGraph.CheckoutScreen)}
                buttonTitle='Thêm vào giỏ hàng'
            />
        </View>
    );
};

const product = {
    id: '1',
    name: 'Trà Sữa Trân Châu Hoàng Kim',
    description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book',
    image: require('../../assets/images/product1.png'),
    sizes: [
        { id: 'S', name: 'S', price: 10000, discount: 500, available: true },
        { id: 'M', name: 'M', price: 15000, discount: 1000, available: true },
        { id: 'L', name: 'L', price: 20000, discount: 1500, available: false },
    ],
    toppings: [
        { id: '1', name: 'Trân châu đen', price: 5000 },
        { id: '2', name: 'Thạch dừa', price: 7000 },
        { id: '3', name: 'Kem cheese', price: 10000 },
        { id: '4', name: 'Hạt dẻ', price: 8000 },
        { id: '5', name: 'Sương sáo', price: 6000 },
        { id: '6', name: 'Trân châu trắng', price: 7000 },
    ],
    iceLevels: [
        { id: '1', name: '100% đá', value: '100%' },
        { id: '2', name: '50% đá', value: '50%' },
        { id: '3', name: 'Không đá', value: '0%' },
    ],
    sugarLevels: [
        { id: '1', name: 'Ngọt bình thường', value: '100%' },
        { id: '2', name: 'Ít ngọt', value: '50%' },
        { id: '3', name: 'Không đường', value: '0%' },
    ],
    isFavorite: true,
};

const notes = ['Ít cafe', 'Đậm trà', 'Không kem', 'Nhiều cafe', 'Ít sữa', 'Nhiều sữa', 'Nhiều kem']


const ProductImage = ({ hideModal}) => {
    const [isDialogVisible, setIsDialogVisible] = useState(false);
    const images = [
        {
          url: '', 
          props: {
            source: require('../../assets/images/product1.png'),
          },
        },
      ];
    return (
      <View style={styles.imageContainer}>
        <Pressable onPress={() => setIsDialogVisible(true)}>
          <Image
            source={require('../../assets/images/product1.png')}
            style={styles.productImage}
            onError={() => console.error('Failed to load image')}
          />
        </Pressable>
        <IconButton
          icon="close"
          size={GLOBAL_KEYS.ICON_SIZE_SMALL}
          iconColor={colors.primary}
          style={styles.closeButton}
          onPress={hideModal}
        />
        <DialogBasic
          isVisible={isDialogVisible}
          onHide={() => setIsDialogVisible(false)}
          style={styles.height}
        >
          <View style={styles.imageZoomContainer}>
            <ImageViewer imageUrls={images} renderIndicator={() => null}/>
          </View>
        </DialogBasic>
      </View>
    );
  };

const ProductInfo = ({ product, addToFavorite, showFullDescription, toggleDescription }) => (
    <View style={styles.infoContainer}>
        {/* Product Name and Favorite Icon */}
        <View style={styles.horizontalView}>
            <Text
                style={styles.productName}
                numberOfLines={2}
                ellipsizeMode="tail"
            >
                Trà Sữa Trân Châu Hoàng Kim - Vị thơm ngon đặc biệt không thể bỏ lỡ!
            </Text>
            <Pressable onPress={addToFavorite}>
                <Icon
                    source={product.isFavorite ? "heart" : "heart-outline"}
                    color={product.isFavorite ? colors.primary : colors.gray700}
                    size={GLOBAL_KEYS.ICON_SIZE_DEFAULT}
                />
            </Pressable>
        </View>

        {/* Product Description */}
        <View style={styles.descriptionContainer}>
            <Text
                style={styles.descriptionText}
                numberOfLines={showFullDescription ? undefined : 2}
                ellipsizeMode="tail">
                {product.description}
            </Text>
            <Pressable style={styles.textButton} onPress={toggleDescription}>
                <Text style={styles.textButtonLabel}>
                    {showFullDescription ? 'Thu gọn' : 'Xem thêm'}
                </Text>
            </Pressable>
        </View>
    </View>
);
const styles = StyleSheet.create({
    modalContainer: {
        backgroundColor: colors.overlay,
        flex: 1,
        width: '100%',

    },
    modalContent: {
        width: '100%',
        backgroundColor: colors.white,
        flexDirection: 'column',
        gap: GLOBAL_KEYS.GAP_SMALL,
        marginTop: StatusBar.currentHeight + 40,
        flexDirection: 'column',
        flex: 1,

    },
    imageContainer: {
        position: 'relative',
        width: '100%',
        height: 300,
    },
    productImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'stretch'
    },
    closeButton: {
        position: 'absolute',
        top: GLOBAL_KEYS.PADDING_DEFAULT,
        right: GLOBAL_KEYS.PADDING_DEFAULT,
        backgroundColor: colors.green100,
    },
    zoomButton: {
        position: 'absolute',
        bottom: GLOBAL_KEYS.PADDING_DEFAULT,
        left: GLOBAL_KEYS.PADDING_DEFAULT,
        backgroundColor: colors.green100,
    },
    horizontalView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: GLOBAL_KEYS.PADDING_SMALL,
        paddingHorizontal: GLOBAL_KEYS.PADDING_DEFAULT
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    column: {
        flexDirection: 'column',
        paddingHorizontal: GLOBAL_KEYS.PADDING_DEFAULT
    },
    productName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.black,
        flex: 1,
        marginRight: 8,
        lineHeight: GLOBAL_KEYS.LIGHT_HEIGHT_DEFAULT,
    },
    descriptionContainer: {
        paddingHorizontal: GLOBAL_KEYS.PADDING_DEFAULT
    },
    descriptionText: {
        fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
        color: colors.gray700,
        lineHeight: GLOBAL_KEYS.LIGHT_HEIGHT_DEFAULT,
        textAlign: 'justify'
    },
    title: {
        fontWeight: 'bold',
        paddingHorizontal: GLOBAL_KEYS.PADDING_DEFAULT
    },
    textButton: {
        alignSelf: 'flex-start',
        paddingVertical: 4,
    },
    redText: {
        color: colors.red800
    },
    textButtonLabel: {
        fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
        color: colors.teal900,
    },

    radioGroup: {
        paddingHorizontal: GLOBAL_KEYS.PADDING_SMALL
    },
    toppingList: {
        paddingHorizontal: GLOBAL_KEYS.PADDING_DEFAULT,
        gap: GLOBAL_KEYS.GAP_SMALL,
        flexDirection: 'column'
    },
    toppingItem: {
        marginBottom: GLOBAL_KEYS.PADDING_SMALL,
    },
    footer: {
        padding: 16,
        elevation: 5,
        backgroundColor: colors.white
    },
    infoContainer: {
        flexDirection: 'column',
        marginBottom: 8,
    },
    quantityInfoText: {
        fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
        color: colors.black,
    },
    totalText: {
        fontSize: GLOBAL_KEYS.TEXT_SIZE_TITLE,
        fontWeight: 'bold',
        color: colors.primary,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    quantityText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: colors.black,
        marginHorizontal: 8,
    },
    height:{
        height: '100%',
        backgroundColor: '#000'
    },
    imageZoomContainer:{
        height: 800, 
    }
});