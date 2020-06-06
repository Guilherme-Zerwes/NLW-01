import React, {useState, useEffect} from 'react';
import {View, ImageBackground, Image, StyleSheet, Text, KeyboardAvoidingView, Platform, Picker} from 'react-native';
import {Feather as Icon} from '@expo/vector-icons';
import {RectButton} from 'react-native-gesture-handler';
import { useNavigation} from '@react-navigation/native';
import axios from 'axios';

interface ibgeUfResponse {
  sigla: string;
}

interface ibgeCityResponse {
  nome: string;
}

const Home = () => {
  const navigation = useNavigation();

  const [uf, setUf] = useState('');
  const [city, setCity] = useState('');

  const [allUfs, setAllUfs] = useState<string[]>([]);
  const [allCities, setAllCities] = useState<string[]>([]);

  useEffect(() => {
    axios.get<ibgeUfResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(response => {
      const ibgeUfs = response.data.map(ibgeUf => ibgeUf.sigla);
      setAllUfs(ibgeUfs);
    })
  }, []);

  useEffect(() => {
    axios.get<ibgeCityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/distritos`).then(response => {
      
      if (uf == '') {
        return
      } else {
        const cities = response.data.map(ibgeCity => ibgeCity.nome);
        setAllCities(cities);
      }
    })
  }, [uf]);

  function handleNavigateToPoints() {
    navigation.navigate('Points', {
      uf,
      city
    });
  }

  return (
    <KeyboardAvoidingView style={{flex: 1}} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ImageBackground 
        source={require('../../assets/home-background.png')} 
        style={styles.container} 
        imageStyle={{width: 274, height: 368}}
      >
        <View style={styles.main}>
          <Image source={require('../../assets/logo.png')} />
          <View>
            <Text style={styles.title}>Seu marketplace de coleta de resíduos</Text>
            <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.</Text>
          </View>
        </View>

        <View style={styles.footer}>

          <Picker onValueChange={(value) => setUf(value)} selectedValue={uf}>
            <Picker.Item label="Selecione uma UF" value=""/>
            {allUfs.map(uf => (
              <Picker.Item key={uf} label={uf} value={uf}/>
            ))}
          </Picker>

          <Picker onValueChange={(value) => setCity(value)} selectedValue={city}>
            <Picker.Item label="Selecione uma Cidade" value=""/>
            {allCities.map(city => (
              <Picker.Item key={city} label={city} value={city}/>
            ))}
          </Picker>

          <RectButton style={styles.button} onPress={handleNavigateToPoints}>
            <View style={styles.buttonIcon}>
              <Text>
                <Icon name="arrow-right" color="#fff" size={24}></Icon>
              </Text>
            </View>
            <Text style={styles.buttonText}>Entrar</Text>
          </RectButton>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
  },

  main: {
    flex: 1,
    justifyContent: 'center',
  },

  title: {
    color: '#322153',
    fontSize: 32,
    fontFamily: 'Ubuntu_700Bold',
    maxWidth: 260,
    marginTop: 64,
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 16,
    fontFamily: 'Roboto_400Regular',
    maxWidth: 260,
    lineHeight: 24,
  },

  footer: {},

  select: {
    height: 60,
    fontSize: 16,
    paddingHorizontal: 24,
    borderRadius: 10,
    marginBottom: 8,
  },

  input: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },

  button: {
    backgroundColor: '#34CB79',
    height: 60,
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    marginTop: 8,
  },

  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center'
  },

  buttonText: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    color: '#FFF',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  }
});

export default Home;