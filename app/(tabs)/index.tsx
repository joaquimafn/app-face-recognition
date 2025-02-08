import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, Dimensions } from 'react-native';
import { Camera, CameraView } from 'expo-camera';
import * as FaceDetector from 'expo-face-detector';

const { width, height } = Dimensions.get('window');
const boxWidth = 250;
const boxHeight = 350;
const topOverlayHeight = (height - boxHeight) / 2;
const sideOverlayWidth = (width - boxWidth) / 2;

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [result, setResult] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const cameraRef = useRef(null);

  // Solicita permissão para usar a câmera
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  // Callback que indica que a câmera já está pronta para uso
  const onCameraReady = () => {
    setIsCameraReady(true);
  };

  // Função que tira a foto, detecta o rosto e envia para a API de reconhecimento
  const takePictureAndRecognize = async () => {
    if (cameraRef.current && isCameraReady) {
      setIsProcessing(true);
      setResult('');
      try {
        // Captura a foto com opção de base64 (para facilitar o envio à API)
        // const photo = await cameraRef.current.takePictureAsync({ base64: true });
        // console.log('Foto capturada:', photo.uri);

        // Usa o Expo Face Detector para identificar se há rosto na imagem
        // const faceDetection = await FaceDetector.detectFacesAsync(photo.uri, {
        //   mode: FaceDetector.Constants.Mode.fast,
        //   detectLandmarks: FaceDetector.Constants.Landmarks.all,
        //   runClassifications: FaceDetector.Constants.Classifications.all,
        // });

        // if (!faceDetection.faces || faceDetection.faces.length === 0) {
        //   setResult('Nenhum rosto detectado. Tente novamente.');
        //   setIsProcessing(false);
        //   return;
        // }

        // console.log('Rosto(s) detectado(s):', faceDetection.faces.length);

        // Envia a imagem (em base64) para a API de reconhecimento
        // const response = await fetch('https://localhost:8000/face-recognition', {
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json',
        //   },
        //   body: JSON.stringify({
        //     image: photo.base64,
        //     // Você pode enviar informações adicionais se sua API precisar,
        //     // por exemplo, os dados retornados pelo FaceDetector.
        //     faceData: faceDetection.faces,
        //   }),
        // });

        // if (!response.ok) {
        //   throw new Error('Erro na comunicação com a API');
        // }

        // const data = await response.json();
        // console.log('Resposta da API:', data);

        // Exemplo de resposta: { recognized: true, name: "João da Silva" }
        // if (data.recognized) {
        //   setResult(`Rosto reconhecido: ${data.name || 'Usuário'}`);
        // } else {
        //   setResult('Rosto não reconhecido.');
        // }
      } catch (error) {
        console.error('Erro durante o processamento:', error);
        setResult('Ocorreu um erro durante o reconhecimento.');
      }
      setIsProcessing(false);
    }
  };

  if (hasPermission === null) {
    return <View style={styles.loadingContainer}><ActivityIndicator size="large" color="#1E90FF" /></View>;
  }
  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Sem acesso à câmera.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* <Camera
        style={styles.camera}
        type={'front'} // Use 'back' se preferir a câmera traseira
        ref={cameraRef}
        onCameraReady={onCameraReady}
      /> */}
      
      <CameraView style={styles.camera} facing={'front'}>
        <View style={styles.overlay}>
          <View style={styles.topOverlay} />
            <Text style={styles.buttonTextAhead}>
              Teste
            </Text>

          <View style={styles.middleRow}>
            <View style={styles.sideOverlay} />
            <View style={styles.faceBox} />
            <View style={styles.sideOverlay} />
          </View>

          <View style={styles.bottomOverlay} />
        </View>
      </CameraView>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, isProcessing && styles.buttonDisabled]}
          onPress={takePictureAndRecognize}
          disabled={isProcessing}
        >
          <Text style={styles.buttonText}>
            {isProcessing ? 'Processando...' : 'Registrar Ponto'}
          </Text>
        </TouchableOpacity>
      </View>
      {result !== '' && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>{result}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fff' 
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: { 
    flex: 1,
    backgroundColor: 'red'
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 50,
    alignSelf: 'center',
  },
  button: {
    backgroundColor: '#1E90FF',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  buttonDisabled: {
    backgroundColor: '#7aaef7',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  buttonTextAhead: {
    color: '#fff',
    fontSize: 18,
    backgroundColor: 'black',
    textAlign: "center",
    position: "absolute",
    top: 100,
    // left: (width - boxWidth),
  },
  resultContainer: {
    position: 'absolute',
    top: 50,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.1)',
    padding: 10,
    borderRadius: 8,
  },
  resultText: {
    color: '#fff',
    fontSize: 16,
  },
  errorText: {
    fontSize: 18,
    color: 'red',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  topOverlay: {
    height: topOverlayHeight,
    backgroundColor: 'black',
  },
  bottomOverlay: {
    height: topOverlayHeight,
    backgroundColor: 'black',
  },
  middleRow: {
    flex: 1,
    flexDirection: 'row',
  },
  sideOverlay: {
    width: sideOverlayWidth,
    backgroundColor: 'black',
  },
  faceBox: {
    width: boxWidth,
    height: boxHeight,
    borderWidth: 2,
    borderColor: 'white',
    // borderRadius: 100,
    // Opcional: você pode adicionar um fundo transparente mesmo
    // backgroundColor: 'transparent',
  },
});
