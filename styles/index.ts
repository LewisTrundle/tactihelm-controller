import { StyleSheet, Dimensions } from 'react-native';

const {width, height} = Dimensions.get('window');
const metrics = {
  screenWidth: width < height ? width : height,
  screenHeight: width < height ? height : width,
  fullWidth: '100%',
  fullHeight: '100%'
};

const colors = {
  grey: '#212427',//'#3F3B4A',
  white: '#F6F7FC',
  pink: '#E63462',
  green: '#2a9d8f',
  tomato: '#FF6060',
  orange: '#FC7A1E'
};

const styles = StyleSheet.create({
  center: {
    justifyContent: "center",
  },
  container: {
    flex: 1,
    backgroundColor: colors.grey,
  },
  heartRateTitleWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  heartRateTitleText: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginHorizontal: 20,
    color: "black",
  },
  heartRateText: {
    fontSize: 25,
    marginTop: 15,
  },
  header: {
    flex: 1,
    bottom: 50,
  },
});

const homeStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.grey,
    justifyContent: "center",
    alignItems: "center",
  },
  contentContainer: {
    flex: 1
  },
  footerContainer: {
    backgroundColor: colors.white,
    height: 60,
    width: "100%",
    bottom: 30,
  },
  footerText: {
    fontSize: 15,
    fontWeight: "bold",
    color: colors.grey,
    alignSelf: "center",
    textAlign: "center",
  }
});

const deviceScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.grey,
  },
  devicesContainer: {
    flex: 7,
    justifyContent: "center",
    padding: 25
  },
  deviceIconContainer: {
    alignSelf: "center",
  },
  deviceInfoText: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.white,
    textAlign: "justify",
  },
  discoveryMessage: {
    fontSize: 25,
    fontWeight: "bold",
    color: colors.white,
    alignSelf: "center",
    top: "50%",
    textAlign: "center",
  },
  buttonsContainer: {
    flex: 3,
    justifyContent: "center",
  }
});


const buttonStyles = StyleSheet.create({
  primaryButton: {
    backgroundColor: colors.pink,
    justifyContent: "center",
    alignItems: "center",
    height: 80,
    marginHorizontal: 30,
    borderRadius: 5,
    marginBottom: 10
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.white,
  },
  buttonDisabled: {
    opacity: 0.5
  },
  secondaryButton: {
    backgroundColor: colors.orange,
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    marginHorizontal: 20,
    marginBottom: 5,
    borderRadius: 8,
  },
  secondaryButtonText: {
    fontSize: 20,
    color: colors.white,
  },
});

const modalStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
  },
  content: {
    backgroundColor: colors.white,
    padding: 16,
    margin: 16,
    borderRadius: 14,
  },
  titleText: {
    alignSelf: "center",
    textAlign: "center",
    fontSize: 20,
  },
  messageText: {
    fontSize: 14,
    marginTop: 4,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  confirmButton: {
    alignSelf: 'center',
    backgroundColor: colors.green,
    paddingVertical: 8,
    paddingHorizontal: 24,
    marginTop: 16,
    borderRadius: 8,
  },
  confirmButtonText: {
    color: colors.white,
  },
});

const debugStyles = StyleSheet.create({
  container: {
    flexDirection: "column",
  },
  sendTextContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  sendText: {
    flex: 9,
  },
  sendButton: {
    flex: 1
    //backgroundColor: "green"
  },
})

export { styles, homeStyles, deviceScreenStyles, buttonStyles, modalStyles, debugStyles }