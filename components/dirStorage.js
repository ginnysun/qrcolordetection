import { Platform } from 'react-native';
const RNFS = require('react-native-fs');

export const dirHome = Platform.select({
  ios: `${RNFS.DocumentDirectoryPath}/qrcodetest`,
  android: `${RNFS.ExternalDirectoryPath}/qrcodetest`
});

export const dirPictures = `${dirHome}/Pictures`;
export const dirAudio = `${dirHome}/Audio`;
