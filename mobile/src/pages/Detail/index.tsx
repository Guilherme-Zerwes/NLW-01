import React, {useEffect, useState} from 'react';
import {Feather as Icon, FontAwesome} from '@expo/vector-icons';
import {useNavigation, useRoute} from '@react-navigation/native';
import {StyleSheet, View, TouchableOpacity, Text, Image, SafeAreaView, Linking} from 'react-native';
import {RectButton} from 'react-native-gesture-handler';
import * as MailComposer from 'expo-mail-composer';
import api from '../../services/api'

interface Parms {
  point_id: number;
}

interface Data {
  serializedPoints: {
    image: string;
	  image_url: string;
    name: string;
    whatsap: string;
    email: string;
    city: string;
    uf: string;
  };
  items: {
    title: string;
  }[]
}

const Details = () => {
  const navigation = useNavigation();
  const rout = useRoute();
  const routParams = rout.params as Parms;

  const [data, setData] = useState<Data>({} as Data);

  useEffect(() => {
    api.get(`points/${routParams.point_id}`).then(response => {
      setData(response.data);
    })
  }, []);

  function handleNavigateBack() {
    navigation.goBack();
  };

  function handleMailCompose() {
    MailComposer.composeAsync({
      subject: 'Interesse na coleta de resíduos',
      recipients: [data.serializedPoints.email],
    });
  }

  function handleWhatsapp() {
    Linking.openURL(`whatsapp://send?phone=${data.serializedPoints.whatsap}`);
  }

  if(!data.serializedPoints) {
    return (
      <View style={styles.container}>
        <Text style={styles.pointName}>Ocorreu um erro!</Text>
      </View>
    );
  }

  return (
      <SafeAreaView style={{flex:1}}>
        <View style={styles.container}>
          <TouchableOpacity onPress={handleNavigateBack}>
            <Icon name="arrow-left" size={20} color="#34cb79"></Icon>
          </TouchableOpacity>
          <Image style={styles.pointImage} source={{uri: data.serializedPoints.image_url}}/>

          <Text style={styles.pointName}>{data.serializedPoints.name}</Text>
          <Text style={styles.pointItems}>{data.items.map(item => item.title).join(', ')}</Text>

          <View style={styles.address}>
            <Text style={styles.addressTitle}>Endereço</Text>
            <Text style={styles.addressContent}>{data.serializedPoints.city}, {data.serializedPoints.uf}</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <RectButton style={styles.button} onPress={handleWhatsapp}>
            <FontAwesome name="whatsapp" size={20} color="#FFF"/>
            <Text style={styles.buttonText}>Whatsapp</Text>
          </RectButton>
          <RectButton style={styles.button} onPress={handleMailCompose}>
            <Icon name="mail" size={20} color="#FFF"/>
            <Text style={styles.buttonText}>E-mail</Text>
          </RectButton>
        </View>
      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
    paddingTop: 20,
    marginTop: 15,
  },

  pointImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
    borderRadius: 10,
    marginTop: 32,
  },

  pointName: {
    color: '#322153',
    fontSize: 28,
    fontFamily: 'Ubuntu_700Bold',
    marginTop: 24,
  },

  pointItems: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 16,
    lineHeight: 24,
    marginTop: 8,
    color: '#6C6C80'
  },

  address: {
    marginTop: 32,
  },
  
  addressTitle: {
    color: '#322153',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  },

  addressContent: {
    fontFamily: 'Roboto_400Regular',
    lineHeight: 24,
    marginTop: 8,
    color: '#6C6C80'
  },

  footer: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: '#999',
    paddingVertical: 20,
    paddingHorizontal: 32,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  
  button: {
    width: '48%',
    backgroundColor: '#34CB79',
    borderRadius: 10,
    height: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },

  buttonText: {
    marginLeft: 8,
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'Roboto_500Medium',
  },
});

export default Details;