import { TouchableOpacity, Text, View, Image, StyleSheet, PixelRatio } from "react-native"

const Picture = ({image, dispatch, MediaLibrary, pending}) => {
  return(
    <View style={styles.container}> 
      <Image 
        style={styles.image}
        source={{uri: image}} />
      <View style={styles.imageButtons}>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={() => {
            MediaLibrary.saveToLibraryAsync(image).then(() => {
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
              type: "pending",
              payload: ""
            })
             
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
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
  }
});

export default Picture