import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import DeviceInfo from "react-native-device-info";
import { AppUpdate } from "../src/resources/string/strings";
import { Colors } from "../src/resources/colors/Colors";
import { State } from "react-native-gesture-handler";
import { FeatureSliderItemType } from "../src/screens/home/featureSlider";
import moment from "moment";

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

// Core App Types
export type ThemeObject = {
  theme: string;
  isauto: boolean;
};

export type LockObject = {
  passcode: string;
};

export type ProfileObject = {
  username: string;
};

export type AppVersion = {
  lastAppVersion: number;
};

// Currency & Financial Types
export type CurrencyObject = {
  currency: string;
  currencycode: string;
  flag: any;
};

export type CoinsType = {
  coins: number;
};

export type WalletType = {
  id: string;
  name: string;
};

// Analytics & Tracking Types
export type ExpenseCountObject = {
  expensecount: number;
  splitexpensecount: number;
  aiexpensecount: number;
  splitbtnclickcount: number;
};

export type AppOpenAd = {
  appopenad: number;
};

// AI & Feature Types
export type OpenAiType = {
  isOpenAi: boolean;
};

// Remote Configuration Type
export type RemoteConfigObject = {
  // API & AI Configuration
  gpt_api_key: string;
  hide_ai: boolean;
  word_limit: number;
  response_mode: string;
  cg_model: string;
  aiChatWordLimit: number;
  aiExpenseModel: string;
  freeAICount: number;
  paidAICount: number;
  hideAiChat: boolean;
  isChatLock: boolean;
  
  // App Version & Updates
  force_update: boolean;
  live_version: number;
  update_string: string;
  
  // Advertisement Configuration
  ad_one_interval: number;
  ad_one_isReward: boolean;
  ad_two_interval: number;
  ad_two_isReward: boolean;
  ad_three_interval: number;
  ad_three_isReward: boolean;
  ad_four_interval: number;
  ad_four_isReward: boolean;
  ad_openapp_interval: number;
  hideAd: boolean;
  hideAppOpenAd: boolean;
  hideBannerAds: boolean;
  hideWatchAdPopup: boolean;
  watchAdsRewardCoins: number;
  
  // Feature Visibility & Limits
  hideAttachment: boolean;
  attachmentCount: number;
  hideRecurring: boolean;
  repeatTransactionLimit: number;
  hideSearchBar: boolean;
  hideCurrencyConverter: boolean;
  hideShoppingList: boolean;
  hideGoals: boolean;
  hideDocumentScan: boolean;
  hideStores: boolean;
  hideReferralProgram: boolean;
  
  // SMS & Sync Configuration
  freeSmsSyncCount: number;
  smsPrompt: string;
  smsKeywordLimit: number;
  smsParsingMaxLength: number;
  showSMSAutoToggle: boolean;
  
  // Purchase & Subscription
  showPurchaseOffer: boolean;
  showProHome: boolean;
  normalPromoCode: string;
  plusPromoCode: string;
  showNormalWeeklySub: boolean;
  hideRedeemCode: boolean;
  
  // Limits & Counts
  splitCreateLimit: number;
  familySharingCreateLimit: number;
  transactionImagesUploadLimit: number;
  listLimitCount: number;
  shoppingListDeductionCount: number;
  plaidBankLimitCount: number;
  customCatNameLength: number;
  freeScanCount: number;
  paidScanCount: number;
  budgetCreateCount: number;
  
  // Review & Rating Configuration
  inReview: boolean;
  showCustomReview: boolean;
  forceCustomRating: boolean;
  transactionReviewCount: number;
  famTransactionReviewCount: number;
  budgetReviewCount: number;
  aiReviewCount: number;
  splitTransactionReviewCount: number;
  goalReviewCount: number;
  shoppingListReviewCount: number;
  savingReviewCount: number;
  familyBudgetReviewCount: number;
  goalAchieveReviewCount: number;
  searchScreenCloseReviewCount: number;
  splitEventReviewCount: number;
  appOpenReviewCount: number;
  aiChatReviewCount: number;
  rateUsTitle: string;
  positiveBtnTxt: string;
  negativeBtnTxt: string;
  
  // Visual & UI Configuration
  festivalBGImage: string | null;
  festivalPercentageBannerUrl: string | null;
  mainSalesBGImage: string;
  festivalBtnColor: string;
  festivalBtnTxtColor: string;
  mainSalesTitleColor: string;
  mainSalesOtherColor: string;
  mainSalesBtnColor: string;
  showFestivalOffer: boolean;
  showFeatureSlider: boolean;
  showCustomKeyboard: boolean;
  
  // Country & Regional Settings
  disallow_email_domains: string;
  plaid_supported_countries: string;
  upi_supported_countries: string;
  krogers_supported_countries: string;
  walmart_supported_countries: string;
  
  // Referral & Rewards
  referralSenderCoinCount: number;
  referralReceiverCoinCount: number;
  familyDeductionCount: number;
  budgetDeductionCount: number;
  recurringDeductionCount: number;
  splitDeductionCount: number;
  
  // Video & Tutorial URLs
  whatsNewFamilyVideo: string;
  whatsNewImportTransVideo: string;
  whatsNewSplitVideo: string;
  whatsNewBudgetVideo: string;
  whatsNewGoalsVideo: string;
  whatsNewShoppingListVideo: string;
  whatsNewSmsSyncVideo: string;
  whatsNewSmsAutomationVideo: string;
  whatsNewAIChatVideo: string;
  whatsNewScanDocVideo: string;
  whatsNewSearchByNoteVideo: string;
  whatsNewCurrencyConvertVideo: string;
  whatsNewCurrencyConvertModuleVideo: string;
  
  // Miscellaneous Settings
  sales_bottom_infotext: string;
  send_push_notificaiton: boolean;
  sp_404: string;
  sp_401: string;
  sp_402: string;
  scanGptModel: string;
  isUploadScanImgToAWS: boolean;
  isSkipDateMatch: boolean;
  showPlaidRecurring: boolean;
  isScanLock: boolean;
  showSpinWheel: boolean;
  showSplitSummary: boolean;
  isFutureRepeat: boolean;
  isSendSignUpMail: boolean;
  onBoardSkipDays: number;
};

// System & Configuration Types
export type ProxyType = {
  isProxy: boolean;
};

export type Language = {
  locallanguage: string;
};

// Rating & Analytics Types
export type CustomRatingCounts = {
  onAiTransaction: number;
  onNormalTransaction: number;
  onBudgetAdd: number;
  onFamTransaction: number;
  onSplitTransaction: number;
  onGoalAdd: number;
  onShoppingList: number;
  onAppOpen: number;
  onSavingAdd: number;
  onGoalAchievement: number;
  onSplitEventAdd: number;
  onFamilyBudgetAdd: number;
  onSearchScreenBack: number;
  onChatResponse: number;
};

export type DefaultRatingCounts = {
  onFilter: number;
  onOverviewCat: number;
  onAiScreenOpen: number;
  onSplitClick: boolean;
  onCurrancyChange: boolean;
  onExportClick: boolean;
};

// Count & Tracking Types
export type SplitEventCountType = {
  splitEventCount: number;
};

export type BudgetCountType = {
  budgetCount: number;
};

export type FamilyEventCountType = {
  familyEventCount: number;
};

export type ListCountType = {
  listCount: number;
};

export type PrimaryGoalType = {
  primaryGoals: string;
};

export type RecurringCountType = {
  recurringCount: number;
};

// UI & UX Types
export type ToolTipType = {
  firstToolTip: boolean;
  secondToolTip: boolean;
  referralToolTip: boolean;
  aiToolTip: boolean;
  aiInfoTooltip: boolean;
};

export type ThemeColorType = {
  themeColor: string;
};

export type UserCountScreenType = {
  isUserCountScreen: boolean;
};

export type HideBottomTab = {
  isHideBottomTab: boolean;
};

const featureSliderData: FeatureSliderItemType[] = [
  {
    banner_description:
      "Easily integrate your bank account and let us keep your finances organized.",
    banner_image: "bank_slider",
    banner_order: 0,
    banner_title: "Bank Sync",
    isActionEnable: true,
    isHide: false,
    unique_name: "bank_sync",
    isHideAndroid: false,
  },
  {
    banner_description:
      "Easily integrate your bank account and let us keep your finances organized.",
    banner_image: "sms_sync",
    banner_order: 1,
    banner_title: "SMS Sync",
    isActionEnable: true,
    isHide: true,
    unique_name: "sms_sync",
    isHideAndroid: false,
  },
  {
    banner_description: "Simply speak to manage your finances. With AI Voice.",
    banner_image: "ai_slider",
    banner_order: 3,
    banner_title: "AI Voice",
    isActionEnable: true,
    isHide: false,
    unique_name: "ai_expense",
    isHideAndroid: false,
  },
  {
    banner_description:
      "Never miss an item! Keep track of everything you need while shopping",
    banner_image: "shopping_slider",
    banner_order: 4,
    banner_title: "Shopping List",
    isActionEnable: true,
    isHide: false,
    unique_name: "shopping_list",
    isHideAndroid: false,
  },
  {
    banner_description:
      "Define your savings targets with precision. Let us help you stay on track!",
    banner_image: "goal_slider",
    banner_order: 5,
    banner_title: "Saving Goal",
    isActionEnable: true,
    isHide: false,
    unique_name: "saving_goal",
    isHideAndroid: false,
  },
  {
    banner_description: "Quickly capture and log expenses from your invoices!",
    banner_image: "currency_exchange",
    banner_order: 6,
    banner_title: "Currency Converter",
    isActionEnable: true,
    isHide: false,
    unique_name: "currency_converter",
    isHideAndroid: false,
  },
  {
    banner_description: "Quickly capture and log expenses from your invoices!",
    banner_image: "scan_slider",
    banner_order: 2,
    banner_title: "Scan Receipt",
    isActionEnable: true,
    isHide: false,
    unique_name: "scan_receipt",
    isHideAndroid: false,
  },
  {
    banner_description:
      "Get step-by-step video guidance for using every feature with ease.",
    banner_image: "questionmark_circle",
    banner_order: 7,
    banner_title: "Guided Videos",
    isActionEnable: true,
    isHide: false,
    unique_name: "guide_videos",
    isHideAndroid: false,
  },
];

const userCountScreenFlag: UserCountScreenType = {
  isUserCountScreen: true,
};

// Use the type alias in the state definition
const profilestate: ProfileObject = { username: "" };
const themestate: ThemeObject = { theme: "DARK", isauto: true };
const lockstate: LockObject = { passcode: "" };
const currencystate: CurrencyObject = {
  currency: "₹",
  currencycode: "INR",
  flag: "🇮🇳",
};
const locktoggle = { isLock: false, isFingerLock: true };
const splitguideobject = {
  firstTimeSplit: true,
  firstTimeFamilySharing: true,
  firstTimeBudget: true,
  firstTimeShopping: true,
};

const firstTimeSms = {
  firstTimeSms: true,
};
const adscountobject: ExpenseCountObject = {
  expensecount: 0,
  splitexpensecount: 0,
  aiexpensecount: 0,
  splitbtnclickcount: 0,
};
const remoteconfigobject: RemoteConfigObject = {
  gpt_api_key: "sk-xxxxxxxxxxxxxxxxxxxxxxxx",
  hide_ai: true,
  word_limit: 50,
  force_update: false,
  live_version: Number(DeviceInfo.getBuildNumber()),
  update_string: AppUpdate.updateavailable,
  ad_one_interval: 0,
  ad_one_isReward: false,
  ad_three_interval: 0,
  ad_three_isReward: false,
  ad_two_interval: 0,
  ad_two_isReward: false,
  ad_openapp_interval: 0,
  hideAd: false,
  hideAppOpenAd: false,
  hideAttachment: true,
  attachmentCount: 1,
  freeSmsSyncCount: 0,
  smsPrompt: "",
  smsKeywordLimit: 0,
  showPurchaseOffer: false,
  showProHome: false,
  hideBannerAds: false,
  ad_four_interval: 0,
  ad_four_isReward: false,
  splitCreateLimit: 0,
  inReview: false,
  showCustomReview: false,
  festivalBGImage: "",
  mainSalesBGImage: "",
  festivalPercentageBannerUrl: "",
  hideRecurring: false,
  repeatTransactionLimit: 0,
  showFestivalOffer: false,
  forceCustomRating: false,
  hideWatchAdPopup: false,
  isChatLock: true,
  isScanLock: true,
  familySharingCreateLimit: 0,
  sales_bottom_infotext: "",
  transactionImagesUploadLimit: 0,
  disallow_email_domains: "",
  plaid_supported_countries: "",
  upi_supported_countries: "",
  referralSenderCoinCount: 0,
  referralReceiverCoinCount: 0,
  familyDeductionCount: 0,
  budgetDeductionCount: 0,
  recurringDeductionCount: 0,
  splitDeductionCount: 0,
  hideReferralProgram: false,
  whatsNewFamilyVideo: "",
  whatsNewImportTransVideo: "",
  whatsNewSplitVideo: "",
  whatsNewBudgetVideo: "",
  whatsNewGoalsVideo: "",
  whatsNewShoppingListVideo: "",
  whatsNewSmsSyncVideo: "",
  whatsNewSmsAutomationVideo: "",
  listLimitCount: 0,
  shoppingListDeductionCount: 0,
  plaidBankLimitCount: 0,
  send_push_notificaiton: false,
  transactionReviewCount: 0,
  famTransactionReviewCount: 0,
  budgetReviewCount: 0,
  aiReviewCount: 0,
  normalPromoCode: "",
  plusPromoCode: "",
  showNormalWeeklySub: false,
  hideRedeemCode: false,
  splitTransactionReviewCount: 0,
  goalReviewCount: 0,
  shoppingListReviewCount: 0,
  customCatNameLength: 30,
  freeAICount: 1,
  paidAICount: 1,
  hideAiChat: true,
  sp_404: "",
  sp_401: "",
  sp_402: "",
  response_mode: "Professional",
  cg_model: "gpt-4o-2024-08-06",
  whatsNewAIChatVideo: "",
  aiChatWordLimit: 200,
  aiExpenseModel: "gpt-3.5-turbo",
  hideDocumentScan: true,
  freeScanCount: 0,
  paidScanCount: 0,
  scanGptModel: "gpt-3.5-turbo",
  whatsNewScanDocVideo: "",
  rateUsTitle: `Got a sec? Tell us how we’re doing!`,
  positiveBtnTxt: `Lovin' it 😍`,
  negativeBtnTxt: `Later 🙄`,
  isUploadScanImgToAWS: false,
  isSkipDateMatch: true,
  hideSearchBar: false,
  whatsNewSearchByNoteVideo: "",
  whatsNewCurrencyConvertVideo: "",
  whatsNewCurrencyConvertModuleVideo: "",
  hideCurrencyConverter: false,
  hideShoppingList: false,
  hideGoals: false,
  showFeatureSlider: false,
  showPlaidRecurring: false,
  savingReviewCount: 0,
  familyBudgetReviewCount: 0,
  goalAchieveReviewCount: 0,
  searchScreenCloseReviewCount: 0,
  splitEventReviewCount: 0,
  appOpenReviewCount: 0,
  aiChatReviewCount: 0,
  budgetCreateCount: 0,
  festivalBtnColor: Colors.green,
  festivalBtnTxtColor: Colors.black,
  mainSalesTitleColor: Colors.white,
  mainSalesOtherColor: Colors.white,
  mainSalesBtnColor: Colors.white,
  showSpinWheel: false,
  showSplitSummary: false,
  watchAdsRewardCoins: 0,
  smsParsingMaxLength: 200,
  showSMSAutoToggle: true,
  hideStores: true,
  krogers_supported_countries: "US",
  walmart_supported_countries: "US",
  isFutureRepeat: false,
  isSendSignUpMail: false,
  showCustomKeyboard: false,
  onBoardSkipDays: 2,
};
const reminder = {
  hour: 9,
  minute: 0,
  timezone: "PM",
  isreminder: true,
  selecteddays: [0, 1, 2, 3, 4, 5, 6],
};
const inapppurchase = {
  purchased: false,
};
const proxy: ProxyType = {
  isProxy: false,
};

const defaultRatingCounts: DefaultRatingCounts = {
  onFilter: 0,
  onOverviewCat: 0,
  onAiScreenOpen: 0,
  onSplitClick: false,
  onCurrancyChange: false,
  onExportClick: false,
};
const spliteventcount: SplitEventCountType = {
  splitEventCount: 0,
};

const budgetCount: BudgetCountType = {
  budgetCount: 0,
};

const familyeventcount: FamilyEventCountType = {
  familyEventCount: 0,
};
const listcount: ListCountType = {
  listCount: 0,
};
const primarygoal: PrimaryGoalType = {
  primaryGoals: "",
};
const recurringcount: RecurringCountType = {
  recurringCount: 0,
};
const themeColor: ThemeColorType = {
  themeColor: Colors.themecolor,
};

const appopenadcount: AppOpenAd = { appopenad: 0 };

const locallanguage: Language = { locallanguage: "en" };

const forceReview = {
  isUserReviewed107: false,
};

const freeUser = {
  isFreeUser: false,
};

const newFeature = { isNewFeatureShown: false };

const toolTip: ToolTipType = {
  firstToolTip: true,
  secondToolTip: true,
  referralToolTip: true,
  aiToolTip: true,
  aiInfoTooltip: true,
};

const firstrecurring = { firstRecurring: false };

const salespageShown = { salesPageShownDate: 0 };

const lastSpinDate = { lastSpinDate: 0 };

const lastWatchAds = { lastWatchAdsDate: 0 };

const upi = { upi: "" };

const eventCurrencyObject: CurrencyObject = {
  currency: "₹",
  currencycode: "INR",
  flag: "🇮🇳",
};

const hideai = { isHideAi: false };

const firstmembertosplit = { isFirstMemberAdded: true };

const plusPurchased = { isPlusPurchased: false };

const countrycode = { countryCode: "" };

const coins: CoinsType = {
  coins: 0,
};

const wallet: WalletType = {
  id: "",
  name: "Cash",
};

const lastAppVersion: AppVersion = {
  lastAppVersion: 0,
};

const fcmToken = {
  fcmtoken: "",
};

const getNotify = {
  getNotify: true,
};

const isCountryAvailable = {
  isCountryAvailable: false,
};

const isPlusPurchasePopUpshown = {
  isPlusPurchasePopUpshown: false,
};

const swipeLeftInstruction = {
  isSwipedleft: false,
};

const locale = {
  locale: "en-US",
};

const ratingPopUpFlag = {
  isRatingPopUp: false,
};

const openAiFlag: OpenAiType = {
  isOpenAi: false,
};

const userChatCount = {
  userChatCount: 0,
};

const isDateChanged = {
  isDateChanged: false,
};

const scanCount = {
  scanCount: 0,
};

const smsSyncCount = {
  smsSyncCount: 0,
};

const notes: NotesType = {
  notes: [],
};

const currencyConverter = {
  currencyConverter: {},
};

const currencyConverterFlag = {
  isCurrencyConverter: true,
};

const isSubcatFlag = {
  isSubCat: true,
};

const TimeFilterTooltip = {
  isTimeFilterTooltip: true,
};

const SelectCurrencyToolTip = {
  isSelectCurrencyTooltip: true,
};

const syncSms: SmsSyncType = {
  isSyncSms: false,
  isAutomated: false,
};

// Duplicate type definitions removed - already defined above

const notificationUpdateFlag = {
  notificationUpdatev69: true,
};

const krogersToken: KrogersTokenType = {
  token: "",
};

const walmartSign = {
  sign: "",
  timestamp: 0,
  consumerId: "",
};

const attachmentCount = {
  attachmentCount: 0,
};

const selectedStore = {
  selectedStore: "General Store",
};

const coloredTransaction = {
  isColoredTheme: false,
};

const customKeyboard = {
  isCustomKeyboard: false,
};

const hideBottomTab: HideBottomTab = {
  isHideBottomTab: false,
};

const categoryEdit = {
  isCatEdit: true,
};

const catSortingFilter = {
  catSortFilter: "Default",
};
// Onboarding Types
export type OnBoardingDataType = {
  lastVisitedIntroScreen: string | null;
  primaryGoals: string[];
  budgetingFor: string;
  income: number | null;
  expense: number | null;
  spendMostOn: string[];
  mostAnxiousPopUps: string[];
  unplannedExpenses: string;
};

// SMS & Sync Types
export type SmsSyncType = {
  isSyncSms: boolean;
  isAutomated: boolean;
};

// Store Integration Types
export type WalmartSignType = {
  sign: string;
  timestamp: number;
  consumerId: string;
};

export type KrogersTokenType = {
  token: string;
};

// Notes Type
export type NotesType = {
  notes: string[];
};

// Review Rating Type
export type ReviewRatingType = {
  appOpen: number;
  normalTransaction: number;
  budget: number;
  scanReceiptTransaction: number;
  goal: number;
  saving: number;
  goalAchievement: number;
  searchScreenClose: number;
  aiChat: number;
  split: number;
  familyBudget: number;
};

// ============================================================================
// DEFAULT STATE VALUES
// ============================================================================

const onBoardingData: OnBoardingDataType = {
  lastVisitedIntroScreen: null,
  primaryGoals: [],
  budgetingFor: "",
  income: null,
  expense: null,
  spendMostOn: [],
  mostAnxiousPopUps: [],
  unplannedExpenses: "",
};

const onBoardSkipDate = {
  lastOnBoardSkipDate: null,
};

const onBoardSkipDateSlice = createSlice({
  name: "onboardskipdate",
  initialState: onBoardSkipDate,
  reducers: {
    updateOnboardSkipDate: (state) => {
      state.lastOnBoardSkipDate = moment().unix();
    },
  },
});

const onBoardSlice = createSlice({
  name: "onboard",
  initialState: onBoardingData,
  reducers: {
    updateLastVisitedIntroScreen: (state, action) => {
      state.lastVisitedIntroScreen = action.payload;
    },
    updatePrimaryGoals: (state, action) => {
      state.primaryGoals = action.payload;
    },
    updateBudgetingFor: (state, action) => {
      state.budgetingFor = action.payload;
    },
    updateIncomeAndExpense: (state, action) => {
      const { income, expense } = action.payload;
      if (income !== undefined) state.income = income;
      if (expense !== undefined) state.expense = expense;
    },
    updateSpendMostOn: (state, action) => {
      state.spendMostOn = action.payload;
    },
    updateMostAnxiousPopUps: (state, action) => {
      state.mostAnxiousPopUps = action.payload;
    },
    updateUnplannedExpenses: (state, action) => {
      state.unplannedExpenses = action.payload;
    },
    updateOnBoardingData: (state, action) => {
      return {
        ...state,
        ...action.payload, // merge the incoming object with current state
      };
    },
    resetOnBoardingData: () => onBoardingData,
  },
});

const catSortSlice = createSlice({
  name: "catsort",
  initialState: catSortingFilter,
  reducers: {
    updateCatSortingFilter: (state, action) => {
      const { catSortFilter } = action.payload;
      return { ...state, catSortFilter: catSortFilter };
    },
  },
});

const catEditSlice = createSlice({
  name: "catedit",
  initialState: categoryEdit,
  reducers: {
    updateCatEditFlag: (state, action) => {
      const { isCatEdit } = action.payload;
      return { ...state, isCatEdit: isCatEdit };
    },
  },
});

const customKeyboardSlice = createSlice({
  name: "customkeyboard",
  initialState: customKeyboard,
  reducers: {
    updateCustomKeyboard: (state, action) => {
      const { isCustomKeyboard } = action.payload;
      return { ...state, isCustomKeyboard: isCustomKeyboard };
    },
  },
});

const hideBottomTabSlice = createSlice({
  name: "hidebottomtab",
  initialState: hideBottomTab,
  reducers: {
    updateHideBottomTab: (state, action) => {
      const { isHideBottomTab } = action.payload;
      return { ...state, isHideBottomTab: isHideBottomTab };
    },
  },
});

const coloredTransactionSlice = createSlice({
  name: "coloredtransactions",
  initialState: coloredTransaction,
  reducers: {
    updateColoredTransactions: (state, action) => {
      const { isColoredTheme } = action.payload;
      return { ...state, isColoredTheme: isColoredTheme };
    },
  },
});

const featureSliderSlice = createSlice({
  name: "featuresliderdata",
  initialState: featureSliderData,
  reducers: {
    updateFeatureSliderData: (
      state,
      action: PayloadAction<FeatureSliderItemType[]>
    ) => {
      return action.payload;
    },
  },
});

const selectedStoreSlice = createSlice({
  name: "selectedStore",
  initialState: selectedStore,
  reducers: {
    updateSelectedStore: (state, action) => {
      const { selectedStore } = action.payload;
      return { ...state, selectedStore: selectedStore };
    },
  },
});

const syncSmsSlice = createSlice({
  name: "syncSms",
  initialState: syncSms,
  reducers: {
    updateSyncSmsFlag: (state, action) => {
      const { isSyncSms, isAutomated } = action.payload;
      return { ...state, isSyncSms: isSyncSms, isAutomated: isAutomated };
    },
  },
});

const attachmentCountSlice = createSlice({
  name: "attachmentCount",
  initialState: attachmentCount,
  reducers: {
    updateAttachmentCount: (state, action) => {
      const { attachmentCount } = action.payload;
      return { ...state, attachmentCount: attachmentCount };
    },
  },
});

// ============================================================================
// STORE INTEGRATION SLICES
// ============================================================================

const walmartSlice = createSlice({
  name: "walmart",
  initialState: walmartSign,
  reducers: {
    updateWalmartSign: (state: WalmartSignType, action) => {
      const { sign, timestamp, consumerId } = action.payload;
      return {
        ...state,
        sign: sign,
        timestamp: timestamp,
        consumerId: consumerId,
      };
    },
  },
});

const krogersSlice = createSlice({
  name: "krogersToken",
  initialState: krogersToken,
  reducers: {
    updateKrogersToken: (state: KrogersTokenType, action) => {
      const { token } = action.payload;
      return { ...state, token: token };
    },
  },
});

// ============================================================================
// UI/UX FLAG SLICES
// ============================================================================

const userCountScreenFlagSlice = createSlice({
  name: "userCountScreen",
  initialState: userCountScreenFlag,
  reducers: {
    updateUserCountScreenFlag: (state) => {
      state.isUserCountScreen = false;
    },
  },
});

const notificationUpdateFlagSlice = createSlice({
  name: "notificationupdate",
  initialState: notificationUpdateFlag,
  reducers: {
    updateNotificationFlag: (state) => {
      state.notificationUpdatev69 = false;
    },
  },
});

const selectCurrencyTooltipSlice = createSlice({
  name: "selectcurrencytooltip",
  initialState: SelectCurrencyToolTip,
  reducers: {
    updateSelectCurrencyTooltip: (state) => {
      state.isSelectCurrencyTooltip = false;
    },
  },
});

const timeFilterTooltipSlice = createSlice({
  name: "timefiltertooltip",
  initialState: TimeFilterTooltip,
  reducers: {
    updateTimeFilterTooltip: (state) => {
      state.isTimeFilterTooltip = false;
    },
  },
});

// ============================================================================
// CURRENCY & FINANCIAL SLICES
// ============================================================================

const currencyConverterFlagCountSlice = createSlice({
  name: "currencyconverterflag",
  initialState: currencyConverterFlag,
  reducers: {
    updateCurrencyConverterFlag: (state, action) => {
      const { isCurrencyConverter } = action.payload;
      return { ...state, isCurrencyConverter: isCurrencyConverter };
    },
  },
});

const subCatFlagCountSlice = createSlice({
  name: "subcatflag",
  initialState: isSubcatFlag,
  reducers: {
    updateSubCatFlag: (state, action) => {
      const { isSubCat } = action.payload;
      return { ...state, isSubCat: isSubCat };
    },
  },
});

export const currencyConverterSlice = createSlice({
  name: "currencyconverter",
  initialState: currencyConverter,
  reducers: {
    updateCurrencyConverter: (state, action) => {
      const { currencyConverter } = action.payload;
      state.currencyConverter = { currencyConverter };
    },
  },
});

// ============================================================================
// NOTES & CONTENT SLICES
// ============================================================================

const allNotesSlice = createSlice({
  name: "notes",
  initialState: notes,
  reducers: {
    updateNotes: (state: NotesType, action) => {
      const { notes } = action.payload;
      state.notes = [...new Set([...state.notes, ...notes])];
    },

    deleteAllNotes: (state) => {
      state.notes = [];
    },
  },
});

// ============================================================================
// ANALYTICS & TRACKING SLICES
// ============================================================================

const scanCountSlice = createSlice({
  name: "scancount",
  initialState: scanCount,
  reducers: {
    updateScanCount: (state, action) => {
      const { scanCount } = action.payload;
      return { ...state, scanCount: scanCount };
    },
  },
});

const smsSyncCountSlice = createSlice({
  name: "smssynccount",
  initialState: smsSyncCount,
  reducers: {
    updateSmsSyncCount: (state, action) => {
      const { smsSyncCount } = action.payload;
      return { ...state, smsSyncCount: smsSyncCount };
    },
  },
});

const dateChangedSlice = createSlice({
  name: "datechange",
  initialState: isDateChanged,
  reducers: {
    updateIsDateChanged: (state, action) => {
      const { isDateChanged } = action.payload;
      return { ...state, isDateChanged: isDateChanged };
    },
  },
});

const ChatCountSlice = createSlice({
  name: "chatcount",
  initialState: userChatCount,
  reducers: {
    updateLocalChatCount: (state, action) => {
      const { userChatCount } = action.payload;
      return { ...state, userChatCount: userChatCount };
    },
  },
});

const openAiSlice = createSlice({
  name: "openai",
  initialState: openAiFlag,
  reducers: {
    updatingOpenAiFlag: (state, action) => {
      const { isOpenAi } = action.payload;
      return { ...state, isOpenAi: isOpenAi };
    },
  },
});

export const ratingSlice = createSlice({
  name: "ratingpopup",
  initialState: ratingPopUpFlag,
  reducers: {
    updateRatingPopUpFlag: (state, action) => {
      const { isRatingPopUp } = action.payload;
      return { ...state, isRatingPopUp: isRatingPopUp };
    },
  },
});

const customRatingCounts: CustomRatingCounts = {
  onAiTransaction: 0,
  onNormalTransaction: 0,
  onBudgetAdd: 0,
  onFamTransaction: 0,
  onSplitTransaction: 0,
  onGoalAdd: 0,
  onShoppingList: 0,
  onAppOpen: 0,
  onSavingAdd: 0,
  onGoalAchievement: 0,
  onSplitEventAdd: 0,
  onFamilyBudgetAdd: 0,
  onSearchScreenBack: 0,
  onChatResponse: 0,
};

export const ratingCountSlice = createSlice({
  name: "ratingcount",
  initialState: customRatingCounts,
  reducers: {
    updateChatResponse: (state) => {
      return {
        ...state,
        onChatResponse: (state.onChatResponse || 0) + 1,
      };
    },

    updateAppOpen: (state) => {
      return {
        ...state,
        onAppOpen: (state.onAppOpen || 0) + 1,
      };
    },

    updateSavingAdd: (state) => {
      return {
        ...state,
        onSavingAdd: (state.onSavingAdd || 0) + 1,
      };
    },

    updateGoalAchievement: (state) => {
      return {
        ...state,
        onGoalAchievement: (state.onGoalAchievement || 0) + 1,
      };
    },

    updateSplitEventAdd: (state) => {
      return {
        ...state,
        onSplitEventAdd: (state.onSplitEventAdd || 0) + 1,
      };
    },

    updateFamilyBudgetAdd: (state) => {
      return {
        ...state,
        onFamilyBudgetAdd: (state.onFamilyBudgetAdd || 0) + 1,
      };
    },

    updateSearchScreenBack: (state) => {
      return {
        ...state,
        onSearchScreenBack: (state.onSearchScreenBack || 0) + 1,
      };
    },

    updateTransactionCount: (state) => {
      return {
        ...state,
        onNormalTransaction: (state.onNormalTransaction || 0) + 1,
      };
    },

    resetNormalTransactionCount: (state) => {
      return {
        ...state,
        onNormalTransaction: 0,
      };
    },

    updateAiCount: (state) => {
      return { ...state, onAiTransaction: (state.onAiTransaction || 0) + 1 };
    },

    updateBudgetCount: (state) => {
      return { ...state, onBudgetAdd: (state.onBudgetAdd || 0) + 1 };
    },

    updateFamTransactionCount: (state) => {
      return { ...state, onFamTransaction: (state.onFamTransaction || 0) + 1 };
    },

    resetFamilyTransactionCount: (state) => {
      return {
        ...state,
        onFamTransaction: 0,
      };
    },

    updateSplitTransactionCount: (state) => {
      return {
        ...state,
        onSplitTransaction: (state.onSplitTransaction || 0) + 1,
      };
    },

    updateGoalCount: (state) => {
      return { ...state, onGoalAdd: (state.onGoalAdd || 0) + 1 };
    },

    updateShoppingListCount: (state) => {
      return { ...state, onShoppingList: (state.onShoppingList || 0) + 1 };
    },
  },
});

export const localeSlice = createSlice({
  name: "locale",
  initialState: locale,
  reducers: {
    setLocale: (state, action) => {
      const { locale } = action.payload;
      return { ...state, locale: locale };
    },
  },
});

export const swipeLeftSlice = createSlice({
  name: "swipeleft",
  initialState: swipeLeftInstruction,
  reducers: {
    setIsSwipedLeft: (state, action) => {
      const { isSwipedleft } = action.payload;
      return { ...state, isSwipedleft: isSwipedleft };
    },
  },
});

export const countrySlice = createSlice({
  name: "country",
  initialState: isCountryAvailable,
  reducers: {
    storeCountryAvailability: (state, action) => {
      const { isCountryAvailable } = action.payload;
      return { ...state, isCountryAvailable: isCountryAvailable };
    },
  },
});

export const plusPopUpSlice = createSlice({
  name: "pluspopup",
  initialState: isPlusPurchasePopUpshown,
  reducers: {
    storeIsPlusPurchasePopUpshown: (state, action) => {
      const { isPlusPurchasePopUpshown } = action.payload;
      return { ...state, isPlusPurchasePopUpshown: isPlusPurchasePopUpshown };
    },
  },
});

// Use the type alias in the reducer
export const profileSlice = createSlice({
  name: "profile",
  initialState: profilestate,
  reducers: {
    profile: (state: ProfileObject, action) => {
      const { username } = action.payload;
      return { ...state, username: username };
    },
  },
});

export const fcmTokenSlice = createSlice({
  name: "fcmtoken",
  initialState: fcmToken,
  reducers: {
    storeFcmTokenLocally: (state, action) => {
      const { fcmtoken } = action.payload;
      return { ...state, fcmtoken: fcmtoken };
    },
  },
});

export const getNotifySlice = createSlice({
  name: "getnotify",
  initialState: getNotify,
  reducers: {
    getNotifyLocally: (state, action) => {
      const { getNotify } = action.payload;
      return { ...state, getNotify: getNotify };
    },
  },
});

export const proxySlice = createSlice({
  name: "proxy",
  initialState: proxy,
  reducers: {
    updateProxyState: (state: ProxyType, action) => {
      const { isProxy } = action.payload;
      return { ...state, isProxy: isProxy };
    },
  },
});

export const themeSlice = createSlice({
  name: "theme",
  initialState: themestate,
  reducers: {
    changeTheme: (state: ThemeObject, action) => {
      const { theme, isauto } = action.payload;
      return { ...state, theme: theme, isauto: isauto };
    },
  },
});

export const appOpenAdCountSlice = createSlice({
  name: "appopenadcount",
  initialState: appopenadcount,
  reducers: {
    appOpenAdCountUpdate: (state: AppOpenAd, action) => {
      const { appopenad } = action.payload;
      return { ...state, appopenad: appopenad };
    },
  },
});

export const currencySlice = createSlice({
  name: "currency",
  initialState: currencystate,
  reducers: {
    changeCurrency: (state: CurrencyObject, action) => {
      const { currency, currencycode, flag } = action.payload;
      return {
        ...state,
        currency: currency,
        currencycode: currencycode,
        flag: flag,
      };
    },
  },
});

export const lockSlice = createSlice({
  name: "lock",
  initialState: lockstate,
  reducers: {
    setpasscode: (state: LockObject, action) => {
      const { passcode } = action.payload;
      return { ...state, passcode: passcode };
    },
  },
});

export const lockToggleSlice = createSlice({
  name: "locktoggle",
  initialState: locktoggle,
  reducers: {
    lockToggle: (state: any, action) => {
      const { isLock, isFingerLock } = action.payload;
      return { ...state, isLock: isLock, isFingerLock: isFingerLock };
    },
  },
});

export const reminderTimeSlice = createSlice({
  name: "remindertime",
  initialState: reminder,
  reducers: {
    setReminder: (state: any, action) => {
      const { hour, minute, timezone, isreminder, selecteddays } =
        action.payload;
      return {
        ...state,
        hour: hour,
        minute: minute,
        timezone: timezone,
        isreminder: isreminder,
        selecteddays: selecteddays,
      };
    },
  },
});

export const firstTimeSmsSlice = createSlice({
  name: "firsttimesms",
  initialState: firstTimeSms,
  reducers: {
    setFirstTimeSms: (state: any, action) => {
      const { firstTimeSms } = action.payload;

      return {
        ...state,
        firstTimeSms: firstTimeSms,
      };
    },
  },
});

export const splitGuide = createSlice({
  name: "splitguide",
  initialState: splitguideobject,
  reducers: {
    setSplitGuide: (state: any, action) => {
      const {
        firstTimeSplit,
        firstTimeFamilySharing,
        firstTimeBudget,
        firstTimeShopping,
      } = action.payload;
      return {
        ...state,
        firstTimeSplit: firstTimeSplit,
        firstTimeFamilySharing: firstTimeFamilySharing,
        firstTimeBudget: firstTimeBudget,
        firstTimeShopping: firstTimeShopping,
      };
    },
  },
});

export const remoteConfigSlice = createSlice({
  name: "remoteconfigvalues",
  initialState: remoteconfigobject,
  reducers: {
    setRemoteConfig: (state: any, action) => {
      const {
        gpt_api_key,
        hide_ai,
        word_limit,
        force_update,
        live_version,
        update_string,
        ad_one_interval,
        ad_one_isReward,
        ad_three_interval,
        ad_three_isReward,
        ad_two_interval,
        ad_two_isReward,
        ad_openapp_interval,
        hideAd,
        hideAppOpenAd,
        hideAttachment,
        attachmentCount,
        freeSmsSyncCount,
        smsPrompt,
        smsKeywordLimit,
        showPurchaseOffer,
        showProHome,
        hideBannerAds,
        ad_four_interval,
        ad_four_isReward,
        splitCreateLimit,
        inReview,
        showCustomReview,
        festivalBGImage,
        mainSalesBGImage,
        festivalPercentageBannerUrl,
        hideRecurring,
        repeatTransactionLimit,
        showFestivalOffer,
        forceCustomRating,
        hideWatchAdPopup,
        familySharingCreateLimit,
        sales_bottom_infotext,
        transactionImagesUploadLimit,
        disallow_email_domains,
        plaid_supported_countries,
        upi_supported_countries,
        referralSenderCoinCount,
        referralReceiverCoinCount,
        familyDeductionCount,
        budgetDeductionCount,
        recurringDeductionCount,
        splitDeductionCount,
        hideReferralProgram,
        whatsNewFamilyVideo,
        whatsNewImportTransVideo,
        whatsNewSplitVideo,
        whatsNewBudgetVideo,
        whatsNewGoalsVideo,
        listLimitCount,
        whatsNewShoppingListVideo,
        whatsNewSmsSyncVideo,
        whatsNewSmsAutomationVideo,
        shoppingListDeductionCount,
        plaidBankLimitCount,
        send_push_notificaiton,
        transactionReviewCount,
        famTransactionReviewCount,
        budgetReviewCount,
        aiReviewCount,
        normalPromoCode,
        plusPromoCode,
        showNormalWeeklySub,
        hideRedeemCode,
        splitTransactionReviewCount,
        goalReviewCount,
        shoppingListReviewCount,
        customCatNameLength,
        freeAICount,
        paidAICount,
        hideAiChat,
        sp_404,
        sp_401,
        sp_402,
        response_mode,
        cg_model,
        whatsNewAIChatVideo,
        aiChatWordLimit,
        aiExpenseModel,
        hideDocumentScan,
        freeScanCount,
        paidScanCount,
        scanGptModel,
        whatsNewScanDocVideo,
        rateUsTitle,
        positiveBtnTxt,
        negativeBtnTxt,
        isUploadScanImgToAWS,
        isSkipDateMatch,
        hideSearchBar,
        whatsNewSearchByNoteVideo,
        whatsNewCurrencyConvertVideo,
        whatsNewCurrencyConvertModuleVideo,
        hideCurrencyConverter,
        hideShoppingList,
        hideGoals,
        showFeatureSlider,
        showPlaidRecurring,
        savingReviewCount,
        familyBudgetReviewCount,
        goalAchieveReviewCount,
        searchScreenCloseReviewCount,
        splitEventReviewCount,
        appOpenReviewCount,
        aiChatReviewCount,
        budgetCreateCount,
        festivalBtnColor,
        festivalBtnTxtColor,
        mainSalesTitleColor,
        mainSalesOtherColor,
        mainSalesBtnColor,
        isChatLock,
        isScanLock,
        showSpinWheel,
        watchAdsRewardCoins,
        smsParsingMaxLength,
        showSMSAutoToggle,
        showSplitSummary,
        hideStores,
        krogers_supported_countries,
        walmart_supported_countries,
        isFutureRepeat,
        isSendSignUpMail,
        showCustomKeyboard,
        onBoardSkipDays,
      } = action.payload;
      return {
        ...state,
        gpt_api_key: gpt_api_key,
        hide_ai: hide_ai,
        word_limit: word_limit,
        force_update: force_update,
        live_version: live_version,
        update_string: update_string,
        ad_one_interval: ad_one_interval,
        ad_one_isReward: ad_one_isReward,
        ad_three_interval: ad_three_interval,
        ad_three_isReward: ad_three_isReward,
        ad_two_interval: ad_two_interval,
        ad_two_isReward: ad_two_isReward,
        ad_openapp_interval: ad_openapp_interval,
        hideAd: hideAd,
        hideAppOpenAd: hideAppOpenAd,
        hideAttachment: hideAttachment,
        attachmentCount: attachmentCount,
        freeSmsSyncCount: freeSmsSyncCount,
        smsPrompt: smsPrompt,
        smsKeywordLimit: smsKeywordLimit,
        showPurchaseOffer: showPurchaseOffer,
        showProHome: showProHome,
        hideBannerAds: hideBannerAds,
        ad_four_interval: ad_four_interval,
        ad_four_isReward: ad_four_isReward,
        splitCreateLimit: splitCreateLimit,
        inReview: inReview,
        showCustomReview: showCustomReview,
        festivalBGImage: festivalBGImage,
        mainSalesBGImage: mainSalesBGImage,
        festivalPercentageBannerUrl: festivalPercentageBannerUrl,
        hideRecurring: hideRecurring,
        repeatTransactionLimit: repeatTransactionLimit,
        showFestivalOffer: showFestivalOffer,
        forceCustomRating: forceCustomRating,
        hideWatchAdPopup: hideWatchAdPopup,
        familySharingCreateLimit: familySharingCreateLimit,
        sales_bottom_infotext: sales_bottom_infotext,
        transactionImagesUploadLimit: transactionImagesUploadLimit,
        disallow_email_domains: disallow_email_domains,
        plaid_supported_countries: plaid_supported_countries,
        upi_supported_countries: upi_supported_countries,
        referralSenderCoinCount: referralSenderCoinCount,
        referralReceiverCoinCount: referralReceiverCoinCount,
        familyDeductionCount: familyDeductionCount,
        budgetDeductionCount: budgetDeductionCount,
        recurringDeductionCount: recurringDeductionCount,
        splitDeductionCount: splitDeductionCount,
        hideReferralProgram: hideReferralProgram,
        whatsNewFamilyVideo: whatsNewFamilyVideo,
        whatsNewImportTransVideo: whatsNewImportTransVideo,
        whatsNewSplitVideo: whatsNewSplitVideo,
        listLimitCount: listLimitCount,
        shoppingListDeductionCount: shoppingListDeductionCount,
        whatsNewBudgetVideo: whatsNewBudgetVideo,
        whatsNewGoalsVideo: whatsNewGoalsVideo,
        whatsNewShoppingListVideo: whatsNewShoppingListVideo,
        whatsNewSmsSyncVideo: whatsNewSmsSyncVideo,
        whatsNewSmsAutomationVideo: whatsNewSmsAutomationVideo,
        plaidBankLimitCount: plaidBankLimitCount,
        send_push_notificaiton: send_push_notificaiton,
        transactionReviewCount: transactionReviewCount,
        famTransactionReviewCount: famTransactionReviewCount,
        budgetReviewCount: budgetReviewCount,
        aiReviewCount: aiReviewCount,
        normalPromoCode: normalPromoCode,
        plusPromoCode: plusPromoCode,
        showNormalWeeklySub: showNormalWeeklySub,
        hideRedeemCode: hideRedeemCode,
        splitTransactionReviewCount: splitTransactionReviewCount,
        goalReviewCount: goalReviewCount,
        shoppingListReviewCount: shoppingListReviewCount,
        customCatNameLength: customCatNameLength,
        freeAICount: freeAICount,
        paidAICount: paidAICount,
        hideAiChat: hideAiChat,
        sp_404: sp_404,
        sp_401: sp_401,
        sp_402: sp_402,
        response_mode: response_mode,
        cg_model: cg_model,
        whatsNewAIChatVideo: whatsNewAIChatVideo,
        aiChatWordLimit: aiChatWordLimit,
        aiExpenseModel: aiExpenseModel,
        hideDocumentScan: hideDocumentScan,
        freeScanCount: freeScanCount,
        paidScanCount: paidScanCount,
        scanGptModel: scanGptModel,
        whatsNewScanDocVideo: whatsNewScanDocVideo,
        rateUsTitle: rateUsTitle,
        positiveBtnTxt: positiveBtnTxt,
        negativeBtnTxt: negativeBtnTxt,
        isUploadScanImgToAWS: isUploadScanImgToAWS,
        isSkipDateMatch: isSkipDateMatch,
        hideSearchBar: hideSearchBar,
        whatsNewSearchByNoteVideo: whatsNewSearchByNoteVideo,
        whatsNewCurrencyConvertVideo: whatsNewCurrencyConvertVideo,
        whatsNewCurrencyConvertModuleVideo: whatsNewCurrencyConvertModuleVideo,
        hideCurrencyConverter: hideCurrencyConverter,
        hideShoppingList: hideShoppingList,
        hideGoals: hideGoals,
        showFeatureSlider: showFeatureSlider,
        showPlaidRecurring: showPlaidRecurring,
        savingReviewCount: savingReviewCount,
        familyBudgetReviewCount: familyBudgetReviewCount,
        goalAchieveReviewCount: goalAchieveReviewCount,
        searchScreenCloseReviewCount: searchScreenCloseReviewCount,
        splitEventReviewCount: splitEventReviewCount,
        appOpenReviewCount: appOpenReviewCount,
        aiChatReviewCount: aiChatReviewCount,
        budgetCreateCount: budgetCreateCount,
        festivalBtnColor: festivalBtnColor,
        festivalBtnTxtColor: festivalBtnTxtColor,
        mainSalesTitleColor: mainSalesTitleColor,
        mainSalesOtherColor: mainSalesOtherColor,
        mainSalesBtnColor: mainSalesBtnColor,
        isChatLock: isChatLock,
        isScanLock: isScanLock,
        showSpinWheel: showSpinWheel,
        watchAdsRewardCoins: watchAdsRewardCoins,
        smsParsingMaxLength: smsParsingMaxLength,
        showSMSAutoToggle: showSMSAutoToggle,
        showSplitSummary: showSplitSummary,
        hideStores: hideStores,
        krogers_supported_countries: krogers_supported_countries,
        walmart_supported_countries: walmart_supported_countries,
        isFutureRepeat: isFutureRepeat,
        isSendSignUpMail: isSendSignUpMail,
        showCustomKeyboard: showCustomKeyboard,
        onBoardSkipDays: onBoardSkipDays,
      };
    },
  },
});

export const adsCountSlice = createSlice({
  name: "adscount",
  initialState: adscountobject,
  reducers: {
    updateAdsCount: (state: any, action) => {
      const {
        expensecount,
        splitexpensecount,
        aiexpensecount,
        splitbtnclickcount,
      } = action.payload;
      return {
        ...state,
        expensecount: expensecount,
        splitexpensecount: splitexpensecount,
        aiexpensecount: aiexpensecount,
        splitbtnclickcount: splitbtnclickcount,
      };
    },
  },
});

export const InAppPurcahseSlice = createSlice({
  name: "inapppurchase",
  initialState: inapppurchase,
  reducers: {
    updateInAppPurchaseState: (state: any, action) => {
      const { purchased } = action.payload;
      return { ...state, purchased: purchased };
    },
  },
});

export const languageSlice = createSlice({
  name: "locallanguage",
  initialState: locallanguage,
  reducers: {
    updateLocalLanguage: (state: Language, action) => {
      const { locallanguage } = action.payload;
      return { ...state, locallanguage: locallanguage };
    },
  },
});

export const splitEventCountSlice = createSlice({
  name: "spliteventcount",
  initialState: spliteventcount,
  reducers: {
    updateSplitEventCount: (state: SplitEventCountType, action) => {
      const { splitEventCount } = action.payload;
      return {
        ...state,
        splitEventCount: splitEventCount,
      };
    },
  },
});

export const budgetCountSlice = createSlice({
  name: "budgetcount",
  initialState: budgetCount,
  reducers: {
    updateBudgetCountLocal: (state: BudgetCountType, action) => {
      const { budgetCount } = action.payload;
      return {
        ...state,
        budgetCount: budgetCount,
      };
    },
  },
});

export const familyCountSlice = createSlice({
  name: "familycount",
  initialState: familyeventcount,
  reducers: {
    updateFamilyEventCount: (state: FamilyEventCountType, action) => {
      const { familyEventCount } = action.payload;
      return {
        ...state,
        familyEventCount: familyEventCount,
      };
    },
  },
});

export const recurringtCountSlice = createSlice({
  name: "recurringcount",
  initialState: recurringcount,
  reducers: {
    updateRecurringCount: (state: RecurringCountType, action) => {
      const { recurringCount } = action.payload;
      return {
        ...state,
        recurringCount: recurringCount,
      };
    },
  },
});

export const forceReviewSlice = createSlice({
  name: "forcereview",
  initialState: forceReview,
  reducers: {
    updateForceReview: (state, action) => {
      const { isUserReviewed107 } = action.payload;
      return {
        ...state,
        isUserReviewed107: isUserReviewed107,
      };
    },
  },
});

export const isFreeUserSlice = createSlice({
  name: "freeuser",
  initialState: freeUser,
  reducers: {
    updateIsFreeUser: (state, action) => {
      const { isFreeUser } = action.payload;
      return {
        ...state,
        isFreeUser: isFreeUser,
      };
    },
  },
});

export const newFeatureSlice = createSlice({
  name: "newfeature",
  initialState: newFeature,
  reducers: {
    updateNewFeature: (state, action) => {
      const { isNewFeatureShown } = action.payload;
      return {
        ...state,
        isNewFeatureShown: isNewFeatureShown,
      };
    },
  },
});

export const toolTipSlice = createSlice({
  name: "tooltip",
  initialState: toolTip,
  reducers: {
    updateToolTip: (state: ToolTipType, action) => {
      const {
        firstToolTip,
        secondToolTip,
        referralToolTip,
        aiToolTip,
        aiInfoTooltip,
      } = action.payload;
      return {
        ...state,
        firstToolTip: firstToolTip,
        secondToolTip: secondToolTip,
        referralToolTip: referralToolTip,
        aiToolTip: aiToolTip,
        aiInfoTooltip: aiInfoTooltip,
      };
    },
  },
});

export const firstRecurringSlice = createSlice({
  name: "firstrecurring",
  initialState: firstrecurring,
  reducers: {
    updateFirstRecurring: (state, action) => {
      const { firstRecurring } = action.payload;
      return {
        ...state,
        firstRecurring: firstRecurring,
      };
    },
  },
});

export const salesPageShownSlice = createSlice({
  name: "salespage",
  initialState: salespageShown,
  reducers: {
    salesPageShownDateUpdate: (state, action) => {
      const { salesPageShownDate } = action.payload;
      return {
        ...state,
        salesPageShownDate: salesPageShownDate,
      };
    },
  },
});

export const lastSpinDateSlice = createSlice({
  name: "lastspin",
  initialState: lastSpinDate,
  reducers: {
    lastSpinDateUpdate: (state, action) => {
      const { lastSpinDate } = action.payload;
      return {
        ...state,
        lastSpinDate: lastSpinDate,
      };
    },
  },
});

export const lastWatchAdDateSlice = createSlice({
  name: "lastwatchads",
  initialState: lastWatchAds,
  reducers: {
    lastWatchAdsDateUpdate: (state, action) => {
      const { lastWatchAdsDate } = action.payload;
      return {
        ...state,
        lastWatchAdsDate: lastWatchAdsDate,
      };
    },
  },
});

export const upiIdSlice = createSlice({
  name: "upi",
  initialState: upi,
  reducers: {
    upiUpdate: (state, action) => {
      const { upi } = action.payload;
      return {
        ...state,
        upi: upi,
      };
    },
  },
});

export const eventCurrencySlice = createSlice({
  name: "eventcurrency",
  initialState: eventCurrencyObject,
  reducers: {
    updateEventCurrency: (state: CurrencyObject, action) => {
      const { currency, currencycode, flag } = action.payload;
      return {
        ...state,
        currency: currency,
        currencycode: currencycode,
        flag: flag,
      };
    },
  },
});

export const hideAiSlice = createSlice({
  name: "hideai",
  initialState: hideai,
  reducers: {
    updateHideAi: (state, action) => {
      const { isHideAi } = action.payload;
      return {
        ...state,
        isHideAi: isHideAi,
      };
    },
  },
});

export const firstMemberToSplitSlice = createSlice({
  name: "firstmember",
  initialState: firstmembertosplit,
  reducers: {
    updateFirstMemberAdded: (state, action) => {
      const { isFirstMemberAdded } = action.payload;
      return {
        ...state,
        isFirstMemberAdded: isFirstMemberAdded,
      };
    },
  },
});

export const plusPurchasedSlice = createSlice({
  name: "plusPurchased",
  initialState: plusPurchased,
  reducers: {
    updatePlusPurchased: (state, action) => {
      const { isPlusPurchased } = action.payload;
      return {
        ...state,
        isPlusPurchased: isPlusPurchased,
      };
    },
  },
});

export const countryCodeSlice = createSlice({
  name: "countryCode",
  initialState: countrycode,
  reducers: {
    updateCountryCode: (state, action) => {
      const { countryCode } = action.payload;
      return {
        ...state,
        countryCode: countryCode,
      };
    },
  },
});

export const coinsSlice = createSlice({
  name: "coins",
  initialState: coins,
  reducers: {
    updateCoins: (state, action) => {
      const { coins } = action.payload;
      return {
        ...state,
        coins: coins,
      };
    },
  },
});

export const walletSlice = createSlice({
  name: "wallet",
  initialState: wallet,
  reducers: {
    updateWallet: (state, action) => {
      const { name, id } = action.payload;
      return {
        ...state,
        id: id,
        name: name,
      };
    },
  },
});

export const themeColorSlice = createSlice({
  name: "themeColor",
  initialState: themeColor,
  reducers: {
    updateThemeColor: (state, action) => {
      const { themeColor } = action.payload;
      return {
        ...state,
        themeColor: themeColor,
      };
    },
  },
});

export const appVersiomSlice = createSlice({
  name: "lastAppVersion",
  initialState: lastAppVersion,
  reducers: {
    updateAppVersion: (state, action) => {
      const { lastAppVersion } = action.payload;
      return {
        ...state,
        lastAppVersion: lastAppVersion,
      };
    },
  },
});

export const listCountSlice = createSlice({
  name: "listcount",
  initialState: listcount,
  reducers: {
    updateListCount: (state: ListCountType, action) => {
      const { listCount } = action.payload;
      return {
        ...state,
        listCount: listCount,
      };
    },
  },
});

export const primaryGoalSlice = createSlice({
  name: "primarygoal",
  initialState: primarygoal,
  reducers: {
    updatePrimaryGoal: (state: PrimaryGoalType, action) => {
      const { primaryGoals } = action.payload;
      return {
        ...state,
        primaryGoals: primaryGoals,
      };
    },
  },
});

const rateUsExport = {
  isFirstTimeRateUs: true,
};

export const rateUsSettingSlice = createSlice({
  name: "isfirsttimerateus",
  initialState: rateUsExport,
  reducers: {
    updateFirstTimeRateUsCount: (state: any, action) => {
      const { isFirstTimeRateUs } = action.payload;
      return {
        ...state,
        isFirstTimeRateUs: isFirstTimeRateUs,
      };
    },
  },
});

export const reducers = {
  notes: allNotesSlice.reducer,
  isfirsttimerateus: rateUsSettingSlice.reducer,
  ratingpopup: ratingSlice.reducer,
  listcount: listCountSlice.reducer,
  primarygoal: primaryGoalSlice.reducer,
  theme: themeSlice.reducer,
  lock: lockSlice.reducer,
  currency: currencySlice.reducer,
  locktoggle: lockToggleSlice.reducer,
  remindertime: reminderTimeSlice.reducer,
  profile: profileSlice.reducer,
  splitguide: splitGuide.reducer,
  firsttimesms: firstTimeSmsSlice.reducer,
  remoteconfigvalues: remoteConfigSlice.reducer,
  adscount: adsCountSlice.reducer,
  inapppurchase: InAppPurcahseSlice.reducer,
  appopenadcount: appOpenAdCountSlice.reducer,
  proxy: proxySlice.reducer,
  locallanguage: languageSlice.reducer,
  spliteventcount: splitEventCountSlice.reducer,
  budgetcount: budgetCountSlice.reducer,
  forcereview: forceReviewSlice.reducer,
  freeuser: isFreeUserSlice.reducer,
  recurringcount: recurringtCountSlice.reducer,
  newfeature: newFeatureSlice.reducer,
  toolTip: toolTipSlice.reducer,
  firstrecurring: firstRecurringSlice.reducer,
  salespage: salesPageShownSlice.reducer,
  lastspin: lastSpinDateSlice.reducer,
  lastwatchads: lastWatchAdDateSlice.reducer,
  eventcurrency: eventCurrencySlice.reducer,
  hideai: hideAiSlice.reducer,
  familycount: familyCountSlice.reducer,
  firstmember: firstMemberToSplitSlice.reducer,
  plusPurchased: plusPurchasedSlice.reducer,
  countryCode: countryCodeSlice.reducer,
  coins: coinsSlice.reducer,
  wallet: walletSlice.reducer,
  themeColor: themeColorSlice.reducer,
  lastAppVersion: appVersiomSlice.reducer,
  fcmToken: fcmTokenSlice.reducer,
  country: countrySlice.reducer,
  pluspopup: plusPopUpSlice.reducer,
  getnotify: getNotifySlice.reducer,
  swipeleft: swipeLeftSlice.reducer,
  locale: localeSlice.reducer,
  ratingCount: ratingCountSlice.reducer,
  openai: openAiSlice.reducer,
  chatcount: ChatCountSlice.reducer,
  datechange: dateChangedSlice.reducer,
  scancount: scanCountSlice.reducer,
  smssynccount: smsSyncCountSlice.reducer,
  currencyconverter: currencyConverterSlice.reducer,
  currencyconverterflag: currencyConverterFlagCountSlice.reducer,
  subcatflag: subCatFlagCountSlice.reducer,
  timefiltertooltip: timeFilterTooltipSlice.reducer,
  selectcurrencytooltip: selectCurrencyTooltipSlice.reducer,
  notificationupdate: notificationUpdateFlagSlice.reducer,
  usercountscreen: userCountScreenFlagSlice.reducer,
  walmartSign: walmartSlice.reducer,
  attachmentCount: attachmentCountSlice.reducer,
  selectedStore: selectedStoreSlice.reducer,
  featuresliderdata: featureSliderSlice.reducer,
  coloredtransaction: coloredTransactionSlice.reducer,
  hidebottomtab: hideBottomTabSlice.reducer,
  customkeyboard: customKeyboardSlice.reducer,
  catedit: catEditSlice.reducer,
  catsort: catSortSlice.reducer,
  syncsms: syncSmsSlice.reducer,
  krogersToken: krogersSlice.reducer,
  upi: upiIdSlice.reducer,
  onboardingdata: onBoardSlice.reducer,
  onboardskipdate: onBoardSkipDateSlice.reducer,
};

// ============================================================================
// EXPORTED ACTIONS - ORGANIZED BY CATEGORY
// ============================================================================

// Store Integration Actions
export const { updateWalmartSign } = walmartSlice.actions;
export const { updateKrogersToken } = krogersSlice.actions;

// UI/UX Flag Actions
export const { updateUserCountScreenFlag } = userCountScreenFlagSlice.actions;
export const { updateNotificationFlag } = notificationUpdateFlagSlice.actions;
export const { updateSelectCurrencyTooltip } = selectCurrencyTooltipSlice.actions;
export const { updateTimeFilterTooltip } = timeFilterTooltipSlice.actions;

// Currency & Financial Actions
export const { updateCurrencyConverter } = currencyConverterSlice.actions;
export const { updateCurrencyConverterFlag } = currencyConverterFlagCountSlice.actions;
export const { updateSubCatFlag } = subCatFlagCountSlice.actions;

// Notes & Content Actions
export const { updateNotes, deleteAllNotes } = allNotesSlice.actions;

// Analytics & Tracking Actions
export const { updateSmsSyncCount } = smsSyncCountSlice.actions;
export const { updateAttachmentCount } = attachmentCountSlice.actions;
export const { updateFirstTimeRateUsCount } = rateUsSettingSlice.actions;

// Onboarding Actions
export const {
  updateBudgetingFor,
  updateIncomeAndExpense,
  updateLastVisitedIntroScreen,
  updateMostAnxiousPopUps,
  updatePrimaryGoals,
  updateSpendMostOn,
  updateUnplannedExpenses,
  updateOnBoardingData,
  resetOnBoardingData,
} = onBoardSlice.actions;
export const { updateOnboardSkipDate } = onBoardSkipDateSlice.actions;

// UI & Feature Actions
export const { updateSelectedStore } = selectedStoreSlice.actions;
export const { updateFeatureSliderData } = featureSliderSlice.actions;
export const { updateColoredTransactions } = coloredTransactionSlice.actions;
export const { updateHideBottomTab } = hideBottomTabSlice.actions;
export const { updateCustomKeyboard } = customKeyboardSlice.actions;
export const { updateCatEditFlag } = catEditSlice.actions;
export const { updateCatSortingFilter } = catSortSlice.actions;
export const { updateSyncSmsFlag } = syncSmsSlice.actions;

// Rating & Analytics Actions
export const { updateRatingPopUpFlag } = ratingSlice.actions;
export const {
  updateTransactionCount,
  resetNormalTransactionCount,
  updateAiCount,
  updateBudgetCount,
  updateFamTransactionCount,
  resetFamilyTransactionCount,
  updateSplitTransactionCount,
  updateGoalCount,
  updateShoppingListCount,
  updateAppOpen,
  updateChatResponse,
  updateSavingAdd,
  updateGoalAchievement,
  updateSplitEventAdd,
  updateFamilyBudgetAdd,
  updateSearchScreenBack,
} = ratingCountSlice.actions;
export const { setIsSwipedLeft } = swipeLeftSlice.actions;
export const { updatingOpenAiFlag } = openAiSlice.actions;
export const { changeTheme } = themeSlice.actions;
export const { setpasscode } = lockSlice.actions;
export const { changeCurrency } = currencySlice.actions;
export const { lockToggle } = lockToggleSlice.actions;
export const { setReminder } = reminderTimeSlice.actions;
export const { profile } = profileSlice.actions;
export const { setSplitGuide } = splitGuide.actions;
export const { setFirstTimeSms } = firstTimeSmsSlice.actions;
export const { setRemoteConfig } = remoteConfigSlice.actions;
export const { updateAdsCount } = adsCountSlice.actions;
export const { updateInAppPurchaseState } = InAppPurcahseSlice.actions;
export const { appOpenAdCountUpdate } = appOpenAdCountSlice.actions;
export const { updateProxyState } = proxySlice.actions;
export const { updateLocalLanguage } = languageSlice.actions;
export const { updateSplitEventCount } = splitEventCountSlice.actions;
export const { updateBudgetCountLocal } = budgetCountSlice.actions;
export const { updateForceReview } = forceReviewSlice.actions;
export const { updateIsFreeUser } = isFreeUserSlice.actions;
export const { updateRecurringCount } = recurringtCountSlice.actions;
export const { updateNewFeature } = newFeatureSlice.actions;
export const { updateToolTip } = toolTipSlice.actions;
export const { updateFirstRecurring } = firstRecurringSlice.actions;
export const { salesPageShownDateUpdate } = salesPageShownSlice.actions;
export const { lastSpinDateUpdate } = lastSpinDateSlice.actions;
export const { lastWatchAdsDateUpdate } = lastWatchAdDateSlice.actions;
export const { upiUpdate } = upiIdSlice.actions;
export const { updateEventCurrency } = eventCurrencySlice.actions;
export const { updateHideAi } = hideAiSlice.actions;
export const { updateFamilyEventCount } = familyCountSlice.actions;
export const { updateFirstMemberAdded } = firstMemberToSplitSlice.actions;
export const { updatePlusPurchased } = plusPurchasedSlice.actions;
export const { updateCountryCode } = countryCodeSlice.actions;
export const { updateCoins } = coinsSlice.actions;
export const { updateWallet } = walletSlice.actions;
export const { updateThemeColor } = themeColorSlice.actions;
export const { updateAppVersion } = appVersiomSlice.actions;
export const { updateListCount } = listCountSlice.actions;
export const { updatePrimaryGoal } = primaryGoalSlice.actions;
export const { storeFcmTokenLocally } = fcmTokenSlice.actions;
export const { storeCountryAvailability } = countrySlice.actions;
export const { storeIsPlusPurchasePopUpshown } = plusPopUpSlice.actions;
export const { getNotifyLocally } = getNotifySlice.actions;
export const { setLocale } = localeSlice.actions;
export const { updateLocalChatCount } = ChatCountSlice.actions;
export const { updateIsDateChanged } = dateChangedSlice.actions;
export const { updateScanCount } = scanCountSlice.actions;
