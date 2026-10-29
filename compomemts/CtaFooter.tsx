import "./CtaFooter.css";

const PHONES = ["01270469567", "01556009567" ,"01006147731"];

// 📍 حط هنا رابط المعرض من خرائط جوجل (Share ثم Copy link)
const MAP_URL = "https://maps.app.goo.gl/p8F8S7ZV5kVrrDNR6?g_st=ic";

// رقم دولي لروابط الاتصال: 01270469567 → +201270469567
const intl = (phone: string) => `+2${phone}`;

const LINKS = [
  { label: "الأبواب", href: "/doors/wood" },
  { label: "الشبابيك", href: "/windows" },
  { label: "youtube", href: "https://www.youtube.com/@boulanagy8802" },
  { label: "facebook", href: "https://www.facebook.com/share/14tU9N3fTrE/?mibextid=wwXIfrk" },
  { label: "tiktok", href: "tiktok.com/@boulanagy" },
];

const isExternal = (href: string) => href.startsWith("http");

export default function CtaFooter() {
  return (
    <>
      {/* ===== قسم الدعوة للتواصل ===== */}
      <section className="cta" dir="rtl">
        <div className="cta__inner">
          <div className="cta__text">
            <h2 className="cta__title">جاهز تغيّر أبواب وشبابيك بيتك؟</h2>
            <p className="cta__subtitle">
              كلمنا دلوقتي واحصل على عرض سعر حسب مقاسك وتصميمك.
            </p>
          </div>

          <div className="cta__actions">
            {PHONES.map((p) => (
              <a key={p} className="cta__phone" href={`tel:${intl(p)}`}>
                {p}
              </a>
            ))}
            <a className="cta__btn" href={`tel:${intl(PHONES[1])}`}>
              اتصل الآن
            </a>
          </div>
        </div>
      </section>

      {/* ===== الفوتر ===== */}
      <footer className="footer" dir="rtl">
        <div className="footer__inner">
          <div className="footer__col footer__brand">
            <h3 className="footer__brand-name">معرض السلام</h3>
            <p>للتجارة الأبواب والشبابيك</p>
            <small>Alsalam Showroom</small>
          </div>

          <div className="footer__col">
            <h4 className="footer__heading">روابط</h4>
            <ul className="footer__list">
              {LINKS.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    {...(isExternal(l.href) ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer__col">
            <h4 className="footer__heading">تواصل</h4>
            <ul className="footer__list">
              {PHONES.map((p) => (
                <li key={p}>
                  <a href={`tel:${intl(p)}`}>{p}</a>
                </li>
              ))}
              <li>
                <a href={MAP_URL} target="_blank" rel="noopener noreferrer">
                      مصر - القاهره/ 5 ش الترول عين شمس الغربيه بجوار مسجد التعاون محطه الونش
                </a>
              </li>
              
            </ul>
          </div>
        </div>

        <div className="footer__bottom">
          © معرض السلام. جميع الحقوق محفوظة.
        </div>
      </footer>
    </>
  );
}
