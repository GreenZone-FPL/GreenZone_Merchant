import PropTypes from 'prop-types';
import React, { useState } from 'react';
import {
  Dimensions,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Linking
} from 'react-native';
import { Icon } from 'react-native-paper';
import { GLOBAL_KEYS, colors } from '../../constants';
import { PrimaryButton } from '../buttons/PrimaryButton';
import { NormalText } from '../texts/NormalText';
import { Row } from '../containers/Row';
import { Column } from '../containers/Column';
import { DialogBasic } from './DialogBasic';

const { width } = Dimensions.get('window');

const DialogReviewOderPropTypes = {
  isVisible: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  item: PropTypes.object,
};

const handlePress = () => {
  const phoneNumber = '0866158144';
  Linking.openURL(`tel:${phoneNumber}`).catch(err => console.error('Không thể gọi điện thoại', err));
};

export const DialogReviewOder = ({ isVisible, onHide, item }) => {
  if (!item) return null;

  const [voteRating, setVoteRating] = useState(false);
  const [defaultRating, setDefaultRating] = useState(0);

  const CustomRatingBar = () => (
    <View style={styles.ratingContainer}>
      {[1, 2, 3, 4, 5].map((rating, index) => (
        <TouchableOpacity
          key={index}
          activeOpacity={1}
          onPress={() => setDefaultRating(rating)}
        >
          <Icon
            source={defaultRating >= rating ? "star" : "star-outline"}
            size={35}
            color={colors.yellow500}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
  return (
    <DialogBasic isVisible={isVisible}
      onHide={onHide}
      title={'Trạng thái đơn hàng'}>
      <View style={styles.bgImage}>
        <Image
          source={require('../../assets/images/ic_coffee_cup.png')}
        />
      </View>


      <NormalText text='Thời gian giao dự kiến' />
      <Text style={styles.statusText}>Hoàn tất</Text>
      <Row style={styles.support}>
        <PrimaryButton title='Đánh giá' style={styles.btnSupport} onPress={() => setVoteRating(true)} />
        <PrimaryButton title='Gọi hỗ trợ' style={styles.btnSupport} onPress={handlePress} />
      </Row>


      <Text style={styles.detailText}>Thông tin đơn hàng</Text>
      <Row style={styles.detail}>
        <Column style={styles.column}>
          <NormalText text='Người nhận' />
          <Text>Nguyễn Văn A</Text>
        </Column>
        <Column style={{ paddingVertical: GLOBAL_KEYS.PADDING_SMALL }}>
          <NormalText text='Số điện thoại' />
          <Text>0987654321</Text>
        </Column>
      </Row>
      <NormalText text='đặt tại bàn' style={styles.detail} />
      <Column style={styles.detail}>
        <NormalText text='Trạng thái thanh toán:' />
        <Row>
          <NormalText text='PAID' style={styles.pay} />
          <Text>Đã thanh toán</Text>
        </Row>
      </Column>
      <Column style={styles.detail}>
        <NormalText text='Mã đơn hàng:' />
        <Text>I923422332234</Text>
      </Column>



      <Text style={styles.detailText}>Sản phẩm đã chọn</Text>
      <Row style={styles.row}>
        <NormalText text={item.title} />
        <NormalText text={item.price} />
      </Row>


      <Text style={styles.detailText}>Tổng cộng</Text>
      <Row style={styles.row}>
        <NormalText text='Thành tiền' />
        <NormalText text={item.price} />
      </Row>



      
      <Modal
        visible={voteRating}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setVoteRating(false)}>
        <View style={styles.voteRatingbgContainer}>
          <View style={styles.voteRatingContainer}>
            <View style={styles.header}>
              <View style={styles.placeholderIcon} />
              <Text style={styles.titleText}>Đánh giá dịch vụ</Text>
              <TouchableOpacity onPress={() => setVoteRating(false)}>
                <Icon
                  source="close"
                  size={GLOBAL_KEYS.ICON_SIZE_DEFAULT}
                  color={colors.primary}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.body}>
              <NormalText text='Tại cửa hàng'/>
              <Text style={styles.modalItemText}>{item.title}</Text>
              <CustomRatingBar />
              <PrimaryButton
                title="Gửi đánh giá"
                style={defaultRating === 0 ? { backgroundColor: colors.gray200 } : { backgroundColor: colors.primary }}
                onPress={() => {
                  if (defaultRating > 0) {
                    setVoteRating(false);
                  }
                }}
                disabled={defaultRating === 0}
              />
            </View>
          </View>
        </View>
      </Modal>

    </DialogBasic>
  );
};
DialogReviewOder.propTypes = DialogReviewOderPropTypes;
const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
    paddingBottom: 24,
  },
  titleText: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_HEADER,
    fontWeight: '600',
    color: colors.primary,
    textAlign: 'center',
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: GLOBAL_KEYS.PADDING_DEFAULT,
    borderBottomWidth: 2,
    borderBottomColor: colors.gray200,
    backgroundColor: colors.white,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  placeholderIcon: {
    width: GLOBAL_KEYS.ICON_SIZE_DEFAULT,
    height: GLOBAL_KEYS.ICON_SIZE_DEFAULT,
    backgroundColor: colors.transparent,
  },
  btnSupport: {
    width: width / 2.5,
  },
  modalItemText: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    color: colors.black,
    fontWeight: '700'
  },
  bgImage: {
    backgroundColor: colors.green100,
    width: '100%',
    alignItems: 'center',
    padding: GLOBAL_KEYS.PADDING_DEFAULT,
  },
  statusText: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_HEADER,
    fontWeight: '700',
  },
  support: {
    overflow: 'hidden',
    justifyContent: 'space-between',
    padding: GLOBAL_KEYS.PADDING_DEFAULT,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.gray200,
  },
  detailText: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_HEADER,
    fontWeight: '700',
    marginVertical: 12,
  },
  detail: {
    borderBottomWidth: 1,
    borderColor: colors.gray200,
    paddingVertical: GLOBAL_KEYS.PADDING_SMALL,
  },
  column: {
    borderEndWidth: 1,
    borderColor: colors.gray200,
    width: '50%',
  },
  pay: {
    color: colors.white,
    backgroundColor: colors.green500,
  },
  row: {
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: colors.gray200,
    paddingVertical: GLOBAL_KEYS.PADDING_SMALL,
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: GLOBAL_KEYS.GAP_DEFAULT,
    borderBottomWidth: 1,
    borderColor: colors.gray200,
    padding: GLOBAL_KEYS.PADDING_DEFAULT
  },
  voteRatingbgContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: colors.overlay,
  },
  voteRatingContainer: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: GLOBAL_KEYS.PADDING_DEFAULT,
  },
  body: {
    gap: GLOBAL_KEYS.GAP_DEFAULT
  },
});
