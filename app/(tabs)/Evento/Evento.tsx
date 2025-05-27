import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ScrollView } from 'react-native-gesture-handler';
import MainHeader from '../../../components/common/MainHeader';
import { getEvents } from '@/lib/api'; 
import { ButtonMain } from '@/components/common/ButtonMain';
import { router } from 'expo-router';

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

export default function Eventos() {
  const [events, setEvents] = useState<Event[]>([]);
    const [isLoading, setIsLoading] = useState(true);


 useEffect(() => {
     const fetchEvents = async () => {
       try {
         const res = await getEvents();
         setEvents(res.data);
       } catch (error) {
         console.error('Erro:', error);
       } finally {
         setIsLoading(false);
       }
     };
 
     fetchEvents();
   }, []);
 
   if (isLoading) {
     return (
       <View style={styles.loadingContainer}>
         <ActivityIndicator size="large" color="#9747FF" />
       </View>
     );
   }
 

  return (
     <GestureHandlerRootView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
        <MainHeader />
          <View style={styles.eventsSection}>
            <Text style={styles.eventsTitle}>Eventos</Text>
              <ButtonMain 
                        title="Novo" 
                        onPress={() => router.push({ pathname: '/Evento/new' })}
                      />
            
            {events.length > 0 ? (
              <FlatList
                data={events}
                scrollEnabled={false}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <View style={styles.eventCard}>
                    <Text style={styles.eventType}>{item.name}</Text>
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
    paddingTop: 40,
    paddingBottom: 20,
  },
  header: {
    color: '#F5D907',
    fontFamily: 'Quicksand-Bold',
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 24,
  header: {
    color: '#F5D907',
    fontFamily: 'Quicksand-Bold',
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 24,
  },
  sectionTitle: {
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
    marginBottom: 4,
  },
  eventTitle: {
    color: '#F5D907',
    fontFamily: 'Quicksand-Bold',
    fontSize: 18,
    marginBottom: 8,
  },
  eventDescription: {
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