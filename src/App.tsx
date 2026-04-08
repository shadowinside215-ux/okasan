import { useState, useEffect, useRef, ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  addDoc,
  deleteDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut,
  User
} from 'firebase/auth';
import { db, auth } from './firebase';
import { 
  Menu as MenuIcon, 
  X, 
  ShoppingBag, 
  Star, 
  Phone, 
  MapPin, 
  Clock, 
  Instagram, 
  Facebook, 
  Twitter,
  ChevronRight,
  Plus,
  Minus,
  Trash2,
  Globe,
  Lock,
  Upload,
  Image as ImageIcon
} from 'lucide-react';

// --- Types ---
interface MenuItem {
  id: string;
  name: string;
  price: number;
  description: string;
  category: 'Sushi Rolls' | 'Sashimi' | 'Platters' | 'Drinks';
  image: string;
}

interface CartItem extends MenuItem {
  quantity: number;
}

interface Review {
  id: number;
  name: string;
  rating: number;
  comment: string;
  date: string;
}

type Language = 'en' | 'fr' | 'ar';

// --- Translations ---
const translations = {
  en: {
    home: 'Home',
    menu: 'Menu',
    about: 'About',
    reviews: 'Reviews',
    contact: 'Contact',
    viewMenu: 'View Menu',
    orderNow: 'Order Now',
    subtitle: 'Authentic Japanese Sushi Experience',
    rating: '4.5 Rating',
    basedOn: 'Based on 57 authentic reviews',
    priceRange: 'Average price per person',
    fullService: 'Full Service',
    serviceDetails: 'Dine-in, Takeaway & Delivery',
    recommendations: "Chef's Recommendations",
    addToCart: 'Add to Cart',
    ourMenu: 'Our Menu',
    menuDesc: 'Each dish is prepared with the freshest ingredients, following traditional Japanese techniques passed down through generations.',
    artOfSushi: 'The Art of Sushi',
    aboutText1: 'Founded in the heart of Sala Al Jadida, Okasan Sushi was born from a passion for authentic Japanese culinary traditions. "Okasan" means mother in Japanese, reflecting our commitment to the care, warmth, and dedication we put into every dish.',
    aboutText2: 'Our Master Sushi Chef brings over 20 years of experience, sourcing only the finest seasonal fish from sustainable markets. We believe that great sushi is a balance of temperature, texture, and timing.',
    theExperience: 'The Experience',
    expText: 'Our dining room is designed as a sanctuary of minimalism. From the soft lighting to the natural wood textures, every element is chosen to enhance your sensory journey through Japanese flavors.',
    quote: 'Quality is not an act, it is a habit.',
    guestExp: 'Guest Experiences',
    visitUs: 'Visit Us',
    address: 'Address',
    reservations: 'Reservations',
    hours: 'Opening Hours',
    getDirections: 'Get Directions',
    callNow: 'Call Now',
    openNow: 'Open Now',
    footerDesc: 'Authentic Japanese sushi experience in the heart of Sala Al Jadida. Freshness, tradition, and elegance in every bite.',
    quickLinks: 'Quick Links',
    newsletter: 'Newsletter',
    newsDesc: 'Subscribe for exclusive offers and seasonal menu updates.',
    yourEmail: 'Your email',
    rights: 'All rights reserved.',
    yourOrder: 'Your Order',
    cartEmpty: 'Your cart is empty',
    startOrdering: 'Start Ordering',
    subtotal: 'Subtotal',
    checkout: 'Checkout Now',
    adminLogin: 'Admin Login',
    username: 'Username',
    password: 'Password',
    login: 'Login',
    adminPanel: 'Admin Panel',
    addFood: 'Add New Food',
    foodName: 'Food Name',
    price: 'Price (MAD)',
    category: 'Category',
    description: 'Description',
    uploadPhoto: 'Upload Photo',
    uploadLogo: 'Upload Logo',
    save: 'Save',
    cancel: 'Cancel',
    logout: 'Logout'
  },
  fr: {
    home: 'Accueil',
    menu: 'Menu',
    about: 'À propos',
    reviews: 'Avis',
    contact: 'Contact',
    viewMenu: 'Voir le Menu',
    orderNow: 'Commander',
    subtitle: 'Expérience Authentique de Sushi Japonais',
    rating: 'Note 4.5',
    basedOn: 'Basé sur 57 avis authentiques',
    priceRange: 'Prix moyen par personne',
    fullService: 'Service Complet',
    serviceDetails: 'Sur place, à emporter et livraison',
    recommendations: 'Recommandations du Chef',
    addToCart: 'Ajouter au Panier',
    ourMenu: 'Notre Menu',
    menuDesc: 'Chaque plat est préparé avec les ingrédients les plus frais, suivant des techniques japonaises traditionnelles transmises de génération en génération.',
    artOfSushi: "L'Art du Sushi",
    aboutText1: 'Fondé au cœur de Sala Al Jadida, Okasan Sushi est né d\'une passion pour les traditions culinaires japonaises authentiques. "Okasan" signifie mère en japonais, reflétant notre engagement envers le soin, la chaleur et le dévouement que nous mettons dans chaque plat.',
    aboutText2: 'Notre maître sushi apporte plus de 20 ans d\'expérience, s\'approvisionnant uniquement en poissons de saison les plus fins provenant de marchés durables. Nous croyons que le grand sushi est un équilibre de température, de texture et de timing.',
    theExperience: "L'Expérience",
    expText: 'Notre salle à manger est conçue comme un sanctuaire de minimalisme. De l\'éclairage doux aux textures de bois naturel, chaque élément est choisi pour améliorer votre voyage sensoriel à travers les saveurs japonaises.',
    quote: 'La qualité n\'est pas un acte, c\'est une habitude.',
    guestExp: 'Expériences des Clients',
    visitUs: 'Visitez-nous',
    address: 'Adresse',
    reservations: 'Réservations',
    hours: 'Horaires d\'ouverture',
    getDirections: 'Itinéraire',
    callNow: 'Appeler',
    openNow: 'Ouvert maintenant',
    footerDesc: 'Expérience authentique de sushi japonais au cœur de Sala Al Jadida. Fraîcheur, tradition et élégance dans chaque bouchée.',
    quickLinks: 'Liens Rapides',
    newsletter: 'Newsletter',
    newsDesc: 'Inscrivez-vous pour des offres exclusives et des mises à jour du menu saisonnier.',
    yourEmail: 'Votre email',
    rights: 'Tous droits réservés.',
    yourOrder: 'Votre Commande',
    cartEmpty: 'Votre panier est vide',
    startOrdering: 'Commencer la commande',
    subtotal: 'Sous-total',
    checkout: 'Commander maintenant',
    adminLogin: 'Connexion Admin',
    username: 'Nom d\'utilisateur',
    password: 'Mot de passe',
    login: 'Se connecter',
    adminPanel: 'Panneau Admin',
    addFood: 'Ajouter un plat',
    foodName: 'Nom du plat',
    price: 'Prix (MAD)',
    category: 'Catégorie',
    description: 'Description',
    uploadPhoto: 'Télécharger une photo',
    uploadLogo: 'Télécharger le logo',
    save: 'Enregistrer',
    cancel: 'Annuler',
    logout: 'Déconnexion'
  },
  ar: {
    home: 'الرئيسية',
    menu: 'المنيو',
    about: 'من نحن',
    reviews: 'التقييمات',
    contact: 'اتصل بنا',
    viewMenu: 'عرض المنيو',
    orderNow: 'اطلب الآن',
    subtitle: 'تجربة سوشي يابانية أصيلة',
    rating: 'تقييم 4.5',
    basedOn: 'بناءً على 57 تقييمًا حقيقيًا',
    priceRange: 'متوسط السعر للشخص الواحد',
    fullService: 'خدمة كاملة',
    serviceDetails: 'تناول الطعام، سفري وتوصيل',
    recommendations: 'توصيات الشيف',
    addToCart: 'أضف إلى السلة',
    ourMenu: 'قائمتنا',
    menuDesc: 'يتم تحضير كل طبق بأجود المكونات الطازجة، باتباع التقنيات اليابانية التقليدية المتوارثة عبر الأجيال.',
    artOfSushi: 'فن السوشي',
    aboutText1: 'تأسس أوكاسان سوشي في قلب سلا الجديدة، ونبع من شغف بالتقاليد الطهوية اليابانية الأصيلة. "أوكاسان" تعني الأم باليابانية، مما يعكس التزامنا بالرعاية والدفء والتفاني الذي نضعه في كل طبق.',
    aboutText2: 'يتمتع شيف السوشي لدينا بخبرة تزيد عن 20 عامًا، حيث يحصل فقط على أجود الأسماك الموسمية من الأسواق المستدامة. نحن نؤمن بأن السوشي الرائع هو توازن بين درجة الحرارة والملمس والتوقيت.',
    theExperience: 'التجربة',
    expText: 'تم تصميم غرفة الطعام لدينا لتكون ملاذًا للبساطة. من الإضاءة الخافتة إلى أنسجة الخشب الطبيعي، تم اختيار كل عنصر لتعزيز رحلتك الحسية عبر النكهات اليابانية.',
    quote: 'الجودة ليست فعلًا، بل هي عادة.',
    guestExp: 'تجارب الضيوف',
    visitUs: 'تفضل بزيارتنا',
    address: 'العنوان',
    reservations: 'الحجوزات',
    hours: 'ساعات العمل',
    getDirections: 'احصل على الاتجاهات',
    callNow: 'اتصل الآن',
    openNow: 'مفتوح الآن',
    footerDesc: 'تجربة سوشي يابانية أصيلة في قلب سلا الجديدة. نضارة، تقاليد وأناقة في كل لقمة.',
    quickLinks: 'روابط سريعة',
    newsletter: 'النشرة الإخبارية',
    newsDesc: 'اشترك للحصول على عروض حصرية وتحديثات المنيو الموسمي.',
    yourEmail: 'بريدك الإلكتروني',
    rights: 'جميع الحقوق محفوظة.',
    yourOrder: 'طلبك',
    cartEmpty: 'سلتك فارغة',
    startOrdering: 'ابدأ الطلب',
    subtotal: 'المجموع الفرعي',
    checkout: 'الدفع الآن',
    adminLogin: 'دخول المسؤول',
    username: 'اسم المستخدم',
    password: 'كلمة المرور',
    login: 'تسجيل الدخول',
    adminPanel: 'لوحة التحكم',
    addFood: 'إضافة طعام جديد',
    foodName: 'اسم الطعام',
    price: 'السعر (درهم)',
    category: 'الفئة',
    description: 'الوصف',
    uploadPhoto: 'رفع صورة',
    uploadLogo: 'رفع الشعار',
    save: 'حفظ',
    cancel: 'إلغاء',
    logout: 'تسجيل الخروج'
  }
};

// --- Initial Data ---
const INITIAL_MENU_ITEMS: MenuItem[] = [
  {
    id: 'r1',
    name: 'Dragon Roll',
    price: 120,
    description: 'Shrimp tempura, cucumber, topped with avocado and unagi sauce.',
    category: 'Sushi Rolls',
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'r2',
    name: 'Spicy Tuna Roll',
    price: 95,
    description: 'Fresh tuna, spicy mayo, and cucumber with sesame seeds.',
    category: 'Sushi Rolls',
    image: 'https://images.unsplash.com/photo-1559466273-d95e72debaf8?auto=format&fit=crop&w=800&q=80'
  }
];

const REVIEWS: Review[] = [
  {
    id: 1,
    name: "Amine Benjelloun",
    rating: 5,
    comment: "The best sushi in Sala Al Jadida. The fish is incredibly fresh and the service is top-notch.",
    date: "2 weeks ago"
  },
  {
    id: 2,
    name: "Sarah Mansouri",
    rating: 4,
    comment: "Excellent quality. The Dragon Roll is a must-try. Slightly long wait for delivery but worth it.",
    date: "1 month ago"
  }
];

// --- Cloudinary Helper ---
const uploadToCloudinary = async (file: File): Promise<string> => {
  const cloudName = (import.meta as any).env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = (import.meta as any).env.VITE_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset || cloudName === 'your_cloud_name') {
    console.error('Cloudinary configuration missing. Please check .env');
    // For demo purposes, return a local URL if config is missing
    return URL.createObjectURL(file);
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);

  try {
    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: formData
    });
    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error('Upload failed:', error);
    return URL.createObjectURL(file);
  }
};

// --- Components ---

const Navbar = ({ activePage, setActivePage, cartCount, toggleCart, lang, setLang, logo, t, isAdmin, onLogoClick }: { 
  activePage: string, 
  setActivePage: (page: string) => void,
  cartCount: number,
  toggleCart: () => void,
  lang: Language,
  setLang: (l: Language) => void,
  logo: string,
  t: any,
  isAdmin: boolean,
  onLogoClick: () => void
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: t.home, id: 'home' },
    { name: t.menu, id: 'menu' },
    { name: t.about, id: 'about' },
    { name: t.reviews, id: 'reviews' },
    { name: t.contact, id: 'contact' },
  ];

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${isScrolled ? 'bg-brand-dark/95 backdrop-blur-xl py-3 shadow-2xl' : 'bg-transparent py-8'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <motion.div 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`flex items-center gap-4 ${isAdmin ? 'cursor-pointer ring-2 ring-brand-red ring-offset-2 ring-offset-brand-dark' : 'cursor-pointer'}`}
          onClick={() => isAdmin ? onLogoClick() : setActivePage('home')}
          title={isAdmin ? 'Click to change logo' : ''}
        >
          <div className="w-12 h-12 rounded-full border border-white/20 overflow-hidden bg-brand-gray flex items-center justify-center relative group">
            {logo ? (
              <img src={logo} alt="Logo" className="w-full h-full object-cover" />
            ) : (
              <ImageIcon size={20} className="text-brand-beige/20" />
            )}
            {isAdmin && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Upload size={16} className="text-white" />
              </div>
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-xl md:text-2xl font-serif font-bold text-brand-red tracking-widest leading-none">OKASAN</span>
            <span className="text-[10px] font-light tracking-[0.4em] text-brand-beige/60">SUSHI</span>
          </div>
        </motion.div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => setActivePage(link.id)}
              className={`text-xs uppercase tracking-widest transition-all relative group py-2 ${activePage === link.id ? 'text-brand-red' : 'text-brand-beige'}`}
            >
              {link.name}
              <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-brand-red transition-transform duration-300 origin-left ${activePage === link.id ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`} />
            </button>
          ))}
          
          <div className="flex items-center gap-2 border-l border-white/10 pl-6 ml-2">
            {(['en', 'fr', 'ar'] as Language[]).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`text-[10px] uppercase tracking-widest w-6 h-6 flex items-center justify-center rounded-full border ${lang === l ? 'bg-brand-red border-brand-red text-white' : 'border-white/10 text-brand-beige/60 hover:border-brand-red'}`}
              >
                {l}
              </button>
            ))}
          </div>

          <button 
            onClick={toggleCart}
            className="relative p-2 hover:text-brand-red transition-colors"
          >
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-brand-red text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>

        {/* Mobile Toggle */}
        <div className="flex md:hidden items-center gap-4">
          <button onClick={toggleCart} className="relative p-2">
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-brand-red text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={24} /> : <MenuIcon size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full bg-brand-dark border-t border-white/10 py-6 px-6 flex flex-col gap-4 md:hidden"
          >
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => {
                  setActivePage(link.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`text-left text-lg uppercase tracking-widest ${activePage === link.id ? 'text-brand-red' : 'text-brand-beige'}`}
              >
                {link.name}
              </button>
            ))}
            <div className="flex gap-4 pt-4 border-t border-white/10">
              {(['en', 'fr', 'ar'] as Language[]).map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`text-xs uppercase tracking-widest px-3 py-1 rounded border ${lang === l ? 'bg-brand-red border-brand-red text-white' : 'border-white/10 text-brand-beige/60'}`}
                >
                  {l === 'en' ? 'English' : l === 'fr' ? 'Français' : 'العربية'}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const AdminModal = ({ isOpen, onClose, onLogin, onGoogleLogin }: { isOpen: boolean, onClose: () => void, onLogin: (u: string, p: string) => void, onGoogleLogin: () => void }) => {
  const [u, setU] = useState('');
  const [p, setP] = useState('');
  const t = translations.en; // Admin always in EN for simplicity or current lang

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-brand-gray p-8 w-full max-w-md border border-white/10"
      >
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-2xl font-serif flex items-center gap-3"><Lock size={20} className="text-brand-red" /> {t.adminLogin}</h3>
          <button onClick={onClose}><X size={24} /></button>
        </div>
        <div className="space-y-6">
          <div>
            <label className="block text-xs uppercase tracking-widest text-brand-beige/40 mb-2">{t.username}</label>
            <input 
              type="text" 
              value={u}
              onChange={(e) => setU(e.target.value)}
              className="w-full bg-brand-dark border border-white/10 px-4 py-3 focus:outline-none focus:border-brand-red"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-brand-beige/40 mb-2">{t.password}</label>
            <input 
              type="password" 
              value={p}
              onChange={(e) => setP(e.target.value)}
              className="w-full bg-brand-dark border border-white/10 px-4 py-3 focus:outline-none focus:border-brand-red"
            />
          </div>
          <button 
            onClick={() => onLogin(u, p)}
            className="w-full bg-brand-red text-white py-4 uppercase tracking-widest text-sm hover:bg-red-700 transition-colors"
          >
            {t.login}
          </button>

          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
            <div className="relative flex justify-center text-xs uppercase tracking-widest"><span className="bg-brand-gray px-2 text-brand-beige/30">Or</span></div>
          </div>

          <button 
            onClick={onGoogleLogin}
            className="w-full bg-white text-brand-dark py-4 uppercase tracking-widest text-sm hover:bg-brand-beige transition-colors flex items-center justify-center gap-3 font-bold"
          >
            <Globe size={18} /> Login with Google
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const ImageUploadField = ({ 
  label, 
  value, 
  onUpload, 
  t 
}: { 
  label: string, 
  value: string, 
  onUpload: (url: string) => Promise<void>,
  t: any
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const url = await uploadToCloudinary(file);
      await onUpload(url);
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs uppercase tracking-widest text-brand-beige/40">{label}</label>
      <div 
        onClick={() => inputRef.current?.click()}
        className="relative h-32 w-full bg-brand-gray border border-white/10 flex items-center justify-center cursor-pointer group overflow-hidden"
      >
        <input type="file" ref={inputRef} onChange={handleChange} className="hidden" accept="image/*" />
        {value ? (
          <>
            <img src={value} alt={label} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Upload size={20} className="text-white" />
            </div>
          </>
        ) : (
          <div className="text-center">
            <ImageIcon size={24} className="mx-auto mb-2 text-brand-beige/20" />
            <span className="text-[10px] uppercase tracking-widest text-brand-beige/40">{isUploading ? 'Uploading...' : 'Click to Upload'}</span>
          </div>
        )}
        {isUploading && (
          <div className="absolute inset-0 bg-brand-dark/60 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-brand-red border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>
    </div>
  );
};

const AdminDashboard = ({ 
  onClose, 
  onAddMenuItem,
  onDeleteMenuItem,
  onUpdateSetting,
  menuItems,
  settings,
  t 
}: { 
  onClose: () => void, 
  onAddMenuItem: (item: Omit<MenuItem, 'id'>) => Promise<void>,
  onDeleteMenuItem: (id: string) => Promise<void>,
  onUpdateSetting: (key: string, value: string) => Promise<void>,
  menuItems: MenuItem[],
  settings: { logo: string, aboutImage: string, statsBg: string, aboutBg: string, footerBg: string, quoteImage: string, contactBg: string },
  t: any
}) => {
  const [activeTab, setActiveTab] = useState<'menu' | 'appearance'>('menu');
  const [newItem, setNewItem] = useState({ name: '', price: 0, description: '', category: 'Sushi Rolls' as any, image: '' });
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Instant preview
    const previewUrl = URL.createObjectURL(file);
    setNewItem(prev => ({ ...prev, image: previewUrl }));
    setIsUploading(true);

    // Background upload
    try {
      const imageUrl = await uploadToCloudinary(file);
      setNewItem(prev => ({ ...prev, image: imageUrl }));
    } catch (err) {
      console.error("Upload failed", err);
      alert("Image upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddFood = async () => {
    if (!newItem.image) return alert('Please select a photo');
    if (isUploading) return alert('Please wait for the image to finish uploading');
    
    await onAddMenuItem(newItem);
    setNewItem({ name: '', price: 0, description: '', category: 'Sushi Rolls', image: '' });
  };

  return (
    <div className="fixed inset-0 z-[100] bg-brand-dark/95 backdrop-blur-lg overflow-y-auto p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-12 border-b border-white/10 pb-6">
          <div className="flex gap-8">
            <button 
              onClick={() => setActiveTab('menu')}
              className={`text-2xl md:text-4xl font-serif transition-colors ${activeTab === 'menu' ? 'text-white' : 'text-white/20 hover:text-white/40'}`}
            >
              Menu Manager
            </button>
            <button 
              onClick={() => setActiveTab('appearance')}
              className={`text-2xl md:text-4xl font-serif transition-colors ${activeTab === 'appearance' ? 'text-white' : 'text-white/20 hover:text-white/40'}`}
            >
              Site Appearance
            </button>
          </div>
          <button onClick={onClose} className="p-2 border border-white/10 hover:bg-white/5"><X size={24} /></button>
        </div>

        {activeTab === 'menu' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <h3 className="text-xl font-serif border-b border-white/5 pb-4">{t.addFood}</h3>
              <div className="space-y-4">
                <input 
                  placeholder={t.foodName}
                  value={newItem.name}
                  onChange={e => setNewItem({...newItem, name: e.target.value})}
                  className="w-full bg-brand-gray border border-white/10 px-4 py-3 focus:outline-none focus:border-brand-red"
                />
                <input 
                  type="number"
                  placeholder={t.price}
                  value={newItem.price || ''}
                  onChange={e => setNewItem({...newItem, price: Number(e.target.value)})}
                  className="w-full bg-brand-gray border border-white/10 px-4 py-3 focus:outline-none focus:border-brand-red"
                />
                <select 
                  value={newItem.category}
                  onChange={e => setNewItem({...newItem, category: e.target.value as any})}
                  className="w-full bg-brand-gray border border-white/10 px-4 py-3 focus:outline-none focus:border-brand-red"
                >
                  <option>Sushi Rolls</option>
                  <option>Sashimi</option>
                  <option>Platters</option>
                  <option>Drinks</option>
                </select>
                <textarea 
                  placeholder={t.description}
                  value={newItem.description}
                  onChange={e => setNewItem({...newItem, description: e.target.value})}
                  className="w-full bg-brand-gray border border-white/10 px-4 py-3 h-32 focus:outline-none focus:border-brand-red"
                />
                <div className="border-2 border-dashed border-white/10 p-8 text-center hover:border-brand-red transition-colors cursor-pointer relative overflow-hidden group">
                  <input 
                    type="file" 
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                  />
                  {newItem.image ? (
                    <div className="relative h-40 w-full">
                      <img src={newItem.image} alt="Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Upload className="text-white" />
                      </div>
                    </div>
                  ) : (
                    <>
                      <Upload className="mx-auto mb-2 text-brand-beige/20" />
                      <p className="text-xs text-brand-beige/40 uppercase tracking-widest">{t.uploadPhoto}</p>
                    </>
                  )}
                </div>
                <button 
                  onClick={handleAddFood}
                  disabled={isUploading}
                  className="w-full bg-brand-red hover:bg-red-700 text-white py-4 uppercase tracking-widest text-sm font-bold transition-all disabled:opacity-50"
                >
                  {isUploading ? 'Uploading Image...' : t.addFood}
                </button>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-serif border-b border-white/5 pb-4 mb-6">Current Menu Items</h3>
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                {menuItems.map(item => (
                  <div key={item.id} className="flex items-center justify-between bg-brand-gray p-4 border border-white/5">
                    <div className="flex items-center gap-4">
                      <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded" />
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-xs text-brand-beige/40">{item.category} • {item.price} MAD</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => onDeleteMenuItem(item.id)}
                      className="p-2 text-brand-beige/30 hover:text-brand-red transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <ImageUploadField 
              label="Website Logo" 
              value={settings.logo} 
              onUpload={(url) => onUpdateSetting('logo', url)} 
              t={t} 
            />
            <ImageUploadField 
              label="About Section Image" 
              value={settings.aboutImage} 
              onUpload={(url) => onUpdateSetting('aboutImage', url)} 
              t={t} 
            />
            <ImageUploadField 
              label="Stats Section Background" 
              value={settings.statsBg} 
              onUpload={(url) => onUpdateSetting('statsBg', url)} 
              t={t} 
            />
            <ImageUploadField 
              label="About Section Background" 
              value={settings.aboutBg} 
              onUpload={(url) => onUpdateSetting('aboutBg', url)} 
              t={t} 
            />
            <ImageUploadField 
              label="Footer Background" 
              value={settings.footerBg} 
              onUpload={(url) => onUpdateSetting('footerBg', url)} 
              t={t} 
            />
            <ImageUploadField 
              label="Quote Section Image" 
              value={settings.quoteImage} 
              onUpload={(url) => onUpdateSetting('quoteImage', url)} 
              t={t} 
            />
            <ImageUploadField 
              label="Contact Section Background" 
              value={settings.contactBg} 
              onUpload={(url) => onUpdateSetting('contactBg', url)} 
              t={t} 
            />
          </div>
        )}
      </div>
    </div>
  );
};

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-8 right-8 z-40 w-12 h-12 bg-brand-red text-white flex items-center justify-center rounded-full shadow-2xl hover:bg-red-700 transition-colors"
        >
          <Plus className="rotate-45" size={24} />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

// --- Main App ---

export default function App() {
  const [lang, setLang] = useState<Language>('en');
  const [activePage, setActivePage] = useState('home');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showMenuManager, setShowMenuManager] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(INITIAL_MENU_ITEMS);
  const [logo, setLogo] = useState<string>('');
  const [aboutImage, setAboutImage] = useState<string>('');
  const [statsBg, setStatsBg] = useState<string>('');
  const [aboutBg, setAboutBg] = useState<string>('');
  const [footerBg, setFooterBg] = useState<string>('');
  const [quoteImage, setQuoteImage] = useState<string>('');
  const [contactBg, setContactBg] = useState<string>('');
  
  const t = translations[lang];
  const isRTL = lang === 'ar';

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user && user.email === 'dragonballsam86@gmail.com') {
        setIsAdminLoggedIn(true);
      } else if (!user && !isAdminLoggedIn) {
        // Keep legacy sam login if no firebase user but already logged in via sam
      } else if (!user) {
        setIsAdminLoggedIn(false);
      }
    });

    // Listen for logo and other settings changes
    const unsubscribeLogo = onSnapshot(doc(db, 'settings', 'global'), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setLogo(data.logo || '');
        setAboutImage(data.aboutImage || '');
        setStatsBg(data.statsBg || '');
        setAboutBg(data.aboutBg || '');
        setFooterBg(data.footerBg || '');
        setQuoteImage(data.quoteImage || '');
        setContactBg(data.contactBg || '');
      }
    });

    // Listen for menu changes
    const q = query(collection(db, 'menu'), orderBy('createdAt', 'desc'));
    const unsubscribeMenu = onSnapshot(q, (querySnapshot) => {
      const items: MenuItem[] = [];
      querySnapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() } as MenuItem);
      });
      if (items.length > 0) {
        setMenuItems(items);
      }
    });

    return () => {
      unsubscribeAuth();
      unsubscribeLogo();
      unsubscribeMenu();
    };
  }, [isAdminLoggedIn]);

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const handleAdminLogin = (u: string, p: string) => {
    if (u === 'sam' && p === 'sam2006') {
      setIsAdminLoggedIn(true);
      setIsAdminModalOpen(false);
    } else {
      alert('Invalid credentials');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      setIsAdminModalOpen(false);
    } catch (error) {
      console.error("Login failed", error);
      alert("Login failed. Check console for details.");
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setIsAdminLoggedIn(false);
    setShowMenuManager(false);
  };

  const addMenuItem = async (item: Omit<MenuItem, 'id'>) => {
    try {
      // Ensure we don't have a blob URL in the database
      if (item.image.startsWith('blob:')) {
        alert("Please wait for the image to finish uploading.");
        return;
      }
      await addDoc(collection(db, 'menu'), {
        ...item,
        createdAt: serverTimestamp()
      });
    } catch (error) {
      console.error("Error adding menu item:", error);
      alert("Failed to add menu item. Check console for details.");
    }
  };

  const deleteMenuItem = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'menu', id));
    } catch (error) {
      console.error("Error deleting menu item:", error);
      alert("Failed to delete menu item.");
    }
  };

  const updateLogo = async (url: string) => {
    try {
      setLogo(url);
      await setDoc(doc(db, 'settings', 'global'), { logo: url }, { merge: true });
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error("Error updating logo:", error);
      alert("Failed to update logo. Check console for details.");
    }
  };

  const updateSetting = async (key: string, value: string) => {
    try {
      await setDoc(doc(db, 'settings', 'global'), { [key]: value }, { merge: true });
    } catch (error) {
      console.error(`Error updating ${key}:`, error);
      alert(`Failed to update ${key}.`);
    }
  };

  const saveAllChanges = () => {
    // With direct Firestore writes in addMenuItem and updateLogo, 
    // this button is mostly redundant now but we can keep it for UI feedback
    setHasUnsavedChanges(false);
    alert('All changes saved to database!');
  };

  const renderPage = () => {
    switch (activePage) {
      case 'home':
        return (
          <>
            <section className="relative h-screen flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 z-0">
                <img 
                  src="https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?auto=format&fit=crop&w=1920&q=80" 
                  alt="Sushi background"
                  className="w-full h-full object-cover opacity-60"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-brand-dark/20 via-brand-dark/40 to-brand-dark"></div>
              </div>
              <div className="relative z-10 text-center px-6">
                <motion.div 
                  initial={{ opacity: 0, y: 40 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1] }}
                >
                  <h1 className="text-6xl md:text-9xl font-serif mb-6 tracking-tighter leading-none">
                    <span className="text-reveal">
                      <motion.span
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        transition={{ duration: 1, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
                      >
                        Okasan Sushi
                      </motion.span>
                    </span>
                  </h1>
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.8 }}
                    transition={{ duration: 1, delay: 0.8 }}
                    className="text-xl md:text-2xl font-light tracking-[0.3em] mb-12 text-brand-beige italic"
                  >
                    {t.subtitle}
                  </motion.p>
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 1.2 }}
                    className="flex flex-col sm:flex-row gap-6 justify-center"
                  >
                    <button 
                      onClick={() => setActivePage('menu')} 
                      className="bg-brand-red hover:bg-red-700 text-white px-12 py-5 tracking-widest uppercase text-xs transition-all hover:scale-105 active:scale-95 shadow-xl"
                    >
                      {t.viewMenu}
                    </button>
                    <button 
                      onClick={() => setActivePage('menu')} 
                      className="border border-brand-beige hover:bg-brand-beige hover:text-brand-dark text-brand-beige px-12 py-5 tracking-widest uppercase text-xs transition-all hover:scale-105 active:scale-95"
                    >
                      {t.orderNow}
                    </button>
                  </motion.div>
                </motion.div>
              </div>
            </section>
            
            <section 
              className="py-20 bg-brand-gray japanese-texture relative overflow-hidden"
              style={statsBg ? { backgroundImage: `url(${statsBg})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
            >
              {statsBg && <div className="absolute inset-0 bg-brand-dark/60 backdrop-blur-[2px]" />}
              <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
                <div className="flex flex-col items-center text-center">
                  <div className="flex text-brand-red mb-2">
                    {[...Array(5)].map((_, i) => <Star key={i} size={20} fill={i < 4 ? "currentColor" : "none"} />)}
                  </div>
                  <h3 className="text-xl font-serif mb-1">{t.rating}</h3>
                  <p className="text-brand-beige/60 text-sm">{t.basedOn}</p>
                </div>
                <div className="flex flex-col items-center text-center">
                  <h3 className="text-xl font-serif mb-1">MAD 100–150</h3>
                  <p className="text-brand-beige/60 text-sm">{t.priceRange}</p>
                </div>
                <div className="flex flex-col items-center text-center">
                  <h3 className="text-xl font-serif mb-1">{t.fullService}</h3>
                  <p className="text-brand-beige/60 text-sm">{t.serviceDetails}</p>
                </div>
              </div>
            </section>

            <section className="py-24 bg-brand-dark">
              <div className="max-w-7xl mx-auto px-6">
                <h2 className="text-4xl md:text-5xl font-serif mb-16">{t.recommendations}</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                  {menuItems.slice(0, 3).map((item, idx) => (
                    <motion.div key={item.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} viewport={{ once: true }} className="group">
                      <div className="overflow-hidden aspect-[4/5] mb-6 relative">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-brand-dark/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button onClick={() => addToCart(item)} className="bg-brand-red text-white px-6 py-3 tracking-widest uppercase text-xs">{t.addToCart}</button>
                        </div>
                      </div>
                      <h3 className="text-2xl font-serif mb-2">{item.name}</h3>
                      <p className="text-brand-beige/60 text-sm mb-4 line-clamp-2">{item.description}</p>
                      <span className="text-brand-red font-medium">{item.price} MAD</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>
          </>
        );
      case 'menu':
        return (
          <section className="py-32 bg-brand-dark min-h-screen">
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center mb-20">
                <motion.h2 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-5xl md:text-7xl font-serif mb-6"
                >
                  {t.ourMenu}
                </motion.h2>
                <motion.p 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="text-brand-beige/60 max-w-2xl mx-auto italic"
                >
                  {t.menuDesc}
                </motion.p>
              </div>
              <motion.div 
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                variants={{
                  hidden: { opacity: 0 },
                  show: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.1
                    }
                  }
                }}
                className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12"
              >
                {menuItems.map((item) => (
                  <motion.div 
                    key={item.id} 
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      show: { opacity: 1, y: 0 }
                    }}
                    className="flex justify-between items-start group"
                  >
                    <div className="w-24 h-24 flex-shrink-0 mr-6 overflow-hidden relative">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-brand-red/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="flex-1 pr-4">
                      <div className="flex items-baseline justify-between mb-2">
                        <h4 className="text-xl font-serif group-hover:text-brand-red transition-colors duration-300">{item.name}</h4>
                        <div className="flex-1 border-b border-dotted border-white/10 mx-4"></div>
                        <span className="text-brand-red font-medium">{item.price} MAD</span>
                      </div>
                      <p className="text-brand-beige/50 text-sm italic line-clamp-2 leading-relaxed">{item.description}</p>
                    </div>
                    <button 
                      onClick={() => addToCart(item)} 
                      className="p-3 border border-white/10 hover:bg-brand-red hover:border-brand-red transition-all hover:scale-110 active:scale-90"
                    >
                      <Plus size={16} />
                    </button>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </section>
        );
      case 'about':
        return (
          <section 
            className="py-32 bg-brand-gray japanese-texture relative overflow-hidden"
            style={aboutBg ? { backgroundImage: `url(${aboutBg})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
          >
            {aboutBg && <div className="absolute inset-0 bg-brand-dark/70 backdrop-blur-sm" />}
            <div className="max-w-7xl mx-auto px-6 relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                <div>
                  <h2 className="text-5xl md:text-6xl font-serif mb-8">{t.artOfSushi}</h2>
                  <div className="space-y-6 text-brand-beige/80 leading-relaxed">
                    <p>{t.aboutText1}</p>
                    <p>{t.aboutText2}</p>
                    <div className="pt-6">
                      <h3 className="text-2xl font-serif mb-4 text-brand-red">{t.theExperience}</h3>
                      <p>{t.expText}</p>
                    </div>
                  </div>
                </div>
                <div className="relative">
                  <img 
                    src={quoteImage || aboutImage || "https://images.unsplash.com/photo-1579027989536-b7b1f875659b?auto=format&fit=crop&w=1000&q=80"} 
                    alt="Chef" 
                    className="w-full aspect-square object-cover transition-all duration-700 shadow-2xl" 
                  />
                  <div className="absolute -bottom-6 -left-6 bg-brand-red p-8 hidden md:block shadow-xl">
                    <p className="text-4xl font-serif text-white italic">"{t.quote}"</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        );
      case 'reviews':
        return (
          <section className="py-32 bg-brand-dark">
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center mb-20">
                <div className="flex justify-center text-brand-red mb-4">
                  {[...Array(5)].map((_, i) => <Star key={i} size={32} fill={i < 4 ? "currentColor" : "none"} />)}
                </div>
                <h2 className="text-5xl font-serif mb-2">4.5 / 5</h2>
                <p className="text-brand-beige/60 uppercase tracking-widest text-sm">{t.guestExp}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {REVIEWS.map((review) => (
                  <div key={review.id} className="bg-brand-gray p-10 border border-white/5">
                    <div className="flex text-brand-red mb-6">
                      {[...Array(5)].map((_, i) => <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} />)}
                    </div>
                    <p className="text-brand-beige/80 italic mb-8">"{review.comment}"</p>
                    <div className="flex justify-between items-center border-t border-white/10 pt-6">
                      <span className="font-serif text-lg">{review.name}</span>
                      <span className="text-xs text-brand-beige/40">{review.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );
      case 'contact':
        return (
          <section 
            className="py-32 bg-brand-dark japanese-texture relative overflow-hidden"
            style={contactBg ? { backgroundImage: `url(${contactBg})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
          >
            {contactBg && <div className="absolute inset-0 bg-brand-dark/80 backdrop-blur-[2px]" />}
            <div className="max-w-7xl mx-auto px-6 relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
                <div className={isRTL ? 'text-right' : 'text-left'}>
                  <h2 className="text-5xl font-serif mb-12">{t.visitUs}</h2>
                  <div className="space-y-10">
                    <div className="flex gap-6">
                      <div className="w-12 h-12 bg-brand-red flex items-center justify-center flex-shrink-0"><MapPin size={24} className="text-white" /></div>
                      <div>
                        <h4 className="text-xl font-serif mb-2">{t.address}</h4>
                        <p className="text-brand-beige/60">3, Res, mag 3 Pass. Salima,<br />Sala Al Jadida 11100, Morocco</p>
                        <button className="text-brand-red text-sm uppercase tracking-widest mt-4 flex items-center gap-2">{t.getDirections} <ChevronRight size={16} /></button>
                      </div>
                    </div>
                    <div className="flex gap-6">
                      <div className="w-12 h-12 bg-brand-red flex items-center justify-center flex-shrink-0"><Phone size={24} className="text-white" /></div>
                      <div>
                        <h4 className="text-xl font-serif mb-2">{t.reservations}</h4>
                        <p className="text-brand-beige/60">05 37 53 63 81</p>
                        <button className="text-brand-red text-sm uppercase tracking-widest mt-4 flex items-center gap-2">{t.callNow} <ChevronRight size={16} /></button>
                      </div>
                    </div>
                    <div className="flex gap-6">
                      <div className="w-12 h-12 bg-brand-red flex items-center justify-center flex-shrink-0"><Clock size={24} className="text-white" /></div>
                      <div>
                        <h4 className="text-xl font-serif mb-2">{t.hours}</h4>
                        <p className="text-brand-beige/60">Monday – Sunday<br />12:00 PM – 01:00 AM</p>
                        <p className="text-brand-red text-xs mt-2 uppercase tracking-widest">{t.openNow}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="h-[500px] glass-morphism p-2">
                  <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3308.218567117185!2d-6.7538888!3d33.9861111!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xda7694f4f4f4f4f%3A0x4f4f4f4f4f4f4f4f!2sSala%20Al%20Jadida!5e0!3m2!1sen!2sma!4v1620000000000!5m2!1sen!2sma" className="w-full h-full border-0" allowFullScreen={true} loading="lazy"></iframe>
                </div>
              </div>
            </div>
          </section>
        );
      default:
        return null;
    }
  };

  const logoInputRef = useRef<HTMLInputElement>(null);

  const handleLogoUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Instant preview
    const previewUrl = URL.createObjectURL(file);
    setLogo(previewUrl);
    
    // Background upload
    const logoUrl = await uploadToCloudinary(file);
    updateLogo(logoUrl);
  };

  return (
    <div className={`min-h-screen flex flex-col bg-brand-dark text-brand-beige selection:bg-brand-red selection:text-white ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="grain" />
      <input 
        type="file" 
        ref={logoInputRef} 
        className="hidden" 
        accept="image/*"
        onChange={handleLogoUpload}
      />
      <Navbar 
        activePage={activePage} 
        setActivePage={(p) => {
          setActivePage(p);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }} 
        cartCount={cart.reduce((s, i) => s + i.quantity, 0)}
        toggleCart={() => setIsCartOpen(true)}
        lang={lang}
        setLang={setLang}
        logo={logo}
        t={t}
        isAdmin={isAdminLoggedIn}
        onLogoClick={() => logoInputRef.current?.click()}
      />
      
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <motion.div 
            key={activePage + lang} 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -10 }} 
            transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </main>

      <ScrollToTop />

      <footer 
        className="bg-brand-gray pt-20 pb-10 border-t border-white/5 japanese-texture relative overflow-hidden"
        style={footerBg ? { backgroundImage: `url(${footerBg})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
      >
        {footerBg && <div className="absolute inset-0 bg-brand-dark/80 backdrop-blur-[2px]" />}
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
            <div>
              <div 
                className={`flex items-center gap-4 mb-6 cursor-pointer group`}
                onClick={() => isAdminLoggedIn ? logoInputRef.current?.click() : setIsAdminModalOpen(true)}
                title={isAdminLoggedIn ? 'Click to change logo' : 'Admin Login'}
              >
                <div className="w-10 h-10 rounded-full border border-white/20 overflow-hidden bg-brand-dark flex items-center justify-center relative">
                  {logo ? <img src={logo} alt="Logo" className="w-full h-full object-cover" /> : <ImageIcon size={16} className="text-brand-beige/20" />}
                  {isAdminLoggedIn && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Upload size={12} className="text-white" />
                    </div>
                  )}
                </div>
                <span className="text-2xl font-serif font-bold text-brand-red tracking-widest">OKASAN</span>
              </div>
              {isAdminLoggedIn && (
                <div className="flex flex-col gap-2 mb-8">
                  <button 
                    onClick={() => setShowMenuManager(true)}
                    className="text-xs uppercase tracking-widest text-brand-red border border-brand-red px-4 py-2 hover:bg-brand-red hover:text-white transition-all"
                  >
                    Manage Menu
                  </button>
                  <button 
                    onClick={handleLogout}
                    className="text-[10px] uppercase tracking-widest text-brand-beige/30 hover:text-brand-red transition-colors text-left"
                  >
                    Logout
                  </button>
                </div>
              )}
              <p className="text-brand-beige/50 text-sm leading-relaxed mb-8">{t.footerDesc}</p>
              <div className="flex gap-4">
                <a href="https://www.instagram.com/okasan.sushi_?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noreferrer" className="w-10 h-10 border border-white/10 flex items-center justify-center hover:bg-brand-red transition-all"><Instagram size={18} /></a>
                <a href="https://web.facebook.com/profile.php?id=61582878461534" target="_blank" rel="noreferrer" className="w-10 h-10 border border-white/10 flex items-center justify-center hover:bg-brand-red transition-all"><Facebook size={18} /></a>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-serif mb-6">{t.quickLinks}</h4>
              <ul className="space-y-4 text-sm text-brand-beige/50">
                {['home', 'menu', 'about', 'reviews', 'contact'].map(id => (
                  <li key={id}><button onClick={() => setActivePage(id)} className="hover:text-brand-red transition-colors capitalize">{t[id as keyof typeof t]}</button></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-serif mb-6">{t.contact}</h4>
              <ul className="space-y-4 text-sm text-brand-beige/50">
                <li className="flex items-start gap-3"><MapPin size={16} className="text-brand-red mt-1" /><span>3, Res, mag 3 Pass. Salima,<br />Sala Al Jadida 11100</span></li>
                <li className="flex items-center gap-3"><Phone size={16} className="text-brand-red" /><span>05 37 53 63 81</span></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-serif mb-6">{t.newsletter}</h4>
              <p className="text-brand-beige/50 text-sm mb-4">{t.newsDesc}</p>
              <div className="flex">
                <input type="email" placeholder={t.yourEmail} className="bg-brand-dark border border-white/10 px-4 py-2 text-sm w-full focus:outline-none focus:border-brand-red" />
                <button className="bg-brand-red px-4 py-2 text-white"><ChevronRight size={20} /></button>
              </div>
            </div>
          </div>
          <div className="border-t border-white/5 pt-10 text-center text-[10px] text-brand-beige/30 uppercase tracking-[0.3em]">
            © 2026 Okasan Sushi. {t.rights}
          </div>
        </div>
      </footer>

      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        cart={cart}
        updateQuantity={(id, d) => setCart(prev => prev.map(i => i.id === id ? { ...i, quantity: Math.max(1, i.quantity + d) } : i))}
        removeFromCart={id => setCart(prev => prev.filter(i => i.id !== id))}
      />

      <AdminModal 
        isOpen={isAdminModalOpen} 
        onClose={() => setIsAdminModalOpen(false)} 
        onLogin={handleAdminLogin} 
        onGoogleLogin={handleGoogleLogin}
      />

      {showMenuManager && (
        <AdminDashboard 
          onClose={() => setShowMenuManager(false)} 
          onAddMenuItem={addMenuItem}
          onDeleteMenuItem={deleteMenuItem}
          onUpdateSetting={updateSetting}
          menuItems={menuItems}
          settings={{ logo, aboutImage, statsBg, aboutBg, footerBg, quoteImage, contactBg }}
          t={t}
        />
      )}
      {isAdminLoggedIn && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] flex gap-4">
          <motion.button 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            onClick={handleLogout}
            className="bg-brand-dark border border-white/20 text-white px-8 py-3 rounded-full uppercase tracking-widest text-xs hover:bg-white/5 transition-all flex items-center gap-2 shadow-2xl"
          >
            <X size={14} /> Leave Admin Mode
          </motion.button>
        </div>
      )}
    </div>
  );
}

const CartDrawer = ({ isOpen, onClose, cart, updateQuantity, removeFromCart }: any) => {
  const total = cart.reduce((sum: any, item: any) => sum + (item.price * item.quantity), 0);
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            onClick={onClose} 
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[110]" 
          />
          <motion.div 
            initial={{ x: '100%' }} 
            animate={{ x: 0 }} 
            exit={{ x: '100%' }} 
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-brand-dark z-[120] flex flex-col shadow-[-20px_0_50px_rgba(0,0,0,0.5)]"
          >
            <div className="p-8 border-b border-white/10 flex justify-between items-center">
              <h3 className="text-3xl font-serif">Your Order</h3>
              <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors"><X size={24} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-8 space-y-8">
              {cart.length === 0 ? (
                <div className="text-center mt-20">
                  <ShoppingBag size={48} className="mx-auto mb-6 text-brand-beige/10" />
                  <p className="text-brand-beige/40 italic">Your cart is empty</p>
                </div>
              ) : cart.map((item: any) => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={item.id} 
                  className="flex gap-6 group"
                >
                  <div className="w-20 h-20 flex-shrink-0 overflow-hidden">
                    <img src={item.image} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <h4 className="font-serif text-lg">{item.name}</h4>
                      <button onClick={() => removeFromCart(item.id)} className="text-brand-beige/20 hover:text-brand-red transition-colors"><Trash2 size={16} /></button>
                    </div>
                    <p className="text-brand-red font-medium mb-3">{item.price} MAD</p>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center border border-white/10 rounded-full px-2 py-1">
                        <button onClick={() => updateQuantity(item.id, -1)} className="w-8 h-8 flex items-center justify-center hover:text-brand-red transition-colors"><Minus size={14} /></button>
                        <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)} className="w-8 h-8 flex items-center justify-center hover:text-brand-red transition-colors"><Plus size={14} /></button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            {cart.length > 0 && (
              <div className="p-8 border-t border-white/10 bg-brand-gray/50 backdrop-blur-lg">
                <div className="flex justify-between items-end mb-8">
                  <span className="text-brand-beige/40 uppercase tracking-widest text-xs">Subtotal</span>
                  <span className="text-3xl font-serif text-brand-red">{total} MAD</span>
                </div>
                <button className="w-full bg-brand-red hover:bg-red-700 text-white py-5 uppercase tracking-widest text-xs font-bold transition-all shadow-xl hover:scale-[1.02] active:scale-[0.98]">
                  Checkout Now
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
