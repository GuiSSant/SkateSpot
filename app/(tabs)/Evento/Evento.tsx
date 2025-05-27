import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ScrollView } from 'react-native-gesture-handler';
import MainHeader from '../../../components/common/MainHeader';
import { getEvents } from '@/lib/api'; 

const API_URL = "http://34.231.200.200:8000";


type Event = {
  id: number;
  name: string;
  description: string;
  start_date: string;
  end_date: string ;
  create_date:  string;
  location_id: number;

};

export default function CommunityEvents() {
  const [events, setEvents] = useState<Event[]>([]);

    useEffect(() => {
    if (id) {
      getEvents(Number(id)).then((res) => setEvents(res.data));
    }
  }, [id]);


  return (
     <GestureHandlerRootView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
        <MainHeader backgroundColor={black}/>
          <View style={styles.eventsSection}>
            <Text style={styles.eventsTitle}>Eventos</Text>
            
            {events.length > 0 ? (
              <FlatList
                data={events}
                scrollEnabled={false}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <View style={styles.eventCard}>
                    <Text >nome {item.name}</Text>
                    <Text style={styles.eventDescription}>{item.description}</Text>
                    <Text style={styles.eventDescription}>{item.start_date}</Text>
                    
                  </View>
                )}
              />
            ) : (
              <Text style={styles.noEventsText}>Nenhum evento encontrado</Text>
            )}
          </View>
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
    paddingTop: 40,
    paddingBottom: 20,
  },
  header: {
    color: '#F5D907',
    fontFamily: 'Quicksand-Bold',
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 24,
  },
  sectionTitle: {
    color: '#fff',
    fontFamily: 'Quicksand-Bold',
    fontSize: 20,
    marginBottom: 16,
    paddingLeft: 8,
  },
  eventsSection: {
    width: '100%',
    marginBottom: 24,
  },
  eventsTitle: {
    color: '#9747FF',
    fontFamily: 'Quicksand-Bold',
    fontSize: 18,
    marginBottom: 16,
    paddingLeft: 8,
  },
  eventCard: {
    backgroundColor: '#1E1B2B',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  eventType: {
    color: '#A0A0A0',
    fontFamily: 'Quicksand-Regular',
    fontSize: 14,
    marginBottom: 4,
  },
  eventTitle: {
    color: '#F5D907',
    fontFamily: 'Quicksand-Bold',
    fontSize: 18,
    marginBottom: 8,
  },
  eventDescription: {
    color: '#fff',
    fontFamily: 'Quicksand-Regular',
    fontSize: 16,
    lineHeight: 22,
  },
  noEventsText: {
    color: '#A0A0A0',
    fontFamily: 'Quicksand-Regular',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0C0A14',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0C0A14',
  },
  errorText: {
    color: '#FF3B30',
    fontFamily: 'Quicksand-Regular',
    fontSize: 16,
  },
});