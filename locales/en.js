/* eslint-disable max-len*/
const page_404 = require("./en/pages/404.json");
const page_about = require("./en/pages/about.json");
const page_exchange_form = require("./en/pages/exchange/form.json");
const technical_work = require("./en/pages/technical_work.json");
const page_rules = require("./en/pages/rules.json");
const page_main = require("./en/pages/main.json");

const page_exchange_order_global = require("./en/pages/exchange/order/global.json");
const page_exchange_order_delete = require("./en/pages/exchange/order/deleted.json");
const page_exchange_order_confirmation = require("./en/pages/exchange/order/confirmation.json");
const page_exchange_order_secret = require("./en/pages/exchange/order/secret.json");

const page_redirect_account_password_error = require("./en/pages/redirect/account/account_password_error.json");
const page_redirect_account_activate_error = require("./en/pages/redirect/account/account_activate_error.json");
const page_redirect_account_activate_success = require("./en/pages/redirect/account/account_activate_success.json");
const page_redirect_account_change_email_error = require("./en/pages/redirect/account/account_change_email_error.json");
const page_redirect_account_change_email_success = require("./en/pages/redirect/account/account_change_email_success.json");
const page_redirect_account_error = require("./en/pages/redirect/account/account_error.json");
const page_redirect_account_success = require("./en/pages/redirect/account/account_success.json");

const page_partners = require("./en/pages/partners.json");

const page_partner_api = require("./en/pages/partner-api.json");
const page_user_api = require("./en/pages/user/api.json");
const page_user_order = require("./en/pages/user/order.json");
const page_user_profile = require("./en/pages/user/profile.json");
const page_user_requisites = require("./en/pages/user/requisites.json");
const page_user_links = require("./en/pages/user/user_nav.json");

const page_news = require("./en/pages/news/news.json");
const page_reviews = require("./en/pages/reviews.json");

const page_reset_password = require("./en/pages/_token.json");
const page_contacts = require("./en/pages/contacts.json");
const page_faq = require("./en/pages/faq.json");
const page_merchants_doc = require("./en/pages/merchants-doc.json");


// ui elements
const ui_header = require("./en/ui/header.json");
const ui_footer = require("./en/ui/footer.json");
const ui_buttons = require("./en/ui/buttons.json");
const ui_order = require("./en/ui/order.json");
const ui_modules = require("./en/ui/modules.json");
// ...

// modals
const modal_login = require("./en/modals/login.json");
const modal_sign_up = require("./en/modals/sign_up.json");
const modal_2fa = require("./en/modals/2fa.json");
// const modal_partner_about = require('./' + lang_dir + '/modals/partner/about.json');
const modal_partner_auto_get_money = require("./en/modals/partner/auto_get_money.json");
const modal_partner_change_rate = require("./en/modals/partner/change_rate.json");
const modal_partner_get_money = require("./en/modals/partner/get_money.json");
// ...
// meta_tags
const m_technical_work = require("./en/meta_tags/technical_work.json");
const m_api = require("./en/meta_tags/user/api.json");
const m_orders = require("./en/meta_tags/user/orders.json");
const m_technical = require("./en/meta_tags/technical_work.json");
const m_user = require("./en/meta_tags/user.json");
const m_reviews = require("./en/meta_tags/reviews.json");
const m_partners = require("./en/meta_tags/partners.json");
const m_main = require("./en/meta_tags/main.json");
const m_faq = require("./en/meta_tags/faq.json");
const m_contacts = require("./en/meta_tags/contacts.json");
const m_news = require("./en/meta_tags/news/news.json");
const m_rules = require("./en/meta_tags/rules/rules.json");
const m_partners_system = require("./en/meta_tags/user/partner-system.json");
const m_requisites = require("./en/meta_tags/user/requisites.json");
export default {
  "moment-locale": "en-gb",
  "text-field": "The form data ",
  "not-filled": " fields are not filled ",
  errorMessage: {
    5555555555555555: "Technical work. Do not worry if your application was submitted during the technical operation period. It will be processed soon.",
    40301: "You are not authorized.",
    241351: "Account not found. Check email address or register new account.",
    5030000: "Anti-flood system! Try after: {time} second(s).",
    1601588666628861: `Are you bot? Please fill out the "I'm not robot'" and try again.`,
    3421537955653247: "Incorrect code. Please try again.",
    7461542063995112: "Incorrect phone number.",
    6741546826351955: "Incorrect code. Please try again.",
    6231533598118172: "Incorrect code.",
    9301546172123667: "You already left a review today! You can only leave 1 review per day.",
    2801537954040709: "You already uses 2fa authorization.",
    2101529500915451: "Your review is too big. Maximum of 5,000 characters.",
    3961529529941976: "Email is not valid",
    11000654: "Email address already in use",
    2355231636112: "Account is not activated",
    67562: "First name or last name is not valid ",
    5341529529941981: "Password is not valid",
    5071545873252155: "The field amount isn't valid",
    8781529530113112: "Email is not field ",
    8291556107293522: "Withdrawal amount should be greater then zero",
    1661545348963371: "Exchange amount should be greater then zero",
    5471556107294030: "Exchange amount should be greater then zero",
    7701545348962388: "Exchange amount should be greater then zero",
    3631545348962766: "Exchange amount should be less then {max}",
    9951545348963165: "Take amount should be less then {max}, We don't have enough reserve.",
    7701545348962387: "Exchange amount should be greater then {min}",
    6801545277215051: "Route isn't available. Please try later."
  },

  meta: {
    rules: m_rules,
    news: m_news,
    requisites: m_requisites,
    partners_system: m_partners_system,
    orders: m_orders,
    faq: m_faq,
    contacts: m_contacts,
    technical: m_technical,
    main: m_main,
    partners: m_partners,
    reviews: m_reviews,
    user: m_user,
    api: m_api,
    technical_work: m_technical_work
  },
  page: {
    merchants: page_merchants_doc,
    main: page_main,
    news: page_news,
    rules: page_rules,
    reviews: page_reviews,
    technical: technical_work,
    "404": page_404,
    about: page_about,
    reset_password: page_reset_password,
    contacts: page_contacts,
    faq: page_faq,
    partners: page_partners,
    partner_api: page_partner_api,
    user: {
      api: page_user_api,
      profile: page_user_profile,
      requisites: page_user_requisites,
      nav: page_user_links,
      order: page_user_order
    },
    exchange: {
      form: page_exchange_form,
      redirect: {
        account_activate_error: page_redirect_account_activate_error,
        account_email_change: {
          success: "To confirm check verify email."
        },
        account_activate_success: page_redirect_account_activate_success,
        account_error: page_redirect_account_error,
        account_success: page_redirect_account_success,
        account_email_success: page_redirect_account_change_email_success,
        account_email_error: page_redirect_account_change_email_error,
        account_password_error: page_redirect_account_password_error
      },
      order: {
        ...page_exchange_order_global,
        delete: page_exchange_order_delete,
        confirmation: page_exchange_order_confirmation,
        secret: page_exchange_order_secret,
        hold: {
          status: "Order is hold.."
        },
        done: {
          status: "Order is done."
        },
        returned: {
          status: "Order is returned."
        }

        //and other elements ....
      },
      copied: "Copied!"
    }

    //and other pages ....
  },
  ui: {
    footer: ui_footer,
    buttons: ui_buttons,
    header: ui_header,
    order: ui_order,
    modules: ui_modules,
    //and other ui elements ....
  },
  modals: {
    "2fa": modal_2fa,
    login: modal_login,
    profile: {
      blockAccountTitle: "Are you want block your account?",
      blockAccountSubTitle: "Will blocked for 7 days.",
      sureTitle: "Are you sure?",
      sureBlockAccountSubTitle: "This account will be blocked immediately.",
      deleteAccountTitle: "Are you want delete your account?",
      deleteAccountSubTitle: "You can't undo this action!",
      sureDeleteAccountSubTitle: "This account will be deleted immediately.",
      btnCancel: "Cancel",
      btnOk: "OK",
      btnSure: "Sure"
    },
    sign_up: modal_sign_up,
    partner: {
      auto_get_money: modal_partner_auto_get_money,
      change_rate: modal_partner_change_rate,
      get_money: modal_partner_get_money
    }
    //and other modals ....
  },
  "Card number": "Card number"
};
