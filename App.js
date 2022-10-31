import { StyleSheet, Text, View, TouchableOpacity, PixelRatio, Image } from 'react-native'
import { useReducer, useEffect, useRef } from 'react'
import { Camera, CameraType } from 'expo-camera'
import * as MediaLibrary from 'expo-media-library'
import { Entypo } from '@expo/vector-icons'

const reducer = (state, {type, payload}) => {

  switch(type){

    case "permission":
      return {...state, permission: !state.permission}

    case "image":
      return {...state, image: payload}

    case "type":
      if (payload === "front"){
        return {...state, type: CameraType.front, flip: "front"}
      }

      return {...state, type: CameraType.back, flip: "back"}

    case "flash":
      if (payload === "on"){
        return {...state, flash: Camera.Constants.FlashMode.on}
      }

      return {...state, flash: Camera.Constants.FlashMode.off}

    default:
      return state
  }
}

export default function App() {

  const [state, dispatch] = useReducer(reducer, {
    image: "",
    flip: "front",
    type: CameraType.front,
    flash: Camera.Constants.FlashMode.on
  })

  const getPermissions = async () => {
    const p = await Camera.requestCameraPermissionsAsync()
    const m = await MediaLibrary.requestPermissionsAsync()

    if (p.status !== 'granted'){
      alert("Camera Access denied!")
    }else if (m.status !== 'granted'){
      alert("Media Access denied!")
    }
  }

  useEffect(() => {
    getPermissions()
  }, [])

  Camera.useCameraPermissions()

  const cameraRef = useRef(null)

  const takePicture = async () => {
    if (cameraRef) {
      try{
        const data = await cameraRef.current.takePictureAsync()
        dispatch({
          type: "image",
          payload: data.uri
        })
      }catch(err){
        console.log(err)
      }
    }
  }

  const CameraElement = () => {
    return(
      <View style={styles.container}> 
        <Camera 
          style={styles.camera}
          type={state.type}
          flashMode={state.flash}
          ref={cameraRef}
        >
          <TouchableOpacity
            onPress={() => {
              let payload = "back"

              if (state.flip === "back"){
                payload = "front"
              }

              dispatch({
                type: "type",
                payload: payload
              })
            }} 
            style={styles.flipButton}>
              <Text>Flip</Text>
          </TouchableOpacity>
        </Camera> 
        <View style={styles.cameraDrawer}>
          <TouchableOpacity
            onPress={takePicture}
            style={styles.cameraButton}>
            <Entypo 
              style={styles.icons}
              name="camera"/>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  const ImageElement = () => {
    return(
      <View style={styles.container}> 
        <Image 
          style={styles.image}
          source={{uri: state.image}} />
        <View style={styles.imageButtons}>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={() => {
              MediaLibrary.saveToLibraryAsync(state.image).then(() => {
                alert("Picture Saved to Library!")
                dispatch({
                  type: "image",
                  payload: ""
                })
              })
            }}>
              <Text>SAVE</Text>  
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.retakeButton}
            onPress={() => {
              dispatch({
                type: "image",
                payload: ""
              })
            }}
          >
            <Text>RETAKE</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  return (
    <>
      {state.image === "" ? <CameraElement /> : <ImageElement />}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  camera: {
    flex: 5,
    width: "100%",
    justifyContent: "flex-start",
    alignItems: "flex-start"
  },
  image: {
    flex: 5,
    width: "100%"
  },
  imageButtons: {
    flex: 1,
    flexDirection: "row"
  },
  saveButton: {
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#000000",
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    width: "50%",
    backgroundColor: "#32CD32"
  },
  retakeButton: {
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#000000",
    borderHeight: 2,
    borderWidth: 2,
    width: "50%",
    backgroundColor: "#FF0000"
  },
  cameraDrawer: {
    flex: 1,
    backgroundColor: "#00008B",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  icons: {
    color: "#000000",
    fontSize: 25
  },
  flipButton: {
    width: "25%",
    height: "10%",
    backgroundColor: "#808080",
    justifyContent: "center",
    alignItems: "center",
    opacity: 0.5
  },
  cameraButton: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: '#808080',
    borderRadius: 50,
    width: PixelRatio.getPixelSizeForLayoutSize(30),
    height: PixelRatio.getPixelSizeForLayoutSize(30),
    borderColor: "#000000",
    borderHeight: 2,
    borderWidth: 2,
    opacity: 0.5
  }
});
