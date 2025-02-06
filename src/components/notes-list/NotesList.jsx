import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { GLOBAL_KEYS, colors } from '../../constants';

export const NotesList = ({
  title = "Danh sách ghi chú",
  items,
  selectedNotes,
  onToggleNote,
  style
}) => {
  // Chia items thành các nhóm có số lượng là 4 (cho grid 4 cột)
  const chunkedItems = [];
  for (let i = 0; i < items.length; i += 4) {
    chunkedItems.push(items.slice(i, i + 4));
  }

  return (
    <View style={[styles.noteView, style]}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.gridContainer}>
        {chunkedItems.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((item, itemIndex) => (
              <TouchableOpacity
                key={itemIndex}
                style={[
                  styles.noteItem,
                  selectedNotes.includes(item) && { backgroundColor: colors.green500 }
                ]}
                onPress={() => onToggleNote(item)}
              >
                <Text style={styles.noteText}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>
    </View>
  );
};

const notes = ['Ít cafe', 'Đậm trà', 'Không kem', 'Nhiều cafe', 'Ít sữa', 'Nhiều sữa', 'Nhiều kem'];

const styles = StyleSheet.create({
  noteView: {
    backgroundColor: colors.white,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
    gap: 8,
    marginVertical: GLOBAL_KEYS.PADDING_SMALL,
  },
  title: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_TITLE,
    fontWeight: 'bold',
    color: colors.black,
  },
  gridContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  noteItem: {
    backgroundColor: colors.white,
    paddingHorizontal: 4,
    paddingVertical: 4,
    margin: 4,
    borderRadius: GLOBAL_KEYS.BORDER_RADIUS_DEFAULT,
    elevation: 3,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noteText: {
    fontSize: GLOBAL_KEYS.TEXT_SIZE_DEFAULT,
    color: colors.black,
    textAlign: 'center',
  },
});


