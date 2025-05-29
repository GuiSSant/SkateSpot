import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ScrollView } from 'react-native-gesture-handler';
import { getEvents } from '@/lib/api'; 
import MainHeader from '../../../components/common/MainHeader';


type Event = {
  name: string;
  description: string;
  start_date: string;
  end_date: string ;
  create_date:  string;
  location_id: number;

};

export default function Eventos() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
    <ScrollView>

          <View style={styles.container}>
          <MainHeader />

            <Text style={styles.eventsTitle}>Eventos</Text>
            
            {events.length > 0 ? (
              <FlatList
                data={events}
                scrollEnabled={false}
                renderItem={({ item }) => (
                    <View style={styles.eventCard}>
                    <Text style={styles.eventName}>{item.name}</Text>
                    <Text style={styles.eventDescription}>{item.description}</Text>
                    
                    <View style={styles.dateContainer}>
                      <Text style={styles.dateLabel}>Início:</Text>
                      <Text style={styles.eventDate}>(item.start_date)</Text>
                    </View>
                    
                    <View style={styles.dateContainer}>
                      <Text style={styles.dateLabel}>Fim:</Text>
                      <Text style={styles.eventDate}>(item.end_date)</Text>
                    </View>
                  </View>
                )}
              />
            ) : (
              <Text style={styles.noEventsText}>Nenhum evento encontrado</Text>
            )}
          </View>
      </ScrollView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
    scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#0C0A14',
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 40,
  },
    eventsTitle: {
      color: '#9747FF',
      fontFamily: 'Quicksand-Bold',
      fontSize: 22,
      marginBottom: 20,
      paddingLeft: 8,
      marginTop: 80
    },
    eventCard: {
      backgroundColor: '#1E1B2B',
      borderRadius: 12,
      padding: 20,
      marginBottom: 16,
    },
    eventName: {
      color: '#F5D907',
      fontFamily: 'Quicksand-Bold',
      fontSize: 18,
      marginBottom: 12,
    },
    eventDescription: {
      color: '#fff',
      fontFamily: 'Quicksand-Regular',
      fontSize: 16,
      lineHeight: 22,
      marginBottom: 16,
    },
    dateContainer: {
      flexDirection: 'row',
      marginBottom: 8,
    },
    dateLabel: {
      color: '#A0A0A0',
      fontFamily: 'Quicksand-Bold',
      fontSize: 14,
      marginRight: 8,
    },
    eventDate: {
      color: '#fff',
      fontFamily: 'Quicksand-Regular',
      fontSize: 14,
    },
    noEventsText: {
      color: '#A0A0A0',
      fontFamily: 'Quicksand-Regular',
      fontSize: 16,
      textAlign: 'center',
      marginTop: 40,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#0C0A14',
    },

  });