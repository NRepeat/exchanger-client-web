/* eslint-disable max-len */
const page_404 = require("./ru/pages/404.json");
const page_about = require("./ru/pages/about.json");
const page_exchange_form = require("./ru/pages/exchange/form.json");
const technical_work = require("./ru/pages/technical_work.json");
const page_rules = require("./ru/pages/rules.json");
const page_main = require("./ru/pages/main.json");

const page_exchange_order_global = require("./ru/pages/exchange/order/global.json");
const page_exchange_order_delete = require("./ru/pages/exchange/order/deleted.json");
const page_exchange_order_confirmation = require("./ru/pages/exchange/order/confirmation.json");
const page_exchange_order_secret = require("./ru/pages/exchange/order/secret.json");

const page_redirect_account_password_error = require("./ru/pages/redirect/account/account_password_error.json");
const page_redirect_account_activate_error = require("./ru/pages/redirect/account/account_activate_error.json");
const page_redirect_account_activate_success = require("./ru/pages/redirect/account/account_activate_success.json");
const page_redirect_account_change_email_error = require("./ru/pages/redirect/account/account_change_email_error.json");
const page_redirect_account_change_email_success = require("./ru/pages/redirect/account/account_change_email_success.json");
const page_redirect_account_error = require("./ru/pages/redirect/account/account_error.json");
const page_redirect_account_success = require("./ru/pages/redirect/account/account_success.json");

const page_partners = require("./ru/pages/partners.json");

const page_partner_api = require("./ru/pages/partner-api.json");
const page_user_api = require("./ru/pages/user/api.json");
const page_user_order = require("./ru/pages/user/order.json");
const page_user_profile = require("./ru/pages/user/profile.json");
const page_user_requisites = require("./ru/pages/user/requisites.json");
const page_user_links = require("./ru/pages/user/user_nav.json");

const page_news = require("./ru/pages/news/news.json");
const page_reviews = require("./ru/pages/reviews.json");

const page_reset_password = require("./ru/pages/_token.json");
const page_contacts = require("./ru/pages/contacts.json");
const page_faq = require("./ru/pages/faq.json");
const page_merchants_doc = require("./ru/pages/merchants-doc.json");

// ...

// ui elements
// const ui_header = require('./' + "ru" + '/ui/header.json');
const ui_footer = require("./ru/ui/footer.json");
const ui_buttons = require("./ru/ui/buttons.json");
const ui_order = require("./ru/ui/order.json");
const ui_header = require("./ru/ui/header.json");
const ui_modules = require("./ru/ui/modules.json");

// ...

// modals
const modal_login = require("./ru/modals/login.json");
const modal_sign_up = require("./ru/modals/sign_up.json");
const modal_2fa = require("./ru/modals/2fa.json");
const modal_partner_auto_get_money = require("./ru/modals/partner/auto_get_money.json");
const modal_partner_change_rate = require("./ru/modals/partner/change_rate.json");
const modal_partner_get_money = require("./ru/modals/partner/get_money.json");

// meta_tags

const m_technical_work = require("./ru/meta_tags/technical_work.json");
const m_api = require("./ru/meta_tags/user/api.json");
const m_orders = require("./ru/meta_tags/user/orders.json");
const m_technical = require("./ru/meta_tags/technical_work.json");
const m_user = require("./ru/meta_tags/user.json");
const m_reviews = require("./ru/meta_tags/reviews.json");
const m_partners = require("./ru/meta_tags/partners.json");
const m_main = require("./ru/meta_tags/main.json");
const m_faq = require("./ru/meta_tags/faq.json");
const m_contacts = require("./ru/meta_tags/contacts.json");
const m_news = require("./ru/meta_tags/news/news.json");
const m_rules = require("./ru/meta_tags/rules/rules.json");
const m_partners_system = require("./ru/meta_tags/user/partner-system.json");
const m_requisites = require("./ru/meta_tags/user/requisites.json");

export default {
  "moment-locale": "ru",
  "text-field": "Поле ",
  "not-filled": " не заполнено",
  errorMessage: {
    5555555555555555: "Технические работы. Не беспокойтесь, если Ваша заявка была оплачена до момента начала технических работ, то она будет обработана в ближайшее время. Приносим извинения за временные неудобства.",
    40301: "Вы не авторизованны! Для данного действия необходимо войти в свой аккаунт.",
    241351: "Аккаунт не найден. Проверьте адрес электронной почты или зарегистрируйте новый аккаунт.",
    5030000: "Невозможно выполнить ваш запрос. Пожалуйста, повторите ваш запрос через {time} секунд.",
    1601588666628861: 'Вы не бот? Пожалуйста, поставьте галочку в поле "Я не робот" и попробуйте снова.',
    6231533598118172: "Неверный код.",
    3421537955653247: "Неверный код.",
    7461542063995112: "Номер телефона введен неверно. Проверьте правильность ввода и повторите попытку.",
    6741546826351955: "Неверный код. Пожалуйста, попробуйте еще раз.",
    2801537954040709: "Вы уже установили 2-фа авторизацию.",
    9301546172123667: "Вы уже оставили отзыв сегодня! Вы можете оставить только 1 отзыв в сутки.",
    2101529500915451: "Ваш отзыв слишком большой, максимум 1000 символов. ",
    3961529529941976: "Email указан неверно",
    11000654: "Email уже используется вы можете востановить пароль.",
    2355231636112: "Аккаунт не активирован.",
    67562: "Имя или Фамилия указаны неверно ",
    5341529529941981: "Пароль не указан",
    5071545873252155: "Поле суммы указано неверно",
    8781529530113112: "Email не заполнен",
    8291556107293522: "Сумма вывода должна быть больше нуля",
    1661545348963371: "Сумма обмена должна быть больше нуля",
    5471556107294030: "Сумма обмена должна быть больше нуля",
    7701545348962388: "Сумма обмена должна быть больше нуля",
    3631545348962766: "Сумма обмена должна быть меньше {max}",
    9951545348963165: "Сумма обмена должна быть меньше {max} (недостаточно резервов)",
    7701545348962387: "Сумма обмена должна быть больше {min}",
    6801545277215051: "Направление недоступно. Пожалуйста, попробуйте позже"
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
        account_activate_success: page_redirect_account_activate_success,
        account_email_change: {
          success: "Отправили письмо с подтверждением на ваш почтовый аддресс."
        },
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
          status: "Заявка заморожена проходит дополнительную проверку."
        },
        done: {
          status: "Выполнена."
        },
        returned: {
          status: "Средства возвращены."
        }
        //and other elements ....
      },
      copied: "Скопировано!"
    }

    //and other pages ....
  },
  ui: {
    footer: ui_footer,
    buttons: ui_buttons,
    header: ui_header,
    order: ui_order,
    modules: ui_modules
    //and other ui elements ....
  },
  modals: {
    "2fa": modal_2fa,
    login: modal_login,
    profile: {
      blockAccountTitle: "Вы хотите заблокировать свой аккаунт?",
      blockAccountSubTitle: "Будет заблокирован на 7 дней.",
      sureTitle: "Вы уверены?",
      sureBlockAccountSubTitle: "Этот аккаунт будет немедленно заблокирован.",
      deleteAccountTitle: "Вы хотите удалить свой аккаунт?",
      deleteAccountSubTitle: "Вы не можете отменить это действие!",
      sureDeleteAccountSubTitle: "Эта учетная запись будет немедленно удалена.",
      btnCancel: "Отменить",
      btnOk: "Да",
      btnSure: "Уверен"
    },
    sign_up: modal_sign_up,
    partner: {
      auto_get_money: modal_partner_auto_get_money,
      change_rate: modal_partner_change_rate,
      get_money: modal_partner_get_money
    }
    //and other modals ....
  },
  "Card number": "Номер карты"
};
