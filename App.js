import { useReducer, useEffect, useRef } from 'react'
import { Camera, CameraType } from 'expo-camera'
import Picture from './Picture'
import CameraElement from './Camera'
import * as MediaLibrary from 'expo-media-library'

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

    case "pending":
      return {...state, pending: !state.pending}

    default:
      return state
  }
}

export default function App() {

  const [state, dispatch] = useReducer(reducer, {
    image: "",
    flip: "front",
    type: CameraType.front,
    autoFocus: Camera.Constants.AutoFocus.off,
    flash: Camera.Constants.FlashMode.off,
    pending: false
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

  const cameraRef = useRef(null)

  return (
    <>
      {
        state.image === "" ? 
        <CameraElement 
          ref={cameraRef}
          type={state.type}
          flash={state.flash}
          flip={state.flip}
          dispatch={dispatch}
          pending={state.pending}
          autoFocus={state.autoFocus} /> 
        : 
        <Picture 
          image={state.image}
          dispatch={dispatch}
          MediaLibrary={MediaLibrary}
          pending={state.pending} />
      }
    </>
  );
}