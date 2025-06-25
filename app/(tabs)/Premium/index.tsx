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

interface Plan {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  description: string;
  price: string;
  expanded: boolean;
}

const PlanosScreen = () => {
  const [fontsLoaded] = useFonts({
    "Quicksand-Bold": require("../../../assets/fonts/Quicksand-Bold.ttf"),
    "Quicksand-Regular": require("../../../assets/fonts/Quicksand-Regular.ttf"),
  });

  const [plans, setPlans] = useState<Plan[]>([
  {
    id: '1',
    title: 'Grátis',
    subtitle: 'Individual',
    tag: 'Radical',
    description:"• Acesso essencial ao aplicativo • Busca e visualização de pistas de skate no mapa • Informações básicas das pistas (localização, fotos, tipo de piso) • Avaliações de  pistas• Visualização de eventos • Com anúncios e propaganda",
    price: 'Grátis',
    expanded: false
  },
  {
    id: '2',
    title: 'Profissa',
    subtitle: 'Individual',
    tag: 'Profissa',
    description: "• Tudo de 'Radical' • Descontos em skateshops parceiras • Participação em sorteios exclusivos •Promoções premium  •Sem anúncios",
    price: 'R$35 /mês',
        expanded: false

  },
  {
    id: '3',
    title: 'Lenda',
    subtitle: 'Individual',
    tag: 'Lenda',
    description: "• Tudo de 'Profissa' • Conteúdo exclusivo • Dicas e tutoriais • Notificações personalizadas",
    price: 'R$75 /mês',
    expanded: false

  },
   {
    id: '4',
    title: 'Para empresas',
    subtitle: 'CNPJ',
    tag: 'CNPJ',
    description: "• Sua loja exibida no aplicativo • Oferta de serviços direcionados a skatistas • Divulgação personalizada de eventos.",
    price: 'R$500 /mês',
    expanded: false

  }
]);

  const togglePlan = (id: string) => {
    setPlans(plans.map(plan => ({
      ...plan,
      expanded: plan.id === id ? !plan.expanded : false
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
        
        {plans.map((plan) => (
          <Animated.View 
            key={plan.id}
            style={[
              styles.planCard,
              plan.expanded && styles.expandedCard
            ]}
          >
            <TouchableOpacity 
              activeOpacity={0.9}
              onPress={() => togglePlan(plan.id)}
            >
              <View style={styles.cardHeader}>
                <View>
                  <Text style={styles.planTitle}>{plan.title}</Text>
                  <Text style={styles.planSubtitle}>{plan.subtitle}</Text>
                </View>
                <View style={styles.tagContainer}>
                  <Text style={styles.tagText}>{plan.tag}</Text>
                </View>
              </View>

              {plan.expanded && (
                <Animated.View style={styles.cardBody}>
                  <Text style={styles.planDescription}>{plan.description}</Text>
                </Animated.View>
              )}

              <View style={styles.cardFooter}>
                <Text style={styles.priceText}>{plan.price}</Text>
                <Text style={styles.toggleText}>
                  {plan.expanded ? 'Mostrar menos' : 'Ver detalhes'}
                </Text>
              </View>
            </TouchableOpacity>
          </Animated.View>
        ))}

       <ButtonMain title="Pagamento" onPress={() => router.push("/Premium/payment")}  />

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

export default PlanosScreen;