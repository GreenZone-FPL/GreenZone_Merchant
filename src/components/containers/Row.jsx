import { StyleSheet, View } from 'react-native';
import React from 'react';
import PropTypes from 'prop-types';
import { GLOBAL_KEYS } from '../../constants';


const RowPropTypes = {
    children: PropTypes.node,
    style: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.array,
    ]),
};
export const Row = ({ children, style }) => {
    return (
        <View style={[styles.row, style]}>
            {children}
        </View>
    );
};



Row.propTypes = RowPropTypes



const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: GLOBAL_KEYS.GAP_SMALL, 
    },
});
