import React from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

export default function RealtimeMap() {
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: -23.564433,
          longitude: -46.652726,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }}
      >
        <Marker
          coordinate={{ latitude: -23.562463, longitude: -46.655165 }}
          title="Moto 1"
          description="Localização Simulada"
        />
        <Marker
          coordinate={{ latitude: -23.562901, longitude: -46.652611 }}
          title="Moto 2"
          description="Localização Simulada"
        />
        <Marker
          coordinate={{ latitude: -23.564116, longitude: -46.651098 }}
          title="Moto 3"
          description="Localização Simulada"
        />  
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});