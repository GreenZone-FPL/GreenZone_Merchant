import {
  StyleSheet,
  Text,
  ScrollView,
  processColor,
  Pressable,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {BarChart} from 'react-native-charts-wrapper';
import {colors, GLOBAL_KEYS} from '../../constants';
import {Column, Row} from '../../components';
import {Icon} from 'react-native-paper';
import {getStatisticByYear} from '../../axios';
import {TextFormatter} from '../../utils';
import YearPicker from '../../constants/yearPicker/YearPicker';

const StatisticsScreen = ({navigation}) => {
  const [statistics, setStatistics] = useState([]);
  const [totalOrders, setTotalOrders] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState([]);
  const [months, setMonths] = useState([]);
  const [year, setYear] = useState(2025);
  const [modalVisible, setModalVisible] = useState(false);
  const [isTotalOrders, setIsTotalOrders] = useState(false);

  useEffect(() => {
    const getStatistics = async year => {
      try {
        const response = await getStatisticByYear(year);
        if (response) {
          console.log('Dữ liệu thống kê:', JSON.stringify(response, null, 2));
          setStatistics(response);
          setTotalRevenue(response.monthlyData.map(item => item.totalRevenue));
          setTotalOrders(response.monthlyData.map(item => item.totalOrders));
          setMonths(response.monthlyData.map(item => `Tháng ${item.month}`));
        }
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu thống kê:', error);
      }
    };

    getStatistics(year);
  }, [year]);

  const handleSelectYear = year => {
    setYear(year);
  };

  const currentMonth = new Date().getMonth();
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

  data.dataSets[0].config.colors[currentMonth] = processColor(colors.primary);

  const xAxis = {
    valueFormatter: months,
    granularityEnabled: true,
    granularity: 1,
    position: 'BOTTOM',
    drawGridLines: false,
    textColor: processColor(colors.black),
    textSize: 14,
  };

  // Lấy doanh thu tháng hiện tại và tháng trước
  const totalRevenueCurrentMonth = data.dataSets[0].values[currentMonth];
  const totalRevenuePreviousMonth =
    currentMonth > 0 ? data.dataSets[0].values[currentMonth - 1] : 0;

  // Tính tỷ lệ thay đổi giữa tháng hiện tại và tháng trước
  const revenueChange = totalRevenuePreviousMonth
    ? ((totalRevenueCurrentMonth - totalRevenuePreviousMonth) /
        totalRevenuePreviousMonth) *
      100
    : 0;
  const isIncrease = revenueChange > 0;

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.container}>
      <Pressable
        style={styles.buttonPressable}
        onPress={() => setModalVisible(true)}>
        <Text style={styles.title}>Biểu Đồ Doanh Số Cả Năm {year}</Text>
        <Icon source={'arrow-down-drop-circle-outline'} size={20} />
      </Pressable>

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

      <Column style={styles.card}>
        <Text style={styles.cardTitle}>
          {isTotalOrders ? 'Tổng Số Đơn Cả Năm' : 'Tổng Doanh Thu Cả Năm'}
        </Text>
        <Text style={styles.cardValue}>
          {isTotalOrders
            ? `${totalRevenueCurrentMonth} Đơn`
            : TextFormatter.formatCurrency(totalRevenueCurrentMonth || 0)}
        </Text>

        <Text style={styles.cardTitle}>
          {isTotalOrders
            ? 'Tổng Số Đơn Trong Tháng'
            : 'Doanh Thu Tháng Hiện Tại'}
        </Text>
        <Text style={styles.cardValue}>
          {isTotalOrders
            ? `${totalRevenueCurrentMonth} Đơn`
            : TextFormatter.formatCurrency(totalRevenueCurrentMonth || 0)}
        </Text>

        <Text style={styles.cardTitle}>
          {currentMonth > 0
            ? 'So với tháng trước'
            : 'Tháng trước không có dữ liệu'}
        </Text>

        {currentMonth > 0 ? (
          <Row style={{gap: 8}}>
            <Icon
              source={isIncrease ? 'chevron-up-circle' : 'chevron-down-circle'}
              size={20}
              color={isIncrease ? colors.primary : colors.red900}
            />
            <Text
              style={[styles.cardValue, !isIncrease && {color: colors.red900}]}>
              {revenueChange.toFixed(2)}%
            </Text>
          </Row>
        ) : (
          <Text style={styles.cardValue}>-</Text>
        )}

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
