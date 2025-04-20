import * as React from 'react';
import PropTypes from 'prop-types';
import { View, FlatList } from 'react-native';
import { OverlayStatusBar } from '../status-bars/OverlayStatusBar';
import { Dialog, Portal, Button, Text, PaperProvider, List } from 'react-native-paper';
import { GLOBAL_KEYS, colors } from '../../constants';

export const ActionDialog = ({
    visible,
    title,
    content,
    onCancel,
    onApprove,
    cancelText,
    approveText,
}) => {
    return (
        <Portal>

            <Dialog
                style={{ borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT, backgroundColor: colors.white }}
                dismissable={false}
                visible={visible}
            >
                <OverlayStatusBar />

                {title && <Dialog.Title>{title}</Dialog.Title>}

                <Dialog.Content>
                    {typeof content === 'string' ? <Text>{content}</Text> : content}
                </Dialog.Content>

                <Dialog.Actions>
                    {onCancel && <Button onPress={onCancel}>{cancelText}</Button>}
                    {onApprove && <Button onPress={onApprove}>{approveText}</Button>}
                </Dialog.Actions>

            </Dialog>
        </Portal>
    );
};

ActionDialog.propTypes = {
    visible: PropTypes.bool.isRequired,
    title: PropTypes.string,
    content: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
    onCancel: PropTypes.func,
    onApprove: PropTypes.func,
    cancelText: PropTypes.string,
    approveText: PropTypes.string,
};


const ExampleScreen = () => {
    const [products, setProducts] = React.useState([
        { id: '1', name: 'Sản phẩm A' },
        { id: '2', name: 'Sản phẩm B' },
        { id: '3', name: 'Sản phẩm C' },
    ]);
    const [dialogVisible, setDialogVisible] = React.useState(false);
    const [selectedProduct, setSelectedProduct] = React.useState(null);

    // Mở dialog với sản phẩm cần xóa
    const confirmDelete = (product) => {
        setSelectedProduct(product);
        setDialogVisible(true);
    };

    // Xóa sản phẩm sau khi xác nhận
    const deleteProduct = () => {
        setProducts((prevProducts) => prevProducts.filter(p => p.id !== selectedProduct.id));
        setDialogVisible(false);
    };

    return (
        <PaperProvider>
            <View style={{ padding: 20, flex: 1 }}>
                <FlatList
                    data={products}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <List.Item
                            title={item.name}
                            right={() => (
                                <Button onPress={() => confirmDelete(item)} textColor="red">
                                    Xóa
                                </Button>
                            )}
                        />
                    )}
                />

                <ActionDialog
                    visible={dialogVisible}
                    title="Xác nhận xóa"
                    content={`Bạn có chắc chắn muốn xóa "${selectedProduct?.name}"?`}
                    cancelText="Hủy"
                    approveText="Xóa"
                    onCancel={() => setDialogVisible(false)}
                    onApprove={deleteProduct}
                />


            </View>
        </PaperProvider>
    );
};

export default ExampleScreen;
