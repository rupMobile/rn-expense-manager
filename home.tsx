// ============================================================================
// CORE REACT & REACT NATIVE IMPORTS
// ============================================================================
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated as RNanimated,
  AppState,
  Image,
  Modal,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
  NativeModules,
  ToastAndroid,
  BackHandler,
  ScrollView,
  InteractionManager,
  Alert,
} from "react-native";

// ============================================================================
// TYPESCRIPT INTERFACES
// ============================================================================
interface HomeProps {
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

interface ReduxState {
  currency: any;
  currencyCode: string;
  currencyConverter: any;
  theme: any;
  themeColor: string;
  locale: any;
  locallanguage: any;
  rootState: any;
}

// ============================================================================
// THIRD-PARTY LIBRARY IMPORTS
// ============================================================================
import { scale, verticalScale } from "react-native-size-matters";
import { useIsFocused } from "@react-navigation/native";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { isTablet } from "react-native-device-info";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import WheelPicker from "react-native-wheely";
import auth from "@react-native-firebase/auth";
import database from "@react-native-firebase/database";
import DeviceInfo from "react-native-device-info";
import { useQuery, useRealm } from "@realm/react";
import { SafeAreaView } from "react-native-safe-area-context";
import { unstable_batchedUpdates } from "react-native";
import Animated, {
  Easing,
  FadeInUp,
  FadeOutUp,
  Layout,
} from "react-native-reanimated";

// ============================================================================
// LOCAL COMPONENT IMPORTS
// ============================================================================
import {
  Colors,
  getIconColor,
  getModalBackground,
  getScreenBackground,
  getSecondaryBackground,
  getTextColor,
} from "../../resources/colors/Colors";
import {
  CategoryType,
  expenseCategories,
  ExpenseType,
  incomeCategories,
  month,
  paymentSource,
  timestamp,
  WalletType,
} from "../../component/modal/CategoryModals";
import {
  getSumOfExpense,
  getSumOfIncome,
} from "../../component/modal/SumOfAmount";
import { Alert_Strings, Strings } from "../../resources/string/strings";
import { Assets } from "../../resources/images/ImagePath";
import { Loader } from "../../component/modal/Loader";
import { getShortStringRepresentation } from "../../component/getAmountWithSign";
import { dateFormating, getMonthAndYear } from "../../component/DateFormatting";
import { BannerAds } from "../../component/Ads/BannerAds";
import { AppUpdateModal } from "../../component/AppUpdate/AppUpdateModal";
import { ProxyModal } from "../../component/modal/Proxy";
import { RatingModal } from "../../component/modal/Rating";
import { NewFeatureModal } from "../../component/modal/NewFeature";
import { OverViewModal } from "../Overview/OverView";
import { AppVersionModal } from "../../component/AppUpdate/AppVersionModal";
import { SalesPageModal } from "../../component/modal/SalesPageModal";
import { OnBoardingModal } from "../onboard/Onboard";
import { FeatureSlider } from "../../component/Slider/FeatureSlider";
import { NewInAppPurchase } from "../../component/InAppPurchase/InAppPurchase";
import { loadGdprAdsConsent } from "../../component/Ads/adsConsent";
import AppOpenAdComponent from "../../component/Ads/AppOpen";
import useNetworkStatus from "../../component/useNetworkStatus";
import { HeaderForDelete } from "../search/Search";

// ============================================================================
// FIREBASE & DATABASE IMPORTS
// ============================================================================
import {
  deleteExpenseFromDb,
  fetchAllData,
  fetchLastVisitedOnBoardScreen,
  fetchOnlyCategories,
  fetchPaymentSource,
  fetchSliderData,
  isUserFreeFunc,
  isUserGoalStored,
  storeLastOnboardSkippedDate,
} from "../../../firebase/Queries";
import {
  deleteAllRTransactions,
  deleteLocalTransaction,
  getLocalData,
  storeDataInRealm,
} from "../../database/realm/realmQueries";

// ============================================================================
// REDUX IMPORTS
// ============================================================================
import {
  appOpenAdCountUpdate,
  salesPageShownDateUpdate,
  updateAppOpen,
  updateAppVersion,
  updateFeatureSliderData,
  updateHideBottomTab,
  updateNewFeature,
  updateOnboardSkipDate,
  updateProxyState,
  updateRatingPopUpFlag,
  updateTimeFilterTooltip,
  updatingOpenAiFlag,
} from "../../../redux/ThemeSlice";

// ============================================================================
// LOCAL FEATURE IMPORTS
// ============================================================================
import {
  AiLottieView,
  AiModal,
  MemoizedOfflineBannerAds,
  ScanReceiptOptions,
  TimePeriodMenu,
  deleteNormalTransaction,
  filterSelectedTimeStamp,
  getFirstAndLastDate,
  setDefaultReminder,
  storeNotesLocally,
  updateScanCountInBoth,
  whenDataIsOnAddAndDeleteData,
  remoteConfigFuncion,
} from "./Home";
import {
  addDataToDatabase,
  deleteImageFromAws,
  deleteImageFromAwsSwipe,
  getDataFromDatabase,
} from "../bottomsheet/BottomSheet";
import { isPurchasedFunc } from "../inapppurcahse/InAppPurcahse";
import {
  analyticsStr,
  fireAnalyticsEvent,
  newAnalyticStr,
} from "../../resources/analytics/analytics";
import { FeatureSliderItemType } from "./featureSlider";
import { getWeeks } from "./getWeeks";
import { TransactionsData } from "./Transactions";
import { TimeStampFilterView, TimeStampType } from "./TimeStampFilterView";
import { styles } from "./style";
import { useDecryptRealmDataNew } from "./localFunctions";

const { WidgetUpdater } = NativeModules;

let selectedTimeStamp: any = timestamp[0];
let previousFilter: any =
  moment(new Date()).format("MMMM") + ", " + moment(new Date()).format("YYYY");
let selectedIndexMonth: number = new Date().getMonth();
let selectedIndexYear: number = 0;
let selectedIndexOnlyYear: number = 0;
let globalDate: any = new Date();

const Home: React.FC<HomeProps> = ({ navigation, route }) => {
  const realm = useRealm();
  const isConnected = useNetworkStatus();
  const dispatch = useDispatch();

  const updateWidgetData = async (data) => {
    // Make sure data is a string
    try {
      if (typeof data === "string") {
        WidgetUpdater.updateWidget(data);
      } else {
        console.error("Data passed is not a string:", data);
      }
    } catch (error) {
      console.error("Error updating widget:", error);
    }
  };
  // ============================================================================
  // REDUX STATE SELECTORS - ORGANIZED BY CATEGORY
  // ============================================================================
  
  // Core App State
  const {
    currency,
    currencyCode,
    currencyConverter,
    theme,
    themeColor,
    locale,
    locallanguage,
    rootState,
  } = useSelector(
    (state: any) => ({
      currency: state.currency.currency,
      currencyCode: state.currency.currencycode,
      currencyConverter: state.currencyconverter.currencyConverter.currencyConverter,
      theme: state.theme.theme,
      themeColor: state.themecolor.themeColor,
      locale: state.locale.locale,
      locallanguage: state.locallanguage.locallanguage,
      rootState: state,
    }),
    shallowEqual
  );

  // User & Rating State
  const {
    isRatingPopUp,
    reviewCount,
    isUserReviewed,
    wallet,
  } = useSelector(
    (state: any) => ({
      isRatingPopUp: state.ratingpopup.isRatingPopUp,
      reviewCount: state.ratingcount,
      isUserReviewed: state.forcereview.isUserReviewed107,
      wallet: state.wallet,
    }),
    shallowEqual
  );

  // Feature & Configuration State
  const {
    remoteConfigValues,
    scanCount,
    appopenadcount,
    isNewFeature,
    lastAppVersion,
    featureSliderDataRedux,
    isOpenAi,
  } = useSelector(
    (state: any) => ({
      remoteConfigValues: state.remoteconfigvalues,
      scanCount: state.scancount.scanCount,
      appopenadcount: state.appopenadcount.appopenad,
      isNewFeature: state.newfeature.isNewFeatureShown,
      lastAppVersion: state.lastAppVersion.lastAppVersion,
      featureSliderDataRedux: state.featuresliderdata,
      isOpenAi: state.openai.isOpenAi,
    }),
    shallowEqual
  );

  // System & Sync State
  const {
    proxy,
    salespagedate,
    isCountryAvailable,
    isDateChanged,
    reminder,
    isSyncSms,
    isAutomated,
    lastOnBoardSkipDate,
  } = useSelector(
    (state: any) => ({
      proxy: state.proxy.isProxy,
      salespagedate: state.salespage.salesPageShownDate,
      isCountryAvailable: state.country.isCountryAvailable,
      isDateChanged: state.datechange.isDateChanged,
      reminder: state.remindertime,
      isSyncSms: state.syncsms.isSyncSms,
      isAutomated: state.syncsms.isAutomated,
      lastOnBoardSkipDate: state.onboardskipdate.lastOnBoardSkipDate,
    }),
    shallowEqual
  );

  const isUserPremium = useMemo(() => isPurchasedFunc(rootState), [rootState]);
  const isUserPremiumPlus = useMemo(
    () => isPurchasedFunc(rootState, true),
    [rootState]
  );

  const shouldShowBannerAds =
    !isUserPremium && !remoteConfigValues.hideBannerAds;
  //States
  const [isTimePeriodMenu, setIsTimePeriodMenu] = useState<boolean>(false);
  const [allData, setAllData] = useState<any>([]);
  const [filteredArray, setFilteredArray] = useState<any>([]);
  const [totalIncome, setTotalIncome] = useState<number>(0);
  const [totalExpense, setTotalExpense] = useState<number>(0);
  const [balance, setBalance] = useState<number>(0);
  const [isLoader, setIsLoader] = useState<boolean>(false);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [timeStampText, setTimeStampText] = useState<string>(
    moment(new Date()).format("MMMM") + ", " + moment(new Date()).format("YYYY")
  );
  const [rateUs, setRateUs] = useState<boolean>(false);
  const [isDatePickerVisible, setDatePickerVisibility] =
    useState<boolean>(false);
  const [showMonthPicker, setShowMonthPicker] = useState<boolean>(false);
  const [showYearPicker, setShowYearPicker] = useState<boolean>(false);
  const [showWeekPicker, setShowWeekPicker] = useState<boolean>(false);
  const [showCustomPicker, setShowCustomPicker] = useState<boolean>(false);
  const [year, setYear]: any[] = useState([new Date().getFullYear()]);
  const [week, setWeeks] = useState<any>([]);
  const [isPrimaryGoals, setIsPrimaryGoals] = useState<boolean>(false);
  const [isAppUpdateModal, setIsAppUpdateModal] = useState<boolean>(false);
  const [isAiModal, setIsAiModal] = useState<boolean>(false);
  const [filterTooltip, setFilterTooltip] = useState<boolean>(false);
  const [expenseIncomeArr, setExpenseIncomeArr] = useState<any>([]);
  const [isExpenseSelected, setIsExpenseSelected] = useState<boolean>(false);
  const [isIncomeSelected, setIsIncomeSelected] = useState<boolean>(false);
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);
  const [isProHome, setIsProHome] = useState<boolean>(false);
  const [customDate, setCustomDate] = useState<string>("");
  const [isCustomStartDatePicker, setIsCustomStartDatePicker] =
    useState<boolean>(false);
  const [isCustomEndDatePicker, setIsCustomEndDatePicker] =
    useState<boolean>(false);
  const [selectedCustomDate, setSelectedCustomDate] = useState<String>("");
  const [startCustomDate, setStartCustomDate] = useState<String>("");
  const [endCustomDate, setEndCustomDate] = useState<String>("");
  const [isNewFeatureModal, setIsNewFeatures] = useState<boolean>(false);
  const [isScanOptions, setIsScanOptions] = useState<boolean>(false);
  const [isOverView, setIsOverView] = useState<boolean>(false);
  const [isAddCatModalOpen, setIsAddCatModalOpen] = useState<boolean>(false);
  const [weekIndex, setWeekIndex] = useState<number>(0);
  const [monthIndex, setMonthIndex] = useState<number>(0);
  const [yearIndex, setYearIndex] = useState<number>(0);
  const [onlyYearIndex, setOnlyYearIndex] = useState<number>(0);
  const [backPressedOnce, setBackPressedOnce] = useState(false);
  const [isSeeAll, setIsSeeAll] = useState<boolean>(false);
  const [isNewSmsdata, setIsNewSmsData] = useState<boolean>(false);
  const [sliderData, setSliderData] = useState<FeatureSliderItemType[]>(
    featureSliderDataRedux
  );
  const [firstDate, setFirstDate] = useState<number>(moment().valueOf());
  const [lastDate, setLastDate] = useState<number>(moment().valueOf());
  const [isDeleteMultiple, setIsDeleteMultiple] = useState<boolean>(false);
  const getCurrentMonthRange = (): [number, number] => [
    moment().startOf("month").unix(),
    moment().endOf("month").unix(),
  ];
  const [isEditAllMenu, setIsEditAllMenu] = useState<boolean>(false);
  const [encryptedData, setEncryptedData] = useState<ExpenseType[]>([]);
  const [selectedData, setSelectedData] = useState<ExpenseType[]>([]);
  const [selectedEncryptedData, setSelectedEncryptedData] = useState<
    ExpenseType[]
  >([]);
  const [totalSelectedBalance, setSelectedBalance] = useState<number>(0);
  const [catArr, setCatArr] = useState<CategoryType[]>(
    expenseCategories.concat(incomeCategories)
  );
  const [wallets, setWallets] = useState<WalletType[]>(paymentSource);

  const [dateRange, setDateRange] =
    useState<[number, number]>(getCurrentMonthRange);

  //Refrences
  const appOpenAddAdRef = useRef(null);
  const rotateAnim = useRef(new RNanimated.Value(0)).current;

  //Animation logics
  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "-360deg"], // Rotate 180 degrees when clicked
  });

  const isFocused = useIsFocused();

  const weeks = useMemo(() => {
    if (!allData?.length) {
      const startOfWeek = moment().startOf("week").format("MMM D, YYYY");
      const endOfWeek = moment().endOf("week").format("MMM D, YYYY");
      return [`${startOfWeek} - ${endOfWeek}`];
    }

    return getWeeks(allData);
  }, [allData]);

  useEffect(() => {
    dispatch(updateHideBottomTab({ isHideBottomTab: false }));
    const getCategories = async () => {
      const cat = await fetchOnlyCategories();
      setCatArr([...cat, ...catArr]);
    };

    const getWallets = async () => {
      const wallet = await fetchPaymentSource();
      setWallets([...wallet, ...wallets]);
    };

    getCategories();
    getWallets();
  }, []);

  const loadLastVisited = async () => {
    const lastVisitedScreen = await fetchLastVisitedOnBoardScreen();

    console.log("lastVisitedScreen", lastOnBoardSkipDate);

    const now = moment().unix();

    // convert days → seconds
    const skipWindow = remoteConfigValues.onBoardSkipDays * 24 * 60 * 60;

    // If still inside skip window → exit early
    if (lastOnBoardSkipDate && now - lastOnBoardSkipDate < skipWindow) {
      return;
    }

    // null means no skip history, so continue showing onboarding

    if (lastVisitedScreen === "lastView") return;

    Alert.alert(
      lastVisitedScreen == null ? "You’re Missing Out!" : "Almost There!",
      lastVisitedScreen == null
        ? "90% of users who complete the intro flow save more."
        : "Complete onboarding to start tracking smarter.",
      [
        {
          text: "Not Now",
          style: "cancel",
          onPress: () => {
            dispatch(updateOnboardSkipDate());
            storeLastOnboardSkippedDate();
          },
        },
        {
          text: "Let's Go",
          onPress: () =>
            navigation.navigate("newonboard", {
              lastVisitedScreen,
              fromHome: true,
            }),
        },
      ]
    );
  };

  useEffect(() => {
    setWeeks(weeks);
  }, [weeks]);

  //Initial hooks
  useEffect(() => {
    let backPressTimer: NodeJS.Timeout;

    const backAction = () => {
      if (!isFocused) return false;

      if (backPressedOnce) {
        BackHandler.exitApp();
      } else {
        setBackPressedOnce(true);
        ToastAndroid.show("Press again to exit", ToastAndroid.SHORT);

        // ✅ Clear previous timer before setting a new one
        if (backPressTimer) clearTimeout(backPressTimer);
        backPressTimer = setTimeout(() => setBackPressedOnce(false), 2000);
      }

      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => {
      if (backPressTimer) clearTimeout(backPressTimer); // 🔒 cleanup
      backHandler.remove();
    };
  }, [backPressedOnce, isFocused]);

  useEffect(() => {
    const loadConsent = async () => {
      try {
        await loadGdprAdsConsent();
      } catch (err) {
        console.error("❌ Failed to load GDPR consent:", err);
      }
    };

    loadConsent();
  }, []);

  const filterData = async (item: string, monthYear?: any) => {
    selectedTimeStamp = item;

    let start: number;
    let end: number;
    let timeStamp = "";

    switch (item) {
      case "Daily": {
        start = moment(globalDate).startOf("day").unix();
        end = moment(globalDate).endOf("day").unix();
        timeStamp = dateFormating(globalDate);
        break;
      }

      case "Weekly": {
        const [startStr, endStr] = previousFilter.split(" - ");
        start = moment(startStr, "MMM D, YYYY").startOf("day").unix();
        end = moment(endStr, "MMM D, YYYY").endOf("day").unix();
        timeStamp = previousFilter;
        break;
      }

      case "Monthly": {
        const formatted =
          typeof monthYear === "string"
            ? monthYear
            : moment(monthYear).format("MMMM YYYY");
        start = moment(formatted, "MMMM YYYY").startOf("month").unix();
        end = moment(formatted, "MMMM YYYY").endOf("month").unix();
        timeStamp = formatted;
        previousFilter = timeStamp;
        break;
      }

      case "Yearly": {
        const yearVal = year[selectedIndexOnlyYear];
        start = moment(yearVal, "YYYY").startOf("year").unix();
        end = moment(yearVal, "YYYY").endOf("year").unix();
        timeStamp = yearVal;
        previousFilter = timeStamp;
        break;
      }

      case "All": {
        previousFilter = "All";
        timeStamp = "All";
        start = firstDate / 1000;
        end = lastDate / 1000;

        // Instead of setting date range, directly update filtered array
        // let decrypted = await decryptData(allData);
        // const sortedByDate = decrypted
        //   .filter((item) => item?.creationDate > 0)
        //   .sort((a, b) => a.creationDate - b.creationDate);
        // start = sortedByDate[0]?.creationDate * 1000;
        // end = sortedByDate[sortedByDate.length - 1]?.creationDate * 1000;
        // setFilteredArray(sortedByDate);
        // setExpenseIncomeArr(sortedByDate);
        // getSumOfIncomeAndExpense(sortedByDate);
        // setTimeStampText(timeStamp);
        break;
      }

      case "Custom": {
        if (monthYear && typeof monthYear === "string") {
          const [startStr, endStr] = monthYear.split(" - ");
          start = moment(startStr, "MMM D, YYYY").startOf("day").unix();
          end = moment(endStr, "MMM D, YYYY").endOf("day").unix();
          timeStamp = monthYear;
          setStartCustomDate(startStr);
          setEndCustomDate(endStr);
          setCustomDate(monthYear);
          previousFilter = timeStamp;
        } else {
          // If allData is empty or not present, use today's date
          if (!allData || allData.length === 0) {
            const today = moment();
            start = today.startOf("day").unix();
            end = today.endOf("day").unix();
            const formatted = dateFormating(today.valueOf());
            timeStamp = `${formatted} - ${formatted}`;
            setStartCustomDate(formatted);
            setEndCustomDate(formatted);
            setCustomDate(timeStamp);
            previousFilter = timeStamp;
          } else {
            const { start: min, end: max } = allData.reduce(
              (acc, item) => {
                const date = item.creationDate * 1000;
                if (date < acc.start) acc.start = date;
                if (date > acc.end) acc.end = date;
                return acc;
              },
              { start: Infinity, end: -Infinity }
            );
            start = moment(min).startOf("day").unix();
            end = moment(max).endOf("day").unix();
            const minFormatted = dateFormating(min);
            const maxFormatted = dateFormating(max);
            timeStamp = `${minFormatted} - ${maxFormatted}`;
            setStartCustomDate(minFormatted);
            setEndCustomDate(maxFormatted);
            setCustomDate(timeStamp);
            previousFilter = timeStamp;
          }
        }
        break;
      }

      default:
        return;
    }

    setTimeStampText(timeStamp);
    setDateRange([start, end]); // 🔥 triggers useQuery to refetch
  };

  const yearly = (data = allData) => {
    const uniqueYears = new Set(year);
    for (const item of data) {
      uniqueYears.add(new Date(item.creationDate * 1000).getFullYear());
    }
    year.length = 0; // Clear the array while keeping the reference
    year.push(...[...uniqueYears].sort());
    selectedIndexYear = year.indexOf(new Date().getFullYear());
  };

  // useEffect(() => {
  //   cachedDateRange = dateRange;
  // }, [dateRange]);

  const rawCollectionSMS = useQuery(
    "AutomatedTransactions",
    (collection) => collection
  );

  const rawCollection = useQuery("RTransactions", (collection) =>
    collection
      .filtered("isRepeat != true AND isDeleted != true")
      .sorted("creationDate")
  );

  useEffect(() => {
    if (!rawCollection?.length) {
      setWeeks([]);
      return;
    }

    const task = InteractionManager.runAfterInteractions(() => {
      const processData = async () => {
        try {
          const decryptedData = await decryptData(rawCollection);
          if (!decryptedData?.length) {
            setWeeks([]);
            return;
          }

          setAllData(decryptedData);

          const sortedByDate = decryptedData
            .filter((item) => item?.creationDate > 0)
            .sort((a, b) => a.creationDate - b.creationDate);

          const first = sortedByDate[0]?.creationDate * 1000;
          const last =
            sortedByDate[sortedByDate.length - 1]?.creationDate * 1000;

          setFirstDate(first);
          setLastDate(last);

          yearly(decryptedData);
          setWeeks(getWeeks(decryptedData));
        } catch (e) {
          console.error("Error processing transaction data:", e);
          setWeeks([]);
        }
      };

      processData();
    });

    return () => task?.cancel?.();
  }, [rawCollection]);

  // Realm reactive query
  const filteredTransactions = useMemo(() => {
    console.log("dateRange", dateRange);
    return realm
      .objects("RTransactions")
      .filtered(
        "creationDate >= $0 AND creationDate <= $1 AND isRepeat != true AND isDeleted != true",
        dateRange[0],
        dateRange[1]
      )
      .sorted("creationDate", true);
  }, [realm, dateRange]);

  useEffect(() => {
    if (!filteredTransactions) return;

    const handleChange = async (collection, changes) => {
      if (collection.length === 0) {
        setFilteredArray([]);
        setExpenseIncomeArr([]);
        getSumOfIncomeAndExpense([]);
        return;
      }
      setEncryptedData([...collection]);
      const decrypted = await decryptData([...collection]);
      unstable_batchedUpdates(() => {
        getSumOfIncomeAndExpense(decrypted);
        let decryptedFiltered = decrypted.filter((item) =>
          isExpenseSelected
            ? item.category.type == "expense"
            : item.category.type == "income"
        );
        console.log("decrypted", decrypted);

        setFilteredArray(decrypted);
        setExpenseIncomeArr(decryptedFiltered);
      });
    };

    filteredTransactions.addListener(handleChange);

    return () => {
      filteredTransactions.removeAllListeners();
    };
  }, [filteredTransactions, isIncomeSelected, isExpenseSelected]);

  useDecryptRealmDataNew({
    rawCollectionSMS,
    setIsNewSmsData,
  });

  useEffect(() => {
    let Proxy = McheckProxy.detectProxySync();
    if (Proxy) {
      setIsLoader(false);
    }
    dispatch(updateProxyState({ isProxy: Proxy }));
  }, [appStateVisible, isConnected]);

  useEffect(() => {
    let isMounted = true;

    const fetchSlider = async () => {
      try {
        const slider: FeatureSliderItemType[] = await fetchSliderData();
        if (isMounted) {
          dispatch(updateFeatureSliderData(slider));
          setSliderData(slider);
        }
      } catch (error) {
        console.error("Error fetching slider data:", error);
      }
    };

    fetchSlider();

    return () => {
      isMounted = false; // ✅ Prevent setState on unmounted component
    };
  }, []);

  useEffect(() => {
    checkCountryAvailability();

    let task: any = null;
    if ((isConnected || isConnected == null) && !proxy && !isDateChanged) {
      task = InteractionManager.runAfterInteractions(() => {
        initialFunctionCalls(
          dispatch,
          navigation,
          currencyCode,
          // isPurchasedFunc(rootState),
          realm,
          currencyConverter,
          remoteConfigValues,
          isSyncSms,
          isAutomated
        );

        // }
        // initialFunction();
      });
    }

    return () => {
      if (task?.cancel) task.cancel();
    };
  }, []);

  useEffect(() => {
    setTimeout(() => {
      initialSalesPage();
    }, 1000);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setDefaultReminder(reminder, dispatch);
    }, 500);
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
      }
      appState.current = nextAppState;
      setAppStateVisible(appState.current);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    let task: any;

    if (isConnected && !proxy) {
      task = InteractionManager.runAfterInteractions(() => {
        whenDataIsOnAddAndDeleteData(realm);
      });
    }

    return () => {
      if (task?.cancel) task.cancel();
    };
  }, [isConnected, proxy]); // 🔁 also depend on proxy

  useEffect(() => {
    if (
      Number(remoteConfigValues.live_version) >
      Number(DeviceInfo.getBuildNumber())
    ) {
      setIsAppUpdateModal(true);
    }
  }, [DeviceInfo.getBuildNumber()]);

  useEffect(() => {
    if (isConnected && !proxy) {
      setTimeout(() => {
        try {
          if (
            // !remoteConfigValues.hideAd &&
            !remoteConfigValues.hideAppOpenAd &&
            !isUserPremium
          ) {
            if (appopenadcount >= remoteConfigValues.ad_openapp_interval) {
              appOpenAddAdRef.current && appOpenAddAdRef.current.showAd();
              dispatch(appOpenAdCountUpdate({ appopenad: 0 }));
            } else {
              dispatch(appOpenAdCountUpdate({ appopenad: appopenadcount + 1 }));
            }
          } else {
            dispatch(appOpenAdCountUpdate({ appopenad: appopenadcount + 1 }));
          }
        } catch (e) {}
      }, 1000);
    }
    // fetchData(),
    selectedTimeStamp = timestamp[2];
  }, []);

  useEffect(() => {
    const userId = auth()?.currentUser?.uid;
    if (!userId) return;

    const startCountRef = database().ref(`Transactions/${userId}`);

    const handleEmptyData = () => {
      filterData(selectedTimeStamp, previousFilter);
      yearly([]);
      setAllData([]);
      setFilteredArray([]);
      setExpenseIncomeArr([]);
      setIsLoader(false);
      deleteAllRTransactions(realm);
    };

    const onDataChange = async (snapshot) => {
      try {
        const snapshotData = snapshot.val();

        if (!snapshotData) {
          handleEmptyData();
          return;
        }

        const dataArray = Object.values(snapshotData);
        const sortedDataArray = dataArray
          .filter((item) => item?.creationDate > 0)
          .sort((a, b) => a.creationDate - b.creationDate);

        const data = sortedDataArray.filter((item) => !item?.isRepeat);
        const decrypted = await decryptData(data || []);
        setAllData(decrypted || []);
        storeNotesLocally(decrypted, dispatch);

        const first = sortedDataArray[0]?.creationDate * 1000;
        const last =
          sortedDataArray[sortedDataArray.length - 1]?.creationDate * 1000;
        setFirstDate(first);
        setLastDate(last);

        if (previousFilter == "All") {
          setDateRange([first / 1000, last / 1000]);
        }
        yearly(dataArray);
        InteractionManager.runAfterInteractions(() => {
          storeDataInRealm(dataArray, realm).catch((err) => {
            console.error("Realm storage error:", err);
          });
          setIsLoader(false);
        });
      } catch (error) {
        console.error("Error processing Firebase data:", error);
        setIsLoader(false);
      }
    };

    startCountRef.on("value", onDataChange);

    return () => {
      startCountRef.off("value", onDataChange);
    };
  }, []);

  useEffect(() => {
    !isUserReviewed && ratingPopUp();
  }, []);

  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      isUserPremiumPlus && appOpenTransactionFunction(navigation, realm);
    });
  }, []);

  const weekly = () => {
    const lastWeek = week[week.length - 1] || week[0];
    previousFilter = lastWeek;
    setTimeStampText(lastWeek);
    setWeekIndex(week.length - 1);
  };

  const checkCountryAvailability = async () => {
    isCountryValid(remoteConfigValues, dispatch);
  };
  const showTimePeriodMenu = () => {
    setIsTimePeriodMenu(true);
  };
  const closeTimePeriodMenu = () => {
    setIsTimePeriodMenu(false);
  };
  const initialSalesPage = () => {
    if (isCountryAvailable ? isUserPremiumPlus : isUserPremium) {
      checkAvailablePurchase(dispatch);
    }

    const shouldShowSalesPage = isCountryAvailable
      ? !isUserPremiumPlus
      : !isUserPremium;
    const isAppUpdateRequired =
      Number(lastAppVersion) < Number(DeviceInfo.getBuildNumber());

    if (shouldShowSalesPage) {
      if (isNewFeature && isAppUpdateRequired) {
        setIsNewFeatures(true);
      } else {
        salesPage();
        if (!isNewFeature) {
          dispatch(updateNewFeature({ isNewFeatureShown: true }));
          dispatch(
            updateAppVersion({
              lastAppVersion: Number(DeviceInfo.getBuildNumber()),
            })
          );
        }
      }
    } else if (isNewFeature && isAppUpdateRequired) {
      setIsNewFeatures(true);
    }
  };
  const showInAppPurchase = async () => {
    const isFreeUser = await isUserFreeFunc(dispatch);

    // If we couldn't determine the user status, bail early
    if (isFreeUser === undefined || isFreeUser === null) return;

    // If user is free, skip showing the purchase page
    if (isFreeUser) return;

    // Skip if Pro Home shouldn't be shown or user already purchased
    if (
      !remoteConfigValues.showProHome ||
      (isCountryAvailable ? isUserPremiumPlus : isUserPremium)
    )
      return;

    // Festival offer logic
    const today = moment().format("YYYYMMDD");

    if (remoteConfigValues.showFestivalOffer || salespagedate !== today) {
      if (salespagedate !== today) {
        dispatch(salesPageShownDateUpdate({ salesPageShownDate: today }));
      }
      setIsProHome(true);
    } else {
      loadLastVisited();
      // const res = await isUserGoalStored();
      // if (!res) {
      //   setIsPrimaryGoals(true);
      // }
    }
  };

  const toggleView = () => {
    RNanimated.timing(rotateAnim, {
      toValue: isOverView ? 0 : 1, // Toggle between 0 and 1
      duration: 500, // Duration of the rotation animation
      useNativeDriver: true,
    }).start();
    setIsOverView(!isOverView);
  };

  const salesPage = () => {
    setTimeout(() => {
      showInAppPurchase();
    }, 1000);
  };

  const getSumOfIncomeAndExpense = async (data: any) => {
    const totalIncome = getSumOfIncome(data);
    const totalExpense = getSumOfExpense(data);
    setTotalIncome(totalIncome);
    setTotalExpense(totalExpense);

    const widgetDate = await getFirstAndLastDate(allData);
    const totalExpenseAllData = getSumOfExpense(allData); // Compute once to avoid redundant calls

    const jsonData = JSON.stringify({
      amount: `${currency}${getShortStringRepresentation(
        totalExpenseAllData,
        locale
      )}`,
      date: widgetDate,
    });

    await updateWidgetData(jsonData);
    setBalance(Math.abs(totalIncome) - Math.abs(totalExpense));
  };
  const handleConfirm = (date: Date) => {
    hideDatePicker();
    previousFilter = date;
    globalDate = date;
    filterData("Daily", date);
  };
  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };
  const incomeExpenseFilter = (type: string) => {
    if (type == "expense") {
      setIsExpenseSelected(!isExpenseSelected);
      isIncomeSelected && setIsIncomeSelected(false);
    } else {
      setIsIncomeSelected(!isIncomeSelected);
      isExpenseSelected && setIsExpenseSelected(false);
    }
    setExpenseIncomeArr(
      filteredArray.filter((item) => item.category.type === type)
    );
  };
  const sliderOnClick = (sliderName: string) => {
    switch (sliderName) {
      case "sms_sync":
        isNewSmsdata
          ? navigation.navigate("storedsms")
          : navigation.navigate("sms");
        break;

      case "bank_sync":
        navigation.navigate("Settings");
        break;

      case "ai_expense":
        dispatch(updatingOpenAiFlag({ isOpenAi: true }));
        break;

      case "shopping_list":
        navigation.navigate("list");
        break;

      case "saving_goal":
        navigation.navigate("goals");
        break;

      case "scan_receipt":
        setIsScanOptions(true);
        break;

      case "guide_videos":
        navigation.navigate("help");
        break;

      case "currency_converter":
        navigation.navigate("currencyconverter");
        break;

      case "custom_category":
        setIsAddCatModalOpen(true);
        break;

      case "monthly_summary":
        navigation.navigate("newonboard", {
          fromEdit: true,
        });
        break;

      default:
        console.warn("Unknown slider name:", sliderName);
    }
  };

  //View component function
  const weekPicker = () => {
    return (
      <Modal
        style={{ alignSelf: "center" }}
        visible={showWeekPicker}
        transparent={true}
        onRequestClose={() => setShowWeekPicker(false)}
      >
        <View
          style={[
            styles.filtermodalbg,
            {
              backgroundColor: getModalBackground(theme),
            },
          ]}
        >
          <View
            style={[
              styles.filtermodalview,
              {
                backgroundColor:
                  theme == "DARK" ? Colors.darkprimary : Colors.lightprimary,
              },
            ]}
          >
            <WheelPicker
              itemTextStyle={{
                color: theme == "DARK" ? Colors.white : Colors.black,
              }}
              selectedIndicatorStyle={{
                backgroundColor:
                  theme == "DARK"
                    ? Colors.darksecondary
                    : Colors.lightsecondary,
              }}
              selectedIndex={
                week.includes(previousFilter)
                  ? week.indexOf(previousFilter)
                  : week.length - 1
              }
              options={week}
              onChange={(index) => setWeekIndex(index)}
            />
            <View
              style={[
                styles.filtermodalbottombtnview,
                {
                  backgroundColor:
                    theme == "DARK" ? Colors.darkprimary : Colors.lightprimary,
                },
              ]}
            >
              <TouchableOpacity
                style={[
                  styles.monthyearbtncancel,
                  {
                    borderColor:
                      theme == "DARK"
                        ? Colors.darksecondary
                        : Colors.lightsecondary,
                  },
                ]}
                onPress={() => setShowWeekPicker(false)}
              >
                <Text
                  style={[
                    styles.monthyearbtntxt,
                    { color: theme == "DARK" ? Colors.white : Colors.black },
                  ]}
                >
                  {translate(Strings.cancel)}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  filterData("Weekly", week[weekIndex]);
                  setShowWeekPicker(false);
                }}
                style={[
                  styles.monthyearbtncancel,
                  {
                    backgroundColor: themeColor,
                    borderColor:
                      theme == "DARK"
                        ? Colors.bottomtabgrey
                        : Colors.lightsecondary,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.monthyearbtntxt,
                    { color: theme == "DARK" ? Colors.black : Colors.white },
                  ]}
                >
                  {translate(Strings.select)}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };
  const yearPicker = () => {
    return (
      <Modal
        style={{ alignSelf: "center" }}
        visible={showYearPicker}
        transparent={true}
        onRequestClose={() => setShowYearPicker(false)}
      >
        <View
          style={[
            styles.filtermodalbg,
            {
              backgroundColor: getModalBackground(theme),
            },
          ]}
        >
          <View
            style={[
              styles.filtermodalview,
              {
                backgroundColor:
                  theme == "DARK" ? Colors.darkprimary : Colors.lightprimary,
              },
            ]}
          >
            <WheelPicker
              itemTextStyle={{
                color: theme == "DARK" ? Colors.white : Colors.black,
              }}
              selectedIndicatorStyle={{
                backgroundColor:
                  theme == "DARK"
                    ? Colors.darksecondary
                    : Colors.lightsecondary,
              }}
              selectedIndex={selectedIndexOnlyYear}
              options={year?.filter((item) => item)?.sort()}
              onChange={(index) => setOnlyYearIndex(index)}
            />
            <View
              style={[
                styles.filtermodalbottombtnview,
                {
                  backgroundColor:
                    theme == "DARK" ? Colors.darkprimary : Colors.lightprimary,
                },
              ]}
            >
              <TouchableOpacity
                style={[
                  styles.monthyearbtncancel,
                  {
                    borderColor:
                      theme == "DARK"
                        ? Colors.darksecondary
                        : Colors.lightsecondary,
                  },
                ]}
                onPress={() => setShowYearPicker(false)}
              >
                <Text
                  style={[
                    styles.monthyearbtntxt,
                    { color: theme == "DARK" ? Colors.white : Colors.black },
                  ]}
                >
                  {translate(Strings.cancel)}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  selectedIndexOnlyYear = onlyYearIndex;
                  // previousFilter = year[selectedIndexOnlyYear];
                  filterData("Yearly", year[selectedIndexOnlyYear]);
                  setShowYearPicker(false);
                }}
                style={[
                  styles.monthyearbtncancel,
                  {
                    backgroundColor: themeColor,
                    borderColor:
                      theme == "DARK"
                        ? Colors.bottomtabgrey
                        : Colors.lightsecondary,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.monthyearbtntxt,
                    { color: theme == "DARK" ? Colors.black : Colors.white },
                  ]}
                >
                  {translate(Strings.select)}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };
  const monthPicker = () => {
    return (
      <Modal
        style={{ alignSelf: "center" }}
        visible={showMonthPicker}
        transparent={true}
        onRequestClose={() => setShowMonthPicker(false)}
      >
        <View
          style={[
            styles.filtermodalbg,
            {
              backgroundColor: getModalBackground(theme),
            },
          ]}
        >
          <View
            style={[
              styles.filtermodalview,
              {
                backgroundColor:
                  theme == "DARK" ? Colors.darkprimary : Colors.lightprimary,
              },
            ]}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-around",
              }}
            >
              <WheelPicker
                itemTextStyle={{
                  color: theme == "DARK" ? Colors.white : Colors.black,
                }}
                selectedIndicatorStyle={{
                  backgroundColor:
                    theme == "DARK"
                      ? Colors.darksecondary
                      : Colors.lightsecondary,
                }}
                selectedIndex={selectedIndexMonth}
                options={month}
                onChange={(index) => setMonthIndex(index)}
              />
              <WheelPicker
                itemTextStyle={{
                  color: theme == "DARK" ? Colors.white : Colors.black,
                }}
                selectedIndicatorStyle={{
                  backgroundColor:
                    theme == "DARK"
                      ? Colors.darksecondary
                      : Colors.lightsecondary,
                }}
                selectedIndex={selectedIndexYear}
                options={year?.filter((item) => item)?.sort()}
                onChange={(index) => setYearIndex(index)}
              />
            </View>
            <View
              style={[
                styles.filtermodalbottombtnview,
                {
                  backgroundColor:
                    theme == "DARK" ? Colors.darkprimary : Colors.lightprimary,
                },
              ]}
            >
              <TouchableOpacity
                style={[
                  styles.monthyearbtncancel,
                  {
                    borderColor:
                      theme == "DARK"
                        ? Colors.darksecondary
                        : Colors.lightsecondary,
                  },
                ]}
                onPress={() => setShowMonthPicker(false)}
              >
                <Text
                  style={[
                    styles.monthyearbtntxt,
                    { color: theme == "DARK" ? Colors.white : Colors.black },
                  ]}
                >
                  {translate(Strings.cancel)}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  selectedIndexMonth = monthIndex;
                  selectedIndexYear = yearIndex;
                  // previousFilter =
                  //   month[selectedIndexMonth] +
                  //   "," +
                  //   " " +
                  //   year[selectedIndexYear];
                  filterData(
                    "Monthly",
                    month[selectedIndexMonth] +
                      "," +
                      " " +
                      year[selectedIndexYear]
                  );
                  setShowMonthPicker(false);
                }}
                style={[
                  styles.monthyearbtncancel,
                  {
                    backgroundColor: themeColor,
                    borderColor:
                      theme == "DARK"
                        ? Colors.bottomtabgrey
                        : Colors.lightsecondary,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.monthyearbtntxt,
                    { color: theme == "DARK" ? Colors.black : Colors.white },
                  ]}
                >
                  {translate(Strings.select)}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };
  const customPicker = () => {
    let customDates = customDate?.split("-");

    return (
      <Modal
        style={{ alignSelf: "center" }}
        visible={showCustomPicker}
        transparent={true}
        onRequestClose={() => setShowCustomPicker(false)}
      >
        <View
          style={[
            styles.filtermodalbg,
            {
              backgroundColor: getModalBackground(theme),
            },
          ]}
        >
          <View
            style={[
              styles.filtermodalview,
              {
                backgroundColor:
                  theme == "DARK" ? Colors.darkprimary : Colors.lightprimary,
              },
            ]}
          >
            <Text
              style={[
                styles.filtermodalheadtxt,
                {
                  color: getTextColor(theme),
                },
              ]}
            >
              {translate(Strings.custom)}
            </Text>
            <View style={styles.horizontalcontainer}>
              <View style={{ justifyContent: "center", alignItems: "center" }}>
                <Text
                  style={[
                    styles.filtermodaltxt,
                    {
                      color: getTextColor(theme),
                    },
                  ]}
                >
                  {translate(Strings.startdate)}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    setIsCustomStartDatePicker(true),
                      setSelectedCustomDate(customDates[0]);
                  }}
                  style={{ marginBottom: 10 }}
                >
                  <Text
                    style={[
                      styles.filtermodadatetxt,
                      {
                        color: getTextColor(theme),
                        backgroundColor: getSecondaryBackground(theme),
                      },
                    ]}
                  >
                    {startCustomDate}
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={{ justifyContent: "center", alignItems: "center" }}>
                <Text
                  style={[
                    styles.filtermodaltxt,
                    {
                      color: getTextColor(theme),
                    },
                  ]}
                >
                  {translate(Strings.enddate)}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    setIsCustomEndDatePicker(true),
                      setSelectedCustomDate(customDates[1]);
                  }}
                  style={{ marginBottom: 10 }}
                >
                  <Text
                    style={[
                      styles.filtermodadatetxt,
                      {
                        color: getTextColor(theme),
                        backgroundColor: getSecondaryBackground(theme),
                      },
                    ]}
                  >
                    {endCustomDate}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View
              style={[
                styles.filtermodalbottombtnview,
                {
                  backgroundColor:
                    theme == "DARK" ? Colors.darkprimary : Colors.lightprimary,
                },
              ]}
            >
              <TouchableOpacity
                style={[
                  styles.monthyearbtncancel,
                  {
                    borderColor:
                      theme == "DARK"
                        ? Colors.darksecondary
                        : Colors.lightsecondary,
                  },
                ]}
                onPress={() => setShowCustomPicker(false)}
              >
                <Text
                  style={[
                    styles.monthyearbtntxt,
                    { color: theme == "DARK" ? Colors.white : Colors.black },
                  ]}
                >
                  {translate(Strings.cancel)}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={async () => {
                  // setCustomDate(startCustomDate + " - " + endCustomDate);
                  // setTimeStampText(startCustomDate + " - " + endCustomDate);
                  // previousFilter = startCustomDate + " - " + endCustomDate;
                  setShowCustomPicker(false);
                  filterData(
                    TimeStampType.custom,
                    `${startCustomDate} - ${endCustomDate}`
                  );
                  // await filterSelectedTimeStamp(
                  //   startCustomDate + " - " + endCustomDate,
                  //   "Weekly",
                  //   allData
                  // ).then((data) => {
                  //   setFilteredArray(data);
                  //   setShowCustomPicker(false);
                  // });
                }}
                style={[
                  styles.monthyearbtncancel,
                  {
                    backgroundColor: themeColor,
                    borderColor:
                      theme == "DARK"
                        ? Colors.bottomtabgrey
                        : Colors.lightsecondary,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.monthyearbtntxt,
                    { color: theme == "DARK" ? Colors.black : Colors.white },
                  ]}
                >
                  {translate(Strings.select)}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };
  const ratingPopUp = () => {
    dispatch(updateAppOpen());
    if (reviewCount.onAppOpen % 2 == 0) {
      setTimeout(() => {
        defaultReviewModal();
      }, 300);
      return;
    }
  };
  const aiModal = () => {
    return (
      <AiModal
        visibility={(isOpenAi || isAiModal) && !remoteConfigValues.hide_ai}
        onClose={(isRateUs?: boolean) => {
          isAiModal
            ? setIsAiModal(false)
            : dispatch(updatingOpenAiFlag({ isOpenAi: false }));

          if (
            isUserReviewed &&
            isRateUs &&
            (reviewCount.onAiTransaction + 1) %
              remoteConfigValues.aiReviewCount ===
              0
          ) {
            defaultReviewModal();
          }
        }}
        netConnectivity={isConnected}
        dispatch={dispatch}
      />
    );
  };
  const appUpdateModal = () => {
    return (
      <AppUpdateModal
        visibility={isAppUpdateModal}
        onClose={() => {
          setIsAppUpdateModal(false);
        }}
      />
    );
  };
  const newFeature = () => {
    return (
      <NewFeatureScreen
        visible={isNewFeatureModal}
        onClose={() => {
          setIsNewFeatures(false);
          showInAppPurchase();
        }}
      />
    );
  };
  const addCatModal = () => {
    return (
      <AddCatModal
        isVisible={isAddCatModalOpen}
        onClose={() => {
          setIsAddCatModalOpen(false);
        }}
        onLoader={() => {
          setIsLoader(true);
          setTimeout(() => {
            setIsLoader(false);
          }, 1800);
        }}
      />
    );
  };
  const purchaseScreen = () => {
    return (
      <NewInAppPurchase
        fromHome={true}
        visible={isProHome}
        onClose={async () => {
          setIsProHome(false);
          loadLastVisited();
          // Handle AI tooltips logic if applicable
          // let res = await isUserGoalStored();
          // if (!res) {
          //   setIsPrimaryGoals(true);
          // }
        }}
      />
    );
  };

  const PrimaryGoals = () => {
    const [isPrimaryGoal, setIsPrimaryGoal] = useState<boolean>(true);
    const [isLifewith, setIsLifewith] = useState<boolean>(false);

    return (
      <Modal visible={isPrimaryGoals} animationType="slide" transparent>
        {/* {isPrimaryGoal && (
          <Onboard1
            fromOtherscreen={true}
            onCancel={() => {
              setIsPrimaryGoals(false);
            }}
            onNext={() => {
              setIsPrimaryGoals(false);
              setIsLifewith(true);
            }}
          />
        )} */}
        {/* {isLifewith && (
          <Onboard6
            fromSetting={true}
            onNext={() => {
              setIsPrimaryGoals(false);
            }}
          />
        )} */}
      </Modal>
    );
  };

  const appOpenAddUi = () => {
    return (
      <AppOpenAdComponent
        ref={appOpenAddAdRef}
        onAdShowFailed={() => {
          console.log("app open failed");
        }}
      />
    );
  };
  const scanReceiptUi = () => {
    return (
      <ScanReceiptOptions
        startLoader={() => {
          setIsScanning(true);
        }}
        visible={isScanOptions}
        onClose={() => {
          setIsScanOptions(false);
          setIsScanning(false);
        }}
        onScan={async () => {
          setIsLoader(true);
          fireAnalyticsEvent(analyticsStr.scandoc_camera_clicked);
          await scanDocument(remoteConfigValues, wallet)
            .then((scannedData) => {
              if (scannedData == "cancel") {
                setIsLoader(false);
                setIsScanning(false);
              } else {
                setIsScanOptions(false);
                setIsScanning(false);
                setIsLoader(false);
                updateScanCountInBoth(scanCount, dispatch);
                fireNewAnalyticsEvent(newAnalyticStr.ai_scan);
                // fireAnalyticsEvent(analyticsStr.scandoc_gpt_success);
                navigation.navigate("AddScreen", {
                  item: scannedData,
                  fromScan: true,
                });
              }
            })
            .catch((err) => {
              setIsLoader(false);
              setIsScanning(false);
              ToastAndroid.showWithGravity(
                translate(err),
                ToastAndroid.SHORT,
                ToastAndroid.CENTER
              );
            });
        }}
        onDocumentPicker={async () => {
          setIsLoader(true);
          setIsScanning(true);
          fireAnalyticsEvent(analyticsStr.scandoc_imagepicker_clicked);
          try {
            await handleFilePicker(remoteConfigValues, wallet)
              .then((extractedData) => {
                if (typeof extractedData === "string") {
                  // Show error message if resolve returned an error string
                  setIsLoader(false);
                  setIsScanning(false);
                  ToastAndroid.showWithGravity(
                    translate(extractedData),
                    ToastAndroid.SHORT,
                    ToastAndroid.CENTER
                  );
                } else {
                  // Success: Navigate with extracted data
                  setIsLoader(false);
                  setIsScanning(false);
                  setIsScanOptions(false);
                  updateScanCountInBoth(scanCount, dispatch);
                  fireAnalyticsEvent(analyticsStr.scandoc_gpt_trans_success);
                  navigation.navigate("AddScreen", {
                    item: extractedData,
                    fromScan: true,
                  });
                }
              })
              .catch((err) => {
                setIsLoader(false);
                setIsScanning(false);
                ToastAndroid.showWithGravity(
                  translate(err),
                  ToastAndroid.SHORT,
                  ToastAndroid.CENTER
                );
              });
          } catch (err) {
            setIsLoader(false);
            setIsScanning(false);
            ToastAndroid.showWithGravity(
              translate(Strings.somethingwentwrong),
              ToastAndroid.SHORT,
              ToastAndroid.CENTER
            );
          }
        }}
        navigation={navigation}
      />
    );
  };
  const rateUsUi = () => {
    return (
      <RateUs
        isVisible={
          (isRatingPopUp || rateUs) && remoteConfigValues.showCustomReview
        }
        onClose={() => {
          setRateUs(false);
          dispatch(updateRatingPopUpFlag({ isRatingPopUp: false }));
        }}
      />
    );
  };
  const timeperiodMenu = () => {
    return (
      <HomescreenTimePeriod
        visible={filterTooltip}
        onClose={() => {
          setFilterTooltip(false);
          dispatch(updateTimeFilterTooltip());
        }}
      />
    );
  };
  const smallComponents = () => {
    return (
      <>
        <Loader isVisible={isLoader} isScanning={isScanning} />
        <DateAdjust isVisible={isDateChanged} />
        <ProxyModal isVisible={proxy} />
      </>
    );
  };
  const dateTimepickerModal = () => {
    return (
      <>
        <DateTimePickerModal
          minimumDate={new Date(firstDate)}
          maximumDate={new Date(lastDate)}
          isVisible={isDatePickerVisible}
          mode="date"
          date={globalDate}
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
        />
        <DateTimePickerModal
          date={moment(selectedCustomDate, "MMM D, YYYY").toDate()}
          minimumDate={new Date(firstDate)}
          maximumDate={new Date(lastDate)}
          isVisible={isCustomStartDatePicker}
          mode="date"
          onConfirm={(date) => {
            setStartCustomDate(dateFormating(date));
            setIsCustomStartDatePicker(false);
          }}
          onCancel={() => setIsCustomStartDatePicker(false)}
        />
        <DateTimePickerModal
          date={moment(selectedCustomDate, "MMM D, YYYY").toDate()}
          minimumDate={new Date(firstDate)}
          maximumDate={new Date(lastDate)}
          isVisible={isCustomEndDatePicker}
          mode="date"
          onConfirm={(date) => {
            setEndCustomDate(dateFormating(date));
            setIsCustomEndDatePicker(false);
          }}
          onCancel={() => setIsCustomEndDatePicker(false)}
        />
      </>
    );
  };

  const header = () => {
    return (
      <View style={[styles.header]}>
        <View style={styles.headercontainer}>
          <TouchableOpacity onPress={toggleView}>
            <RNanimated.Image
              style={[
                styles.overviewicon,
                {
                  marginRight: 5,
                  tintColor: isOverView ? themeColor : getIconColor(theme),
                  transform: [{ rotate: rotation }],
                },
              ]}
              source={Assets.chart_pie}
            />
          </TouchableOpacity>
          {!remoteConfigValues.hideSearchBar && (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("search", { data: allData });
              }}
            >
              <Image
                style={[
                  styles.overviewicon,
                  {
                    height: isTablet() ? verticalScale(20) : verticalScale(29),
                    width: isTablet() ? verticalScale(20) : scale(29),
                    tintColor: getIconColor(theme),
                  },
                ]}
                source={Assets.search}
              />
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.spendabletxtview}>
          <Text
            numberOfLines={1}
            allowFontScaling
            adjustsFontSizeToFit
            style={[
              styles.headertxt,
              { color: theme == "DARK" ? Colors.white : Colors.black },
            ]}
          >
            {Strings.spend}
            <Text style={[styles.headertxt, { color: Colors.lightgreen }]}>
              {Strings.able}
            </Text>
          </Text>
        </View>
        <View style={[styles.aianimationview]}>
          {!remoteConfigValues.hide_ai && (
            <TouchableOpacity
              onPress={() => {
                remoteConfigValues.hideAiChat
                  ? setIsAiModal(true)
                  : navigation.navigate("chatai");
                fireAnalyticsEvent(
                  remoteConfigValues.hideAiChat
                    ? analyticsStr.ai_view_appear
                    : analyticsStr.aichat_view_appear
                );
              }}
            >
              {AiLottieView(styles.aianimation)}
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={() => {
              showTimePeriodMenu();
            }}
          >
            <Image
              source={Assets.timeperiod}
              style={[
                styles.overviewicon,
                {
                  tintColor: theme == "DARK" ? Colors.white : Colors.black,
                  marginLeft: 5,
                },
              ]}
            />
          </TouchableOpacity>
          <TimePeriodMenu
            selectedTimePeriod={selectedTimeStamp}
            isMenuVisible={isTimePeriodMenu}
            hideMenu={() => closeTimePeriodMenu()}
            onSelect={(item: string) => {
              closeTimePeriodMenu();
              const now = new Date();
              globalDate = now;
              // Set default indices
              selectedIndexMonth = now.getMonth();
              selectedIndexYear = year?.indexOf(now.getFullYear());
              selectedIndexOnlyYear = selectedIndexYear;
              // Special handling for Weekly
              if (item === "Weekly") {
                weekly();
              } else {
                setTimeStampText(item);
              }
              // Trigger filter
              filterData(item, now);
            }}
          />
        </View>
      </View>
    );
  };

  const overview = () => {
    return (
      <>
        {isOverView && (
          <ScrollView
            style={[{ marginTop: 10, flex: 1 }]}
            contentContainerStyle={{ paddingBottom: 100 }}
          >
            <OverView
              navigation={navigation}
              allData={filteredArray}
              income={totalIncome}
              expense={totalExpense}
              balance={balance}
            />
          </ScrollView>
        )}
      </>
    );
  };

  const multipleDeleteToggle = () => {
    dispatch(updateHideBottomTab({ isHideBottomTab: !isDeleteMultiple }));
    setIsDeleteMultiple(!isDeleteMultiple);
    // !isSeeAll && setIsSeeAll(!isSeeAll);
    selectedEncryptedData && setSelectedEncryptedData([]);
    selectedData && setSelectedData([]);
  };

  const fetLocalData = async () => {
    setIsDeleteMultiple(false);
    setSelectedEncryptedData([]);
    setSelectedData([]);
    multipleDeleteToggle();
  };

  const seeAllToggle = () => {
    setIsSeeAll(!isSeeAll);
  };

  const backwardForwardFilterFunction = (
    timePeriod: string,
    timeStamp: any
  ) => {
    switch (timePeriod) {
      case TimeStampType.daily:
        globalDate = timeStamp;
        setTimeStampText(dateFormating(timeStamp));

        break;

      case TimeStampType.weekly:
        previousFilter = week[timeStamp];
        setWeekIndex(timeStamp);
        filterData(TimeStampType.weekly, week[timeStamp]);
        break;

      case TimeStampType.monthly:
        const [mon, yea] = timeStamp.split(", ").map((item) => item.trim());
        selectedIndexMonth = month.indexOf(mon);
        selectedIndexYear = year?.indexOf(Number(yea));

        filterData(TimeStampType.monthly, timeStamp);
        break;

      case TimeStampType.yearly:
        selectedIndexOnlyYear = timeStamp;
        filterData(TimeStampType.yearly, year[timeStamp]);
        break;
    }
  };

  const showAllEditMenu = () => {
    setIsEditAllMenu(true);
  };
  const closeAllEditMenu = () => {
    setIsEditAllMenu(false);
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: getScreenBackground(theme),
        },
      ]}
    >
      <SafeAreaView
        edges={["top"]}
        style={{
          backgroundColor:
            theme == "DARK" ? Colors.darkprimary : Colors.lightprimary,
        }}
      />
      <StatusBar
        backgroundColor={getScreenBackground(theme)}
        barStyle={theme == "DARK" ? "light-content" : "dark-content"}
      />

      {/* <PrimaryGoals /> */}
      {purchaseScreen()}
      {appOpenAddUi()}
      {addCatModal()}
      {scanReceiptUi()}
      {newFeature()}
      {rateUsUi()}
      {timeperiodMenu()}
      {appUpdateModal()}
      {weekPicker()}
      {yearPicker()}
      {monthPicker()}
      {customPicker()}
      {smallComponents()}
      {aiModal()}
      {dateTimepickerModal()}
      {!isConnected ||
        (isConnected == null && (
          <Text style={styles.networkerrortext}>
            {translate(Alert_Strings.networkerror)}
          </Text>
        ))}

      {!isSeeAll && !isDeleteMultiple && (
        <Animated.View
          entering={FadeInUp.duration(300)}
          exiting={FadeOutUp.duration(300)}
          layout={Layout.springify()}
        >
          {header()}
        </Animated.View>
      )}

      {isDeleteMultiple && (
        <Animated.View
          entering={FadeInUp.duration(300)}
          exiting={FadeOutUp.duration(300)}
          layout={Layout.springify()}
        >
          <HeaderForDelete
            onCancel={() => {
              multipleDeleteToggle();
            }}
            setIsLoader={setIsLoader}
            getLocalData={() => {
              fetLocalData();
            }}
            showAllEditMenu={showAllEditMenu}
            isEditAllMenu={isEditAllMenu}
            closeAllEditMenu={closeAllEditMenu}
            selectedEncryptedData={selectedEncryptedData}
            catArr={catArr}
            wallets={wallets}
          />
        </Animated.View>
      )}
      <Animated.View
        layout={Layout.duration(350).easing(Easing.out(Easing.cubic))}
      >
        {!isDeleteMultiple && (
          <Animated.View
            entering={FadeInUp.duration(300)}
            exiting={FadeOutUp.duration(300)}
            layout={Layout.duration(350).easing(Easing.out(Easing.cubic))}
          >
            {remoteConfigValues.showFeatureSlider && (
              <View style={{ marginTop: 10 }}>
                <FeatureSlider
                  OnClick={(bannerName: string) => {
                    sliderOnClick(bannerName);
                  }}
                  slides={sliderData?.filter((item) => !item?.isHideAndroid)}
                  isNewSmsData={isNewSmsdata}
                />
              </View>
            )}
          </Animated.View>
        )}

        <Animated.View
          layout={Layout.duration(350).easing(Easing.out(Easing.cubic))}
        >
          {shouldShowBannerAds && (
            <View style={{ marginTop: 5 }}>
              {isConnected ? (
                <BannerAds passedKey={ReleaseAdsKeys.bannerID_1} />
              ) : (
                <MemoizedOfflineBannerAds />
              )}
            </View>
          )}
        </Animated.View>

        <TimeStampFilterView
          year={year}
          week={week}
          firstDate={firstDate}
          lastDate={lastDate}
          globalDate={globalDate}
          timeStampText={timeStampText}
          selectedIndexYear={selectedIndexOnlyYear}
          selectedTimeStamp={selectedTimeStamp}
          allData={allData}
          filterData={(timePeriod, timeStamp) => {
            backwardForwardFilterFunction(timePeriod, timeStamp);
          }}
          datePickerVisibility={() => {
            setDatePickerVisibility(true);
          }}
          showWeekPicker={() => {
            setShowWeekPicker(true);
          }}
          showMonthPicker={() => {
            setShowMonthPicker(true);
          }}
          showYearPicker={() => {
            setShowYearPicker(true);
          }}
          showCustomPicker={() => {
            setShowCustomPicker(true);
          }}
        />
      </Animated.View>

      <View
        style={{
          flex: isOverView ? 0 : 1,
        }}
      >
        <TransactionsData
          isOverView={isOverView}
          timeStampText={timeStampText}
          isExpenseSelected={isExpenseSelected}
          isIncomeSelected={isIncomeSelected}
          totalIncome={totalIncome}
          totalExpense={totalExpense}
          balance={balance}
          expenseIncomeArr={expenseIncomeArr}
          filteredArray={filteredArray}
          navigation={navigation}
          onLongPress={() => {
            multipleDeleteToggle();
          }}
          incomeExpenseFilter={(type: string) => {
            incomeExpenseFilter(type);
          }}
          seeAll={() => {
            seeAllToggle();
          }}
          isSeeAll={isSeeAll}
          isDeleteMultiple={isDeleteMultiple}
          encryptedData={encryptedData}
          setSelectedEncryptedData={setSelectedEncryptedData}
          setSelectedData={setSelectedData}
          selectedData={selectedData}
          setSelectedBalance={setSelectedBalance}
        />
      </View>
      {overview()}
    </View>
  );
};
export default Home;
