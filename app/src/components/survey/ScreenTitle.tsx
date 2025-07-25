import { colors } from '@/utils/colors';
import React from 'react';
import Text from '../../components/MyText';

import { StyleSheet } from 'react-native';


export default function ScreenTitle({ children }: { children: React.ReactNode }) {
    return <Text style={styles.screenTitle}>{children}</Text>;
}

const styles = StyleSheet.create({
    screenTitle: {
        color: colors.BLUE,
        fontSize: 22,
        marginBottom: 26,
        fontWeight: '700',
    },
});