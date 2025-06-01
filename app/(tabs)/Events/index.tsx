import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ScrollView } from 'react-native-gesture-handler';
import { getEvents } from '@/lib/api'; 
import { router } from 'expo-router';
import MainHeader from '../../../components/common/MainHeader';
import { ButtonMain } from '@/components/common/ButtonMain';


type Event = {
  name: string;
  description: string;
  start_date: string;
  end_date: string ;
  create_date:  string;
  location_id: number;

};

export default function Events() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
  

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
    <ScrollView>

          <View style={styles.container}>
          <MainHeader />

          <Text style={styles.title}>Eventos</Text>
           <Text style={styles.subtitle}>
               Descubra eventos por perto! </Text>
                <ButtonMain
                      title="Novo" 
                      onPress={() => router.push({ pathname: '/Events/new' })}
                    />

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
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 40,
    marginBottom: 20,
  },  title: {
    color: '#F5D907',
    fontFamily: 'Quicksand-Bold',
    fontSize: 22,
    lineHeight: 27.5,
    letterSpacing: 0.11,
    marginBottom: 12,
    marginTop: 80
  },
   subtitle: {
    color: "#fff",
    fontFamily: "Quicksand-Regular",
    fontSize: 14,
    lineHeight: 17.5,
    letterSpacing: 0.11,
    textAlign: "center",
    marginHorizontal: 28,
    marginBottom: 32
  },
    eventCard: {
      backgroundColor: '#1E1B2B',
      borderRadius: 12,
      padding: 20,
      marginBottom: 16,
      marginTop: 20,

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
     nova: {
      width: '40%',
      marginBottom: 24,
    },

  });