import { View, Text, StyleSheet, Switch, TouchableOpacity, Image, ScrollView, Modal, Pressable } from 'react-native';
import { ButtonMain } from '@/components/common/ButtonMain';
import { Form } from '@/components/common/Form'; 
import MainHeader from "../../../components/common/MainHeader";
import { useState } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';

export default function Settings() {
  const [name, setName] = useState('');
  const [sobrenome, setSobrenome] = useState('');
  const [senha, setSenha] = useState('');
  const [senhaConfirmacao, setSenhaConfirmacao] = useState('');
  const [imagemPerfil, setImagemPerfil] = useState<string | null>(null);
  const [banner, setBanner] = useState<string | null>(null);
  const [isNotificationEnabled, setIsNotificationEnabled] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [isLocationEnabled, setIsLocationEnabled] = useState(true);
  const [showBannerModal, setShowBannerModal] = useState(false);

  const bannerOptions = [
    require('../../../assets/images/profileBackgroundImage.jpg'),
    require('../../../assets/images/header2.jpg')
  ];

  const selecionarImagemPerfil = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
  
    if (permissionResult.granted === false) {
      alert("Permissão para acessar a galeria é necessária!");
      return;
    }
  
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
  
    if (!result.canceled) {
      setImagemPerfil(result.assets[0].uri);
    }
  };

  const handleBannerSelect = (imageSource: any) => {
    setBanner(imageSource);
    setShowBannerModal(false);
  };

  const handleSubmit = async () => {
    if (senha !== senhaConfirmacao) {
      alert("As senhas não coincidem.");
      return;
    }
    
  };

  return (
    <ScrollView style={styles.container}>
      <MainHeader />
      
      <View style={styles.profileSection}>
        <View style={styles.imageColumn}>
          <View style={styles.imageContainer}>
            <Text style={styles.imageLabel}>Foto de Perfil</Text>
            <TouchableOpacity onPress={selecionarImagemPerfil}>
              <Image
                source={imagemPerfil ? { uri: imagemPerfil } : require("../../../assets/images/icon.png")}
                style={styles.profileImage}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.imageContainer}>
            <Text style={styles.imageLabel}>Banner</Text>
            <TouchableOpacity onPress={() => setShowBannerModal(true)}>
              <Image
                source={banner || require("../../../assets/images/icon.png")}
                style={styles.bannerImage}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.formColumn}>
          <Form
            value={name}
            onChangeText={setName}
            label="Nome"
            style={styles.input}
            placeholder="Seu nome"
          />

          <Form
            value={sobrenome}
            onChangeText={setSobrenome}
            label="Sobrenome"
            style={styles.input}
            placeholder="Seu sobrenome"
          />

          <View style={styles.passwordContainer}>
            <Form 
              label="Senha" 
              secureTextEntry={!showPassword} 
              placeholder="********" 
              value={senha} 
              onChangeText={setSenha} 
              style={styles.passwordInput}
            />
            <MaterialCommunityIcons 
              name={showPassword ? "eye-off" : "eye"} 
              size={24} 
              color="#000" 
              onPress={() => setShowPassword(!showPassword)} 
              style={styles.eyeIcon} 
            />
          </View>

          <View style={styles.passwordContainer}>
            <Form 
              label="Confirmar Senha" 
              secureTextEntry={!showPasswordConfirm} 
              placeholder="********" 
              value={senhaConfirmacao} 
              onChangeText={setSenhaConfirmacao} 
              style={styles.passwordInput}
            />
            <MaterialCommunityIcons 
              name={showPasswordConfirm ? "eye-off" : "eye"} 
              size={24} 
              color="#000" 
              onPress={() => setShowPasswordConfirm(!showPasswordConfirm)} 
              style={styles.eyeIcon} 
            />
          </View>
        </View>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={showBannerModal}
        onRequestClose={() => setShowBannerModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Selecione seu banner</Text>
            
            {bannerOptions.map((imageSource, index) => (
              <Pressable 
                key={index} 
                style={styles.bannerOption}
                onPress={() => handleBannerSelect(imageSource)}
              >
                <Image 
                  source={imageSource} 
                  style={styles.bannerOptionImage} 
                />
              </Pressable>
            ))}
            
            <ButtonMain
              title="Cancelar"
              onPress={() => setShowBannerModal(false)}
              style={styles.cancelButton}
            />
          </View>
        </View>
      </Modal>
            
        <Text style={styles.sectionTitle}>Gerenciar</Text>
         <View style={styles.logout}>
          <Text style={styles.uploadText}>Lojas</Text>
          <Image
                   source={require("../../../assets/images/shop.png")}
                   style={{
                     height: 20,
                     marginLeft:28,
                     resizeMode: "contain",
                   }}
                 />
        </View> 
         <View style={styles.logout}>
          <Text style={styles.uploadText}>Assinatura</Text>
          <Image
                   source={require("../../../assets/images/trophy.png")}
                   style={{
                     height: 28,
                     resizeMode: "contain",
                   }}
                 />
        </View> 

      <View style={styles.section}>
        
         
        <View style={styles.preferenceItem}>
          <Text style={styles.preferenceText}>Notificações</Text>
          <Switch
            value={isNotificationEnabled}
            onValueChange={setIsNotificationEnabled}
            trackColor={{ false: '#767577', true: '#9747FF' }}
            thumbColor={isNotificationEnabled ? '#f4f3f4' : '#f4f3f4'}
          />
        </View>
        <TouchableOpacity onPress={() => router.push({ pathname: '/Login'})}>

          <Text style={styles.modalTitle}>Sair</Text>
          
        </TouchableOpacity>
      </View> 
      

      <ButtonMain 
        title="Salvar" 
        onPress={handleSubmit}
        style={styles.saveButton}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0C0A14',
    padding: 20,
  },
  profileSection: {
    flexDirection: 'row',
    marginTop: 20,
    marginBottom: 30,
  },
  imageColumn: {
    width: '35%',
    marginRight: 20,
    marginTop:80
  },
  formColumn: {
    flex: 1,
    marginTop:80
  },
  imageContainer: {
    marginBottom: 25,
  },
  imageLabel: {
    color: '#F5D907',
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    marginBottom:15,

    borderColor: "#F5D907",
    backgroundColor: "#ccc",
  },
  bannerImage: {
    width: 120,
    height: 100,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#F5D907",
    backgroundColor: "#ccc",
  },
  uploadText: {
    color: '#fff',
    marginTop: 8,
    marginLeft:8,
    fontSize: 18,
  },
  input: {
    backgroundColor: '#fff',
    color: '#000',
    borderRadius: 2,
    padding: 8,
    fontSize: 16,
    marginBottom: 1,
  },
  passwordContainer: {
    position: 'relative',
    marginBottom: 1,
  },
  passwordInput: {
    backgroundColor: '#fff',
    color: '#000',
    borderRadius: 8,
    padding: 8,
    fontSize: 16,
  },
  eyeIcon: {
    position: 'absolute',
    right: 12,
    top: 35,
  },
  section: {
    marginBottom: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#2A2638',
    paddingBottom: 20,
  },
  sectionTitle: {
    color: '#F5D907',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  preferenceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#2A2638',
  },
  logout: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#2A2638',
  },
  preferenceText: {
    color: '#FFFFFF',
    fontSize: 16,
    flex: 1,
    marginLeft: 10,
  },
   preferenceIcon: {
    color: '#FFFFFF',
    fontSize: 16,
    flex: 1,
    marginLeft: 10,

  },
  saveButton: {
    marginTop: 10,
    marginBottom: 40,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#1E1B2B',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    color: '#F5D907',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 20,
    marginLeft:8
  },
  bannerOption: {
    width: '100%',
    marginBottom: 15,
    borderRadius: 8,
    overflow: 'hidden',
  },
  bannerOptionImage: {
    width: '100%',
    height: 120,
  },
  cancelButton: {
    marginTop: 15,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#9747FF',  
  },
});