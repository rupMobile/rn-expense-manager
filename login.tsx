import React, { useEffect, useState, useCallback } from "react";
import {
  Alert,
  Image,
  Linking,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import LottieView from "lottie-react-native";
import { scale, verticalScale } from "react-native-size-matters";
import { SafeAreaView } from "react-native-safe-area-context";
import { isTablet } from "react-native-device-info";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { useDispatch, useSelector } from "react-redux";
import { appleAuthAndroid } from "@invertase/react-native-apple-authentication";
import uuid from "react-native-uuid";
import auth from "@react-native-firebase/auth";

import { windowheight, windowwidth } from "../../dimensions/dimension";
import { Assets } from "../../resources/images/ImagePath";
import { Alert_Strings, Strings } from "../../resources/string/strings";
import { fonts } from "../../resources/font/fonts";
import { Colors, getTextColor } from "../../resources/colors/Colors";
import { Links } from "../../resources/links/links";
import { Loader } from "../../component/modal/Loader";
import { translate } from "../../../localization";
import { storeUserEmail, storeUserName } from "../../../firebase/Queries";
import { profile, remoteConfigObject } from "../../../redux/ThemeSlice";
import useNetworkStatus from "../../component/useNetworkStatus";
import {
  SignUp,
  Signinbtn,
  linkAnonymousToGoogle,
  logInLocalStoreData,
  onGoogleButtonPress,
  sendSignUpMail,
} from "./LogIn";

// Constants
const GOOGLE_WEB_CLIENT_ID = "824121266427-kmotrjo6bdl0oodsk6bjn34rn378bdn6.apps.googleusercontent.com";
const APPLE_CLIENT_ID = "com.atharva.spendable";
const APPLE_REDIRECT_URI = "https://expensetracker-c9ece.firebaseapp.com/__/auth/handler";
const PRIVATE_EMAIL_DOMAIN = "@privaterelay.appleid.com";
const DEFAULT_USER_NAMES = {
  APPLE: "Apple User",
  YAHOO: "Yahoo User",
};

// Types
interface LoginProps {
  navigation: any;
  route: {
    params?: {
      sharedEventID?: string;
      isFamilySharing?: boolean;
      isShoppingList?: boolean;
      anonymous?: boolean;
    };
  };
}

const isTabletDevice = isTablet();

const Login: React.FC<LoginProps> = ({ navigation, route }) => {
  const isConnected = useNetworkStatus();
  const remoteConfigValues: remoteConfigObject = useSelector(
    (state) => state.remoteconfigvalues
  );
  const theme = useSelector((state: any) => state.theme.theme);
  const dispatch = useDispatch();

  // Extract route params with defaults
  const routeParams = route?.params || {};
  const {
    sharedEventID,
    isFamilySharing = false,
    isShoppingList = false,
    anonymous = false
  } = routeParams;

  // State management
  const [isLoader, setIsLoader] = useState<boolean>(false);
  const [isContinueWithEmailModal, setIsContinueWithEmailModal] = useState<boolean>(false);

  // Initialize Google Sign-In configuration
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: GOOGLE_WEB_CLIENT_ID,
    });
  }, []);

  // Helper function to handle network connectivity check
  const checkNetworkAndExecute = useCallback((callback: () => void) => {
    if (!isConnected) {
      Alert.alert("", translate(Alert_Strings.networkerror));
      return;
    }
    callback();
  }, [isConnected]);

  // Helper function to handle authentication errors
  const handleAuthError = useCallback((error: any, provider: string) => {
    console.error(`${provider} authentication error:`, error);
    Alert.alert("Error", `${provider} sign-in failed. Please try again.`);
    setIsLoader(false);
  }, []);

  // Helper function to store user data and handle onboarding
  const handleUserDataStorage = useCallback(async (
    email: string | null,
    displayName: string,
    isPrivateEmail: boolean = false
  ): Promise<boolean> => {
    try {
      let isOnBoard = false;
      const emailResult = await storeUserEmail(email || "", displayName);
      
      if (emailResult === "User entry created successfully") {
        isOnBoard = true;
        
        // Send signup email if not a private email
        if (email && !isPrivateEmail) {
          await sendSignUpMail(email, remoteConfigValues.isSendSignUpMail);
        }
      }
      
      await storeUserName(displayName);
      dispatch(profile({ username: displayName }));
      
      return isOnBoard;
    } catch (error) {
      console.error("Error storing user data:", error);
      return false;
    }
  }, [dispatch, remoteConfigValues.isSendSignUpMail]);

  // Google Authentication Handler
  const handleGoogleAuth = useCallback(async () => {
    try {
      setIsLoader(true);
      
      if (anonymous) {
        await linkAnonymousToGoogle(navigation);
      } else {
        await onGoogleButtonPress(
          navigation,
          sharedEventID,
          isFamilySharing,
          isShoppingList,
          remoteConfigValues
        );
      }
    } catch (error) {
      handleAuthError(error, "Google");
    } finally {
      setIsLoader(false);
    }
  }, [
    anonymous,
    navigation,
    sharedEventID,
    isFamilySharing,
    isShoppingList,
    remoteConfigValues,
    handleAuthError
  ]);

  // Apple Authentication Handler
  const handleAppleAuth = useCallback(async () => {
    try {
      setIsLoader(true);

      if (!appleAuthAndroid.isSupported) {
        Alert.alert("Error", "Apple Sign-In is not supported on this device.");
        return;
      }

      const rawNonce = uuid.v4();
      const state = uuid.v4();

      appleAuthAndroid.configure({
        clientId: APPLE_CLIENT_ID,
        redirectUri: APPLE_REDIRECT_URI,
        responseType: appleAuthAndroid.ResponseType.ALL,
        scope: appleAuthAndroid.Scope.ALL,
        nonce: rawNonce,
        state,
      });

      const response = await appleAuthAndroid.signIn();
      
      if (response.state !== state) {
        throw new Error("State mismatch in Apple authentication");
      }

      const appleCredential = auth.AppleAuthProvider.credential(
        response?.id_token,
        response?.nonce
      );

      await auth().signInWithCredential(appleCredential);

      const currentUser = auth().currentUser;
      const email = currentUser?.email || null;
      const displayName = currentUser?.displayName || DEFAULT_USER_NAMES.APPLE;
      const isPrivateEmail = email?.includes(PRIVATE_EMAIL_DOMAIN) || false;

      const isOnBoard = await handleUserDataStorage(email, displayName, isPrivateEmail);

      logInLocalStoreData(
        navigation,
        sharedEventID,
        isFamilySharing,
        isShoppingList,
        isOnBoard
      );
    } catch (error) {
      handleAuthError(error, "Apple");
    } finally {
      setIsLoader(false);
    }
  }, [
    navigation,
    sharedEventID,
    isFamilySharing,
    isShoppingList,
    handleUserDataStorage,
    handleAuthError
  ]);

  // Yahoo Authentication Handler
  const handleYahooAuth = useCallback(async () => {
    try {
      setIsLoader(true);

      const provider = new auth.OAuthProvider("yahoo.com");
      provider.addScope("profile");
      provider.addScope("email");
      provider.setCustomParameters({
        prompt: "login",
        language: "en-us",
      });

      await auth().signInWithRedirect(provider);

      const currentUser = auth().currentUser;
      const email = currentUser?.email || null;
      const displayName = currentUser?.displayName || DEFAULT_USER_NAMES.YAHOO;

      const isOnBoard = await handleUserDataStorage(email, displayName);

      logInLocalStoreData(
        navigation,
        sharedEventID,
        isFamilySharing,
        isShoppingList,
        isOnBoard
      );
    } catch (error) {
      handleAuthError(error, "Yahoo");
    } finally {
      setIsLoader(false);
    }
  }, [
    navigation,
    sharedEventID,
    isFamilySharing,
    isShoppingList,
    handleUserDataStorage,
    handleAuthError
  ]);

  // Render Functions
  const renderSignUpModal = useCallback(() => (
    <SignUp
      netConnectivity={isConnected}
      onClose={() => setIsContinueWithEmailModal(false)}
      visibility={isContinueWithEmailModal}
      navigation={navigation}
      sharedEventID={sharedEventID}
      isFamilySharing={isFamilySharing}
      isShoppingList={isShoppingList}
    />
  ), [isConnected, isContinueWithEmailModal, navigation, sharedEventID, isFamilySharing, isShoppingList]);

  const renderHeader = useCallback(() => (
    <View style={[styles.topview, { flex: 1, justifyContent: "flex-end" }]}>
      <View style={{ justifyContent: "center" }}>
        <LottieView
          style={styles.bganimation}
          resizeMode="cover"
          source={require("../../resources/animations/bg.json")}
          autoPlay
          loop
        />
        <Image
          source={theme === "DARK" ? Assets["icn_dark"] : Assets["icn_light"]}
          style={styles.appicon}
        />
      </View>
    </View>
  ), [theme]);

  const renderWelcomeText = useCallback(() => (
    <View>
      <Text
        style={[
          styles.bottomtxt,
          {
            fontSize: isTabletDevice ? 22 : 20,
            color: theme === "DARK" ? Colors.white : Colors.black,
          },
        ]}
      >
        {translate(Strings.loginscreen1)}
      </Text>
      <Text
        style={[
          styles.bottomtxt,
          {
            color: Colors.grey,
            fontSize: isTabletDevice ? 20 : 16,
            marginHorizontal: 8,
            fontFamily: fonts.REGULAR,
            marginTop: -6,
          },
        ]}
      >
        {translate(Strings.loginscreen2)}
      </Text>
    </View>
  ), [theme]);

  const renderAuthButtons = useCallback(() => (
    <View style={styles.authButtonsContainer}>
      <Signinbtn
        type="google"
        press={() => checkNetworkAndExecute(handleGoogleAuth)}
      />
      <Signinbtn
        type="apple"
        press={() => checkNetworkAndExecute(handleAppleAuth)}
      />
      <Signinbtn
        type="yahoo"
        press={() => checkNetworkAndExecute(handleYahooAuth)}
      />
      <Signinbtn
        type="mail"
        press={() => setIsContinueWithEmailModal(true)}
      />
    </View>
  ), [checkNetworkAndExecute, handleGoogleAuth, handleAppleAuth, handleYahooAuth]);

  const renderPrivacyPolicy = useCallback(() => (
    <View>
      <Text
        style={[
          styles.bottomtxt,
          {
            fontSize: isTabletDevice ? 18 : 12,
            color: getTextColor(theme),
          },
        ]}
      >
        {translate(Strings.privacypolicydescription)}
      </Text>
      <View style={{ flexDirection: "row", justifyContent: "center" }}>
        <Text
          style={[styles.linkText, { fontSize: isTabletDevice ? 18 : 12 }]}
          onPress={() => Linking.openURL(Links.PRIVACY_POLICY)}
        >
          {translate(Strings.privacy)}
        </Text>
        <Text
          style={[
            styles.bottomtxt,
            {
              fontSize: isTabletDevice ? 18 : 12,
              color: theme === "DARK" ? Colors.white : Colors.black,
              fontFamily: fonts.SEMIBOLD,
            },
          ]}
        >
          {" "}&{" "}
        </Text>
        <Text
          style={[styles.linkText, { fontSize: isTabletDevice ? 16 : 12 }]}
          onPress={() => Linking.openURL(Links.TERMS_USE)}
        >
          {translate(Strings.termofuse)}
        </Text>
      </View>
    </View>
  ), [theme]);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme === "DARK" ? Colors.darkprimary : Colors.white,
        },
      ]}
    >
      <SafeAreaView
        edges={["top"]}
        style={{
          backgroundColor:
            theme === "DARK" ? Colors.darkprimary : Colors.lightprimary,
        }}
      />
      <Loader isVisible={isLoader} />
      <StatusBar
        backgroundColor={
          theme === "DARK" ? Colors.darkprimary : Colors.lightprimary
        }
        barStyle={theme === "DARK" ? "light-content" : "dark-content"}
      />
      {renderSignUpModal()}
      {renderHeader()}
      <View
        style={[
          styles.btncontainer,
          { flex: 1, justifyContent: "flex-end", paddingBottom: 20 },
        ]}
      >
        {renderWelcomeText()}
        {renderAuthButtons()}
        {renderPrivacyPolicy()}
      </View>
    </View>
  );
};
export default Login;
const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center" },
  bganimation: {
    width: scale(windowwidth),
    height: isTabletDevice ? scale(windowheight / 9) : scale(windowheight / 4.5),
    aspectRatio: 2.5,
  },
  topview: {
    alignItems: "center",
  },
  appicon: {
    position: "absolute",
    height: isTabletDevice ? verticalScale(80) : verticalScale(100),
    width: isTabletDevice ? scale(70) : scale(100),
    alignSelf: "center",
  },
  bottomtxt: {
    fontSize: isTabletDevice ? 22 : 16,
    textAlign: "center",
    fontFamily: fonts.SEMIBOLD,
  },
  txtview: {
    marginTop: verticalScale(windowheight / 8),
  },
  btncontainer: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    borderRadius: 20,
  },
  btnview: {
    paddingVertical: isTabletDevice ? 15 : 10,
    width: isTabletDevice ? scale(windowwidth / 2.5) : scale(windowwidth / 1.3),
    borderWidth: 1,
    borderColor: Colors.grey,
    borderRadius: isTabletDevice ? scale(5) : scale(10),
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 5,
  },
  googleicon: {
    height: verticalScale(25),
    width: isTabletDevice ? scale(20) : scale(25),
    marginRight: scale(8),
    resizeMode: "contain",
  },
  personicon: {
    height: verticalScale(25),
    resizeMode: "contain",
    width: isTabletDevice ? scale(20) : scale(23),
    marginRight: scale(8),
    tintColor: Colors.white,
  },
  bottomtxtview: {
    marginTop: 15,
  },
  authButtonsContainer: {
    justifyContent: "space-around",
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 30,
  },
  linkText: {
    color: Colors.blue,
    fontSize: isTabletDevice ? 18 : 12,
    fontFamily: fonts.SEMIBOLD,
    textDecorationLine: "underline",
  },
});
