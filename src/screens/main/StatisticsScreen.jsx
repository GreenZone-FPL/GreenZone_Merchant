import { StyleSheet, Text, View, ScrollView, processColor } from 'react-native';
import React from 'react';
import { BarChart } from 'react-native-charts-wrapper';
import { colors, GLOBAL_KEYS } from '../../constants';
import { Column } from '../../components';

const StatisticsScreen = () => {
    const currentMonth = new Date().getMonth(); // Lấy tháng hiện tại

    const data = {
        dataSets: [
            {
                values: [120, 150, 180, 210, 250, 300, 280, 260, 240, 220, 200, 190],
                label: 'Doanh số 2024',
                config: {
                    colors: Array(12).fill(processColor(colors.green200)), // Màu mặc định cho các tháng
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

    // Đặt màu tháng hiện tại là màu primary
    data.dataSets[0].config.colors[currentMonth] = processColor(colors.primary);

    // Cấu hình cho legend: chỉ có 2 ô vuông, một cho tháng hiện tại và một cho các tháng còn lại
    const legendData = [
        {
            label: 'Tháng hiện tại',
            color: processColor(colors.primary),
        },
        {
            label: 'Các tháng còn lại',
            color: processColor(colors.green200),
        },
    ];

    const xAxis = {
        valueFormatter: [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ],
        granularityEnabled: true,
        granularity: 1,
        position: 'BOTTOM',
        drawGridLines: false,
        textColor: processColor(colors.black),
        textSize: 12,
    };

    // Tính tổng doanh thu cả năm
    const totalRevenue = data.dataSets[0].values.reduce((acc, value) => acc + value, 0);

    // Doanh thu tháng hiện tại
    const currentMonthRevenue = data.dataSets[0].values[currentMonth];

    // Doanh thu tháng trước
    const previousMonthRevenue = currentMonth > 0 ? data.dataSets[0].values[currentMonth - 1] : 0;

    // Tính phần trăm thay đổi giữa tháng hiện tại và tháng trước
    const revenueChange = previousMonthRevenue !== 0
        ? ((currentMonthRevenue - previousMonthRevenue) / previousMonthRevenue) * 100
        : 0;

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Biểu Đồ Doanh Số Cả Năm 2024</Text>
            <BarChart
                style={styles.chart}
                data={data}
                xAxis={xAxis}
                animation={{ durationX: 1500 }}
                legend={{
                    enabled: false,
                    textSize: 12,
                    form: 'SQUARE',
                    formSize: 20,
                    formToTextSpace: 10,
                    wordWrapEnabled: true,
                    textColor: processColor(colors.black),
                    entries: legendData,
                }}
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

            {/* Thêm view thể hiện thông tin doanh thu dưới dạng card */}
            <Column style={styles.card}>
                <Text style={styles.cardTitle}>Tổng Doanh Thu Cả Năm</Text>
                <Text style={styles.cardValue}>{totalRevenue} VNĐ</Text>

                <Text style={styles.cardTitle}>Doanh Thu Tháng Hiện Tại</Text>
                <Text style={styles.cardValue}>{currentMonthRevenue} VNĐ</Text>

                <Text style={styles.cardTitle}>
                    {currentMonth > 0 ? 'So với tháng trước' : 'Tháng trước không có dữ liệu'}
                </Text>
                <Text style={styles.cardValue}>
                    {currentMonth > 0 ? `${revenueChange.toFixed(2)}%` : '-'}
                </Text>
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
        marginTop: 20,
        backgroundColor: colors.white,
        padding: 20,
        borderRadius: 12,
        elevation: 5, // Tạo hiệu ứng đổ bóng
        shadowColor: colors.black, // Màu bóng đổ
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
        marginBottom: 16,
    },
});

export default StatisticsScreen;
