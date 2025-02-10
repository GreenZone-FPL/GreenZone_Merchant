import { StyleSheet, Text, View, ScrollView, processColor } from 'react-native';
import React from 'react';
import { BarChart } from 'react-native-charts-wrapper';
import { colors, GLOBAL_KEYS } from '../../constants';
import { Column, Row } from '../../components';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Icon } from 'react-native-paper';
const StatisticsScreen = () => {
    const currentMonth = new Date().getMonth();

    const data = {
        dataSets: [
            {
                values: [160, 150, 180, 210, 250, 300, 280, 260, 240, 220, 200, 190],
                label: 'Doanh số 2024',
                config: {
                    colors: Array(12).fill(processColor(colors.green200)),
                    barShadowColor: processColor(colors.black),
                    highlightAlpha: 90,
                    highlightColor: processColor('red'),
                    borderRadius: 8,
                    valueTextSize: 12,
                    valueTextColor: processColor(colors.black),
                    valueFormatter: "#",
                },
            },
        ],
        config: {
            barWidth: 0.6,
        },
    };

    data.dataSets[0].config.colors[currentMonth] = processColor(colors.primary);

    const xAxis = {
        valueFormatter: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        granularityEnabled: true,
        granularity: 1,
        position: 'BOTTOM',
        drawGridLines: false,
        textColor: processColor(colors.black),
        textSize: 12,
    };

    const totalRevenue = data.dataSets[0].values.reduce((acc, value) => acc + value, 0);
    const currentMonthRevenue = data.dataSets[0].values[currentMonth];
    const previousMonthRevenue = currentMonth > 0 ? data.dataSets[0].values[currentMonth - 1] : 0;

    const revenueChange = previousMonthRevenue !== 0
        ? ((currentMonthRevenue - previousMonthRevenue) / previousMonthRevenue) * 100
        : 0;

    const isIncrease = revenueChange > 0;

    return (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
            <Text style={styles.title}>Biểu Đồ Doanh Số Cả Năm 2024</Text>
            <BarChart
                style={styles.chart}
                data={data}
                xAxis={xAxis}
                animation={{ durationX: 1500 }}
                chartDescription={{ text: '' }}
                drawValueAboveBar={true}
                yAxis={{
                    left: { axisMinimum: 0, textSize: 12 },
                    right: { enabled: false },
                }}
                marker={{
                    enabled: true,
                    markerColor: processColor(colors.milk),
                    textColor: processColor(colors.black),
                    textSize: 14,
                }}
                drawRoundedBar={true}
            />

            <Column style={styles.card}>
                <Text style={styles.cardTitle}>Tổng Doanh Thu Cả Năm</Text>
                <Text style={styles.cardValue}>{totalRevenue} VNĐ</Text>

                <Text style={styles.cardTitle}>Doanh Thu Tháng Hiện Tại</Text>
                <Text style={styles.cardValue}>{currentMonthRevenue} VNĐ</Text>

                <Text style={styles.cardTitle}>
                    {currentMonth > 0 ? 'So với tháng trước' : 'Tháng trước không có dữ liệu'}
                </Text>
                {currentMonth > 0 ? (
                    <Row style={{ gap: 8 }}>
                        <Icon
                            source={isIncrease ? 'chevron-up-circle' : 'chevron-down-circle'}
                            size={20}
                            color={isIncrease ? colors.primary : colors.red900}
                        />
                        <Text style={[
                            styles.cardValue,
                            !isIncrease && { color: colors.red900 }
                        ]}>
                            {revenueChange.toFixed(2)}%
                        </Text>
                    </Row>
                ) : (
                    <Text style={styles.cardValue}>-</Text>
                )}
            </Column>
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
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    chart: {
        height: 350,
    },
    card: {
        margin: 20,
        backgroundColor: colors.white,
        padding: 20,
        borderRadius: 12,
        elevation: 4,
        shadowColor: colors.black,
        shadowOpacity: 0.1,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
    },
    cardTitle: {
        fontSize: GLOBAL_KEYS.TEXT_SIZE_TITLE,
        fontWeight: 'bold',
        color: colors.black,
        marginBottom: 8,
    },
    cardValue: {
        fontSize: GLOBAL_KEYS.TEXT_SIZE_TITLE,
        color: colors.primary,
        // marginBottom: 16,
    },
    revenueChangeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});

export default StatisticsScreen;
