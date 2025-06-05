import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Dimensions,
  TouchableOpacity,
  Animated,
  Easing
} from 'react-native';
import { useFonts } from 'expo-font';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ButtonMain } from '@/components/common/ButtonMain';
import { router } from 'expo-router';
import MainHeader from "@/components/common/MainHeader";

const { width } = Dimensions.get('window');

interface Pagt {
  id: string;
  title: string;
  tag: string;
  description: string;
  expanded: boolean;
}

const PagamentoScreen = () => {
  const [fontsLoaded] = useFonts({
    "Quicksand-Bold": require("../../../assets/fonts/Quicksand-Bold.ttf"),
    "Quicksand-Regular": require("../../../assets/fonts/Quicksand-Regular.ttf"),
  });

  const [pagto, setPagto] = useState<Pagt[]>([
 
  {
    id: '2',
    title: 'PIX',
    tag: '1',
    description: "Um QR Code será encaminhado ao seu e-mail. Faça o pagamento no tempo estipulado.",
    expanded: false

  },
   {
    id: '1',
    title: 'Boleto',
    tag: '3',
    description: "Um boleto será encaminhado ao seu e-mail. Faça o pagamento antes da data de vencimento.",
    expanded: false

  },
  {
    id: '3',
    title: 'Paypal',
    tag: '2',
    description: "Uma cobrança chegará ao seu e-mail. Faça o pagamento para a conta que será informada",     
    expanded: false
  }
]);

  const togglePlan = (id: string) => {
    setPagto(pagto.map(pagt => ({
      ...pagt,
      expanded: pagt.id === id ? !pagt.expanded : false
    })));
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={styles.flex1}>
        <MainHeader />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.screenTitle}>Escolha Seu Plano</Text>
        
        {pagto.map((pagt) => (
          <Animated.View 
            key={pagt.id}
            style={[
              styles.planCard,
              pagt.expanded && styles.expandedCard
            ]}
          >
            <TouchableOpacity 
              activeOpacity={0.9}
              onPress={() => togglePlan(pagt.id)}
            >
              <View style={styles.cardHeader}>
                <View>
                  <Text style={styles.planTitle}>{pagt.title}</Text>
                </View>
                <View style={styles.tagContainer}>
                  <Text style={styles.tagText}>{pagt.tag}</Text>
                </View>
              </View>

              {pagt.expanded && (
                <Animated.View style={styles.cardBody}>
                  <Text style={styles.planDescription}>{pagt.description}</Text>
                </Animated.View>
              )}

              <View style={styles.cardFooter}>
                <Text style={styles.toggleText}>
               {!pagt.expanded ? 'Selecionar Forma de Pagamento': 'Mudar'}
                </Text>
              </View>
            </TouchableOpacity>
          </Animated.View>
        ))}

        <ButtonMain title={"Pagar"} style={{marginBottom: 32, marginTop: 60}} onPress={() => {alert("E-mail com instruções de pagamento enviado. Verifique sua caixa de entrada."); }} />

      </ScrollView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  flex1: { flex: 1 },
  container: {
    padding: 20,
    paddingBottom: 40,
    backgroundColor: '#0C0A14',
    
  },
  screenTitle: {
    color: '#fff',
    fontFamily: 'Quicksand-Bold',
    fontSize: 24,
    textAlign: 'center',
    marginVertical: 20,
        marginTop: 100

  },
  planCard: {
    backgroundColor: '#1E1B2B',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#2A2638',
  },
  expandedCard: {
    borderColor: '#9747FF',
    shadowColor: '#9747FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  planTitle: {
    color: '#F5D907',
    fontFamily: 'Quicksand-Bold',
    fontSize: 20,
  },
  planSubtitle: {
    color: '#fff',
    fontFamily: 'Quicksand-Regular',
    fontSize: 14,
    opacity: 0.8,
  },
  tagContainer: {
    backgroundColor: '#9747FF',
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  tagText: {
    color: '#fff',
    fontFamily: 'Quicksand-Bold',
    fontSize: 12,
  },
  cardBody: {
    marginVertical: 10,
  },
  planDescription: {
    color: '#fff',
    fontFamily: 'Quicksand-Regular',
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.9,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#2A2638',
  },
  priceText: {
    color: '#F5D907',
    fontFamily: 'Quicksand-Bold',
    fontSize: 16,
  },
  toggleText: {
    color: '#9747FF',
    fontFamily: 'Quicksand-Bold',
    fontSize: 14,
  },
  featuresContainer: {
    marginTop: 30,
    padding: 20,
    backgroundColor: '#1E1B2B',
    borderRadius: 12,
  },
  featuresTitle: {
    color: '#fff',
    fontFamily: 'Quicksand-Bold',
    fontSize: 18,
    marginBottom: 15,
  },
  featureItem: {
    marginBottom: 8,
  },
  featureText: {
    color: '#fff',
    fontFamily: 'Quicksand-Regular',
    fontSize: 14,
    opacity: 0.8,
  },
});

export default PagamentoScreen;