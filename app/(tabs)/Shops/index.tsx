import { Fragment, useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator, Text, Pressable } from 'react-native';
import { router } from 'expo-router';
import { getShops } from '@/lib/api';
import { ButtonMain } from '@/components/common/ButtonMain';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ScrollView } from 'react-native-gesture-handler';
import MainHeader from "@/components/common/MainHeader";

type Shop = {
  id: number;
  name: string;
  description: string;
};

export default function ShopsList() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const res = await getShops();
        setShops(res.data);
      } catch (error) {
        console.error('Erro:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchShops();
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
        <MainHeader />
        <View style={styles.container}>
          <Text style={styles.title}>Lojas</Text>
          
          {shops.length > 0 ? (
            <FlatList
              data={shops}
              scrollEnabled={false}
              contentContainerStyle={styles.listContainer}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <Pressable
                  style={({ pressed }) => [
                    styles.modalityItem,
                    { opacity: pressed ? 0.6 : 1 }
                  ]}
                  onPress={() => router.push({ 
                    pathname: '/Shops', 
                    params: { id: item.id } 
                  })}
                >
                  <View style={styles.textContainer}>
                    <Text style={styles.text}>{item.name}</Text>
                    <Text style={styles.subtitle}>{item.description}</Text>
                  </View>
                  <Text style={styles.details}>+</Text>
                </Pressable>
              )}
            />
          ) : (
            <Text style={styles.emptyText}>Nenhuma loja encontrada</Text>
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
    alignItems: 'center',
    backgroundColor: '#0C0A14',
    paddingHorizontal: 16,
    paddingTop: 40,
  },
  title: {
    color: '#F5D907',
    fontFamily: 'Quicksand-Bold',
    fontSize: 22,
    lineHeight: 27.5,
    letterSpacing: 0.11,
    marginBottom: 12,
    marginTop: 80
  },
  subtitle: {
    color: '#fff',
    fontFamily: 'Quicksand-Regular',
    fontSize: 14,
    lineHeight: 17.5,
    letterSpacing: 0.11,
  },
  text: {
    color: '#fff',
    fontFamily: 'Quicksand-Bold',
    fontSize: 18,
    lineHeight: 17.5,
    letterSpacing: 0.11,
  },
  textContainer: {
    flex: 1,
  },
  emptyText: {
    color: '#fff',
    fontFamily: 'Quicksand-Regular',
    fontSize: 16,
    marginTop: 20,
  },
  listContainer: {
    width: '100%',
  },
  modalityItem: {
    backgroundColor: '#1E1B2B',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  details: {
    fontSize: 18,
    lineHeight: 17.5,
    letterSpacing: 0.11,
    color: '#9747FF',
    fontFamily: 'Quicksand-Regular',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0C0A14',
  },
});