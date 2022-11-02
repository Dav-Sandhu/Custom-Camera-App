import { TouchableOpacity, Text, View, StyleSheet, PixelRatio } from "react-native"
import { Camera } from "expo-camera"
import { Entypo } from "@expo/vector-icons"
import React from "react"
import { StatusBar } from "expo-status-bar"

const CameraElement = ({type, flash, flip, dispatch, pending, autoFocus}, ref) => {

  const takePicture = async () => {
    if (ref) {
      try{
        dispatch({
          type: "pending",
          payload: ""
        })

        const options = { quality: 1, base64: true, skipProcessing: true }
        const data = await ref.current.takePictureAsync(options)

        dispatch({
          type: "image",
          payload: data.uri
        })
      }catch(err){
        console.log(err)
      }
    }
  }

  return(
    <View style={styles.container}> 
      <StatusBar 
        hidden={true}
      />
      <Camera 
        style={styles.camera}
        type={type}
        flashMode={flash}
        autoFocus={autoFocus}
        ref={ref}
      >
        <TouchableOpacity
          onPress={() => {
            let payload = "back"

            if (flip === "back"){
              payload = "front"
            }

            dispatch({
              type: "type",
              payload: payload
            })
          }} 
          style={styles.flipButton}
          disabled={pending}>
            <Text style={styles.flipButtonText}>Flip</Text>
        </TouchableOpacity>
        {pending ? <Text view={styles.loading}>Loading...</Text> : null}
      </Camera> 
      <View style={styles.cameraDrawer}>
        <TouchableOpacity
          onPress={takePicture}
          style={styles.cameraButton}
          disabled={pending}>
          <Entypo 
            style={styles.icons}
            name="camera"/>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  loading: {
    color: "#FFFFFF",
    fontSize: 25 / PixelRatio.getFontScale(),
    width: "100%",
    borderColor: "#000000",
    borderHeight: 500,
    borderWidth: 500,
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000000",
    textShadowColor: "#000000",
    textShadowOffset: 1
  },
  camera: {
    flex: 5,
    width: "100%",
    justifyContent: "flex-start",
    alignItems: "flex-start"
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
    fontSize: 30 / PixelRatio.getFontScale()
  },
  flipButton: {
    width: "25%",
    height: "10%",
    backgroundColor: "#808080",
    justifyContent: "center",
    alignItems: "center",
    opacity: 0.5
  },
  flipButtonText: {
    fontSize: 20 / PixelRatio.getFontScale()
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

export default React.forwardRef(CameraElement)