import {
  StyleSheet,
  Text,
  ScrollView,
  processColor,
  Pressable,
} from 'react-native';
import React, {useEffect, useState, useCallback} from 'react';
import {BarChart} from 'react-native-charts-wrapper';
import {colors, GLOBAL_KEYS} from '../../constants';
import {Column, Row} from '../../components';
import {Icon, Button} from 'react-native-paper';
import {getStatisticByYear} from '../../axios';
import {TextFormatter} from '../../utils';
import YearPicker from '../../constants/yearPicker/YearPicker';
import {useAppContext} from '../../context/appContext';
import {useFocusEffect} from '@react-navigation/native';
import DialogSelectVouchers from '../order/DialogSelectVouchers';

const StatisticsScreen = () => {
  const [statistics, setStatistics] = useState([]);
  const [totalOrders, setTotalOrders] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState([]);
  const [months, setMonths] = useState([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [modalVisible, setModalVisible] = useState(false);
  const [isTotalOrders, setIsTotalOrders] = useState(false);
  const {orderNew} = useAppContext();
  const currentMonth = new Date().getMonth();

  // Hàm lấy dữ liệu thống kê (dùng useCallback để tránh render lại không cần thiết)
  const getStatistics = useCallback(async selectedYear => {
    try {
      const response = await getStatisticByYear(selectedYear);
      if (response && response.monthlyData) {
        // console.log('Dữ liệu thống kê:', JSON.stringify(response, null, 2));
        setStatistics(response);
        setTotalRevenue(
          response.monthlyData.map(item => item.totalRevenue || 0),
        );
        setTotalOrders(response.monthlyData.map(item => item.totalOrders || 0));
        setMonths(response.monthlyData.map(item => `Tháng ${item.month}`));
      } else {
        console.warn('Dữ liệu rỗng hoặc không hợp lệ.');
        setTotalRevenue(Array(12).fill(0));
        setTotalOrders(Array(12).fill(0));
        setMonths(Array(12).fill('-'));
      }
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu thống kê:', error);
    }
  }, []);

  useEffect(() => {
    getStatistics(year);
  }, [year, orderNew, getStatistics]);

  useFocusEffect(
    useCallback(() => {
      getStatistics(year);
    }, [year, getStatistics]),
  );
  const handleSelectYear = selectedYear => {
    setYear(selectedYear);
  };

  // Dữ liệu cho biểu đồ cột
  const data = {
    dataSets: [
      {
        values: isTotalOrders ? totalOrders : totalRevenue,
        label: `Doanh số ${year}`,
        config: {
          colors: Array(12).fill(processColor(colors.green200)),
          barShadowColor: processColor(colors.black),
          highlightAlpha: 90,
          highlightColor: processColor('red'),
          borderRadius: 8,
          valueTextSize: 14,
          valueTextColor: processColor(colors.black),
          valueFormatter: '#',
        },
      },
    ],
    config: {barWidth: 0.6},
  };

  // Đổi màu cột tháng hiện tại
  if (data.dataSets[0].values[currentMonth] !== undefined) {
    data.dataSets[0].config.colors[currentMonth] = processColor(colors.primary);
  }

  // Cấu hình trục X
  const xAxis = {
    valueFormatter: months,
    granularityEnabled: true,
    granularity: 1,
    position: 'BOTTOM',
    drawGridLines: false,
    textColor: processColor(colors.black),
    textSize: 14,
  };

  // Lấy doanh thu hoặc số đơn hàng của tháng hiện tại và tháng trước
  const currentValue = isTotalOrders
    ? totalOrders[currentMonth] || 0
    : totalRevenue[currentMonth] || 0;

  const previousValue =
    currentMonth > 0
      ? isTotalOrders
        ? totalOrders[currentMonth - 1] || 0
        : totalRevenue[currentMonth - 1] || 0
      : 0;

  // Tính toán tỷ lệ thay đổi
  const valueChange = previousValue
    ? ((currentValue - previousValue) / previousValue) * 100
    : 0;
  const isIncrease = valueChange > 0;

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.container}>
      {/* Chọn năm */}
      <Pressable
        style={styles.buttonPressable}
        onPress={() => setModalVisible(true)}>
        <Text style={styles.title}>Biểu Đồ Doanh Số Cả Năm {year}</Text>
        <Icon source={'arrow-down-drop-circle-outline'} size={20} />
      </Pressable>
      {/* Biểu đồ cột */}
      <BarChart
        style={styles.chart}
        data={data}
        xAxis={xAxis}
        animation={{durationX: 1500}}
        chartDescription={{text: ''}}
        drawValueAboveBar
        yAxis={{left: {axisMinimum: 0, textSize: 14}, right: {enabled: false}}}
        marker={{
          enabled: true,
          markerColor: processColor(colors.green500),
          textColor: processColor(colors.black),
          textSize: 14,
        }}
        drawRoundedBar
        legend={{enabled: false}}
      />
      {/* Thông tin tổng quan */}
      <Column style={styles.card}>
        <Text style={styles.cardTitle}>
          {isTotalOrders ? 'Tổng Số Đơn Cả Năm' : 'Tổng Doanh Thu Cả Năm'}
        </Text>
        <Text style={styles.cardValue}>
          {isTotalOrders
            ? `${totalOrders.reduce((sum, value) => sum + value, 0)} Đơn`
            : TextFormatter.formatCurrency(
                totalRevenue.reduce((sum, value) => sum + value, 0) || 0,
              )}
        </Text>
        <Text style={styles.cardTitle}>
          {isTotalOrders ? 'Số Đơn Tháng Hiện Tại' : 'Doanh Thu Tháng Hiện Tại'}
        </Text>
        <Text style={styles.cardValue}>
          {isTotalOrders
            ? `${currentValue} Đơn`
            : TextFormatter.formatCurrency(currentValue)}
        </Text>
        {/* Only render the "So với tháng trước" section if current month has valid data */}
        {currentValue > 0 && currentMonth > 0 ? (
          <>
            <Text style={styles.cardTitle}>So với tháng trước</Text>
            <Row style={{gap: 8}}>
              <Icon
                source={
                  isIncrease ? 'chevron-up-circle' : 'chevron-down-circle'
                }
                size={20}
                color={isIncrease ? colors.primary : colors.red900}
              />
              <Text
                style={[
                  styles.cardValue,
                  !isIncrease && {color: colors.red900},
                ]}>
                {valueChange.toFixed(2)}%
              </Text>
            </Row>
          </>
        ) : null}
        {/* Don't render anything if current month's data is invalid */}
        <Pressable
          style={styles.buttonPressable2}
          onPress={() => setIsTotalOrders(!isTotalOrders)}>
          <Text style={styles.textButton}>
            {isTotalOrders ? 'Doanh Thu' : 'Số Đơn'}
          </Text>
        </Pressable>
      </Column>
      <YearPicker
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        onSelectYear={handleSelectYear}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: colors.white,
    padding: 20,
    justifyContent: 'center',
  },
  closeButton: {backgroundColor: colors.green100, alignSelf: 'flex-end'},
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  chart: {height: 350},
  card: {
    margin: 20,
    backgroundColor: colors.white,
    padding: 20,
    borderRadius: 12,
    elevation: 1.5,
    shadowColor: colors.black,
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: {width: 0, height: 4},
  },
  cardTitle: {fontSize: GLOBAL_KEYS.TEXT_SIZE_TITLE, color: colors.black},
  cardValue: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_TITLE,
    fontWeight: '700',
    color: colors.primary,
  },
  buttonPressable: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonPressable2: {
    position: 'absolute',
    end: 0,
    top: '50%',
    end: 20,
    backgroundColor: colors.primary,
    padding: 10,
    borderRadius: 10,
    minWidth: 120,
  },
  textButton: {
    fontSize: 20,
    color: colors.white,
    textAlign: 'center',
  },
});

export default StatisticsScreen;
