import React, {useState} from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import AppHeader from '../../components/AppHeader';
import StudentCard from '../../components/StudentCard';
import {mockRoute, mockStudents} from '../../constants/mockData';
import {Student} from '../../types/driver';
import colors from '../../theme/colors';
import {shadows} from '../../theme/tokens';

const RouteStudentsScreen: React.FC = () => {
  const [students, setStudents] = useState<Student[]>(mockStudents);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | 'WAITING' | 'BOARDED'>('ALL');

  const handleToggleStatus = (studentId: string) => {
    setStudents(prev =>
      prev.map(s =>
        s.id === studentId
          ? {
              ...s,
              status: s.status === 'BOARDED' ? 'WAITING' : 'BOARDED',
            }
          : s,
      ),
    );
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.rollNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.stopName.toLowerCase().includes(searchQuery.toLowerCase());

    if (selectedFilter === 'BOARDED') return matchesSearch && student.status === 'BOARDED';
    if (selectedFilter === 'WAITING') return matchesSearch && student.status === 'WAITING';
    return matchesSearch;
  });

  const boardedCount = students.filter(s => s.status === 'BOARDED').length;
  const totalCount = students.length;

  return (
    <SafeAreaView style={styles.safeArea}>
      <AppHeader title="Route & Students" subtitle={mockRoute.routeName} />

      <View style={styles.container}>
        {/* Route Summary Stats Card */}
        <View style={[styles.summaryCard, shadows.soft]}>
          <View style={styles.summaryRow}>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>{mockRoute.totalStops}</Text>
              <Text style={styles.statLabel}>Total Stops</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>{totalCount}</Text>
              <Text style={styles.statLabel}>Registered</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.statBox}>
              <Text style={[styles.statNumber, {color: colors.success}]}>
                {boardedCount}
              </Text>
              <Text style={styles.statLabel}>Boarded</Text>
            </View>
          </View>
        </View>

        {/* Search Input */}
        <View style={styles.searchRow}>
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search by student name, roll no, or stop..."
            placeholderTextColor={colors.textMuted}
            style={styles.searchInput}
          />
        </View>

        {/* Filter Chips */}
        <View style={styles.filterRow}>
          {(['ALL', 'WAITING', 'BOARDED'] as const).map(filter => {
            const isActive = selectedFilter === filter;
            return (
              <Pressable
                key={filter}
                onPress={() => setSelectedFilter(filter)}
                style={[
                  styles.filterChip,
                  isActive && styles.filterChipActive,
                ]}>
                <Text
                  style={[
                    styles.filterChipText,
                    isActive && styles.filterChipTextActive,
                  ]}>
                  {filter === 'ALL'
                    ? `All (${students.length})`
                    : filter === 'WAITING'
                    ? `Waiting (${students.filter(s => s.status === 'WAITING').length})`
                    : `Boarded (${boardedCount})`}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Student List */}
        <FlatList
          data={filteredStudents}
          keyExtractor={item => item.id}
          renderItem={({item}) => (
            <StudentCard student={item} onToggleStatus={handleToggleStatus} />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <Text style={styles.emptyText}>No students match filter criteria.</Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  summaryCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    marginBottom: 14,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    color: colors.primary,
    fontSize: 20,
    fontWeight: '800',
  },
  statLabel: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  divider: {
    width: 1,
    height: 28,
    backgroundColor: colors.border,
  },
  searchRow: {
    marginBottom: 12,
  },
  searchInput: {
    height: 46,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: 14,
    color: colors.text,
    fontSize: 14,
    fontWeight: '500',
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterChipText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  filterChipTextActive: {
    color: colors.white,
    fontWeight: '700',
  },
  listContent: {
    paddingBottom: 24,
  },
  emptyBox: {
    padding: 30,
    alignItems: 'center',
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: 13,
  },
});

export default RouteStudentsScreen;
