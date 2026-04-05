import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
  Trash2
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

// --- Data ---
const MENU_ITEMS: MenuItem[] = [
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
  },
  {
    id: 's1',
    name: 'Salmon Sashimi',
    price: 110,
    description: '5 pieces of premium Atlantic salmon, thinly sliced.',
    category: 'Sashimi',
    image: 'https://images.unsplash.com/photo-1534422298391-e4f8c170db76?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 's2',
    name: 'Yellowtail Sashimi',
    price: 130,
    description: '5 pieces of fresh Hamachi with jalapeño and ponzu.',
    category: 'Sashimi',
    image: 'https://images.unsplash.com/photo-1582450871972-ed59640507d5?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'p1',
    name: 'Okasan Deluxe Platter',
    price: 350,
    description: '24 pieces of assorted nigiri, rolls, and sashimi.',
    category: 'Platters',
    image: 'https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'd1',
    name: 'Matcha Green Tea',
    price: 35,
    description: 'Traditional Japanese whisked green tea.',
    category: 'Drinks',
    image: 'https://images.unsplash.com/photo-1582793988951-9aed5509eb97?auto=format&fit=crop&w=800&q=80'
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
  },
  {
    id: 3,
    name: "Youssef Tazi",
    rating: 5,
    comment: "Authentic experience. The minimalist decor really sets the mood for a premium dinner.",
    date: "3 days ago"
  }
];

// --- Components ---

const Navbar = ({ activePage, setActivePage, cartCount, toggleCart }: { 
  activePage: string, 
  setActivePage: (page: string) => void,
  cartCount: number,
  toggleCart: () => void
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', id: 'home' },
    { name: 'Menu', id: 'menu' },
    { name: 'About', id: 'about' },
    { name: 'Reviews', id: 'reviews' },
    { name: 'Contact', id: 'contact' },
  ];

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-brand-dark/90 backdrop-blur-md py-3 shadow-lg' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <div 
          className="cursor-pointer flex items-center gap-2"
          onClick={() => setActivePage('home')}
        >
          <span className="text-2xl font-serif font-bold text-brand-red tracking-widest">OKASAN</span>
          <span className="text-sm font-light tracking-[0.3em] hidden sm:block">SUSHI</span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => setActivePage(link.id)}
              className={`text-sm uppercase tracking-widest transition-colors hover:text-brand-red ${activePage === link.id ? 'text-brand-red' : 'text-brand-beige'}`}
            >
              {link.name}
            </button>
          ))}
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
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = ({ onMenuClick }: { onMenuClick: () => void }) => {
  return (
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
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-6xl md:text-8xl font-serif mb-4 tracking-tighter">Okasan Sushi</h1>
          <p className="text-xl md:text-2xl font-light tracking-[0.2em] mb-10 text-brand-beige/80 italic">
            Authentic Japanese Sushi Experience
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={onMenuClick}
              className="bg-brand-red hover:bg-red-700 text-white px-10 py-4 rounded-none tracking-widest uppercase text-sm transition-all duration-300"
            >
              View Menu
            </button>
            <button 
              onClick={onMenuClick}
              className="border border-brand-beige hover:bg-brand-beige hover:text-brand-dark text-brand-beige px-10 py-4 rounded-none tracking-widest uppercase text-sm transition-all duration-300"
            >
              Order Now
            </button>
          </div>
        </motion.div>
      </div>

      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-brand-beige/40"
      >
        <div className="w-[1px] h-20 bg-gradient-to-b from-brand-beige/40 to-transparent mx-auto"></div>
      </motion.div>
    </section>
  );
};

const QuickInfo = () => {
  return (
    <section className="py-20 bg-brand-gray japanese-texture">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="flex flex-col items-center text-center">
          <div className="flex text-brand-red mb-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={20} fill={i < 4 ? "currentColor" : "none"} />
            ))}
          </div>
          <h3 className="text-xl font-serif mb-1">4.5 Rating</h3>
          <p className="text-brand-beige/60 text-sm">Based on 57 authentic reviews</p>
        </div>
        <div className="flex flex-col items-center text-center">
          <h3 className="text-xl font-serif mb-1">MAD 100–150</h3>
          <p className="text-brand-beige/60 text-sm">Average price per person</p>
        </div>
        <div className="flex flex-col items-center text-center">
          <h3 className="text-xl font-serif mb-1">Full Service</h3>
          <p className="text-brand-beige/60 text-sm">Dine-in, Takeaway & Delivery</p>
        </div>
      </div>
    </section>
  );
};

const FeaturedDishes = ({ onAddToCart }: { onAddToCart: (item: MenuItem) => void }) => {
  const featured = MENU_ITEMS.slice(0, 3);

  return (
    <section className="py-24 bg-brand-dark">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-end mb-16">
          <div>
            <h2 className="text-4xl md:text-5xl font-serif mb-4">Chef's Recommendations</h2>
            <div className="w-20 h-[2px] bg-brand-red"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {featured.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="group relative"
            >
              <div className="overflow-hidden aspect-[4/5] mb-6">
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-brand-dark/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <button 
                    onClick={() => onAddToCart(item)}
                    className="bg-brand-red text-white px-6 py-3 tracking-widest uppercase text-xs"
                  >
                    Add to Cart
                  </button>
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
  );
};

const MenuSection = ({ onAddToCart }: { onAddToCart: (item: MenuItem) => void }) => {
  const categories: MenuItem['category'][] = ['Sushi Rolls', 'Sashimi', 'Platters', 'Drinks'];
  const [activeCategory, setActiveCategory] = useState<MenuItem['category']>('Sushi Rolls');

  return (
    <section className="py-32 bg-brand-dark min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-serif mb-6">Our Menu</h2>
          <p className="text-brand-beige/60 max-w-2xl mx-auto italic">
            Each dish is prepared with the freshest ingredients, following traditional Japanese techniques passed down through generations.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 md:gap-10 mb-16 border-b border-white/10 pb-4">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`text-sm uppercase tracking-[0.2em] pb-4 relative transition-colors ${activeCategory === cat ? 'text-brand-red' : 'text-brand-beige/60'}`}
            >
              {cat}
              {activeCategory === cat && (
                <motion.div layoutId="activeCat" className="absolute bottom-0 left-0 w-full h-[2px] bg-brand-red" />
              )}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12">
          {MENU_ITEMS.filter(item => item.category === activeCategory).map((item) => (
            <motion.div 
              key={item.id}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-between items-start group"
            >
              <div className="flex-1 pr-4">
                <div className="flex items-baseline justify-between mb-2">
                  <h4 className="text-xl font-serif group-hover:text-brand-red transition-colors">{item.name}</h4>
                  <div className="flex-1 border-b border-dotted border-white/20 mx-4"></div>
                  <span className="text-brand-red">{item.price} MAD</span>
                </div>
                <p className="text-brand-beige/50 text-sm italic">{item.description}</p>
              </div>
              <button 
                onClick={() => onAddToCart(item)}
                className="p-2 border border-white/10 hover:bg-brand-red hover:border-brand-red transition-all"
              >
                <Plus size={16} />
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const AboutSection = () => {
  return (
    <section className="py-32 bg-brand-gray japanese-texture overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-6xl font-serif mb-8">The Art of Sushi</h2>
            <div className="space-y-6 text-brand-beige/80 leading-relaxed">
              <p>
                Founded in the heart of Sala Al Jadida, Okasan Sushi was born from a passion for authentic Japanese culinary traditions. "Okasan" means mother in Japanese, reflecting our commitment to the care, warmth, and dedication we put into every dish.
              </p>
              <p>
                Our Master Sushi Chef brings over 20 years of experience, sourcing only the finest seasonal fish from sustainable markets. We believe that great sushi is a balance of temperature, texture, and timing.
              </p>
              <div className="pt-6">
                <h3 className="text-2xl font-serif mb-4 text-brand-red">The Experience</h3>
                <p>
                  Our dining room is designed as a sanctuary of minimalism. From the soft lighting to the natural wood textures, every element is chosen to enhance your sensory journey through Japanese flavors.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-square relative z-10">
              <img 
                src="https://images.unsplash.com/photo-1579027989536-b7b1f875659b?auto=format&fit=crop&w=1000&q=80" 
                alt="Chef preparing sushi"
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -top-10 -right-10 w-full h-full border-2 border-brand-red -z-0"></div>
            <div className="absolute -bottom-6 -left-6 bg-brand-red p-8 z-20 hidden md:block">
              <p className="text-4xl font-serif text-white italic">"Quality is not an act, it is a habit."</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const ReviewsSection = () => {
  return (
    <section className="py-32 bg-brand-dark">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <div className="flex justify-center text-brand-red mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={32} fill={i < 4 ? "currentColor" : "none"} />
            ))}
          </div>
          <h2 className="text-5xl font-serif mb-2">4.5 / 5</h2>
          <p className="text-brand-beige/60 uppercase tracking-widest text-sm">Guest Experiences</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {REVIEWS.map((review) => (
            <div key={review.id} className="bg-brand-gray p-10 border border-white/5 relative">
              <div className="flex text-brand-red mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} />
                ))}
              </div>
              <p className="text-brand-beige/80 italic mb-8 leading-relaxed">"{review.comment}"</p>
              <div className="flex justify-between items-center border-t border-white/10 pt-6">
                <span className="font-serif text-lg">{review.name}</span>
                <span className="text-xs text-brand-beige/40">{review.date}</span>
              </div>
            </div>
          ))}
          {/* Added a realistic mixed review */}
          <div className="bg-brand-gray p-10 border border-white/5 relative">
            <div className="flex text-brand-red mb-6">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} fill={i < 3 ? "currentColor" : "none"} />
              ))}
            </div>
            <p className="text-brand-beige/80 italic mb-8 leading-relaxed">"The food is incredible, but the restaurant was very crowded on Friday night and we had to wait 20 minutes for our table despite having a reservation."</p>
            <div className="flex justify-between items-center border-t border-white/10 pt-6">
              <span className="font-serif text-lg">Karim Idrissi</span>
              <span className="text-xs text-brand-beige/40">2 months ago</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const ContactSection = () => {
  return (
    <section className="py-32 bg-brand-dark japanese-texture">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          <div>
            <h2 className="text-5xl font-serif mb-12">Visit Us</h2>
            
            <div className="space-y-10">
              <div className="flex gap-6">
                <div className="w-12 h-12 bg-brand-red flex items-center justify-center flex-shrink-0">
                  <MapPin size={24} className="text-white" />
                </div>
                <div>
                  <h4 className="text-xl font-serif mb-2">Address</h4>
                  <p className="text-brand-beige/60">3, Res, mag 3 Pass. Salima,<br />Sala Al Jadida 11100, Morocco</p>
                  <button className="text-brand-red text-sm uppercase tracking-widest mt-4 flex items-center gap-2 hover:gap-4 transition-all">
                    Get Directions <ChevronRight size={16} />
                  </button>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="w-12 h-12 bg-brand-red flex items-center justify-center flex-shrink-0">
                  <Phone size={24} className="text-white" />
                </div>
                <div>
                  <h4 className="text-xl font-serif mb-2">Reservations</h4>
                  <p className="text-brand-beige/60">05 37 53 63 81</p>
                  <button className="text-brand-red text-sm uppercase tracking-widest mt-4 flex items-center gap-2 hover:gap-4 transition-all">
                    Call Now <ChevronRight size={16} />
                  </button>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="w-12 h-12 bg-brand-red flex items-center justify-center flex-shrink-0">
                  <Clock size={24} className="text-white" />
                </div>
                <div>
                  <h4 className="text-xl font-serif mb-2">Opening Hours</h4>
                  <p className="text-brand-beige/60">Monday – Sunday<br />12:00 PM – 01:00 AM</p>
                  <p className="text-brand-red text-xs mt-2 uppercase tracking-widest">Open Now</p>
                </div>
              </div>
            </div>
          </div>

          <div className="h-[500px] w-full glass-morphism p-2">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3308.218567117185!2d-6.7538888!3d33.9861111!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xda7694f4f4f4f4f%3A0x4f4f4f4f4f4f4f4f!2sSala%20Al%20Jadida!5e0!3m2!1sen!2sma!4v1620000000000!5m2!1sen!2sma" 
              className="w-full h-full border-0 grayscale contrast-125"
              allowFullScreen={true} 
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
};

const Footer = ({ setActivePage }: { setActivePage: (page: string) => void }) => {
  return (
    <footer className="bg-brand-gray pt-20 pb-10 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <span className="text-2xl font-serif font-bold text-brand-red tracking-widest">OKASAN</span>
            </div>
            <p className="text-brand-beige/50 text-sm leading-relaxed mb-8">
              Authentic Japanese sushi experience in the heart of Sala Al Jadida. Freshness, tradition, and elegance in every bite.
            </p>
            <div className="flex gap-4">
              <button className="w-10 h-10 border border-white/10 flex items-center justify-center hover:bg-brand-red hover:border-brand-red transition-all">
                <Instagram size={18} />
              </button>
              <button className="w-10 h-10 border border-white/10 flex items-center justify-center hover:bg-brand-red hover:border-brand-red transition-all">
                <Facebook size={18} />
              </button>
              <button className="w-10 h-10 border border-white/10 flex items-center justify-center hover:bg-brand-red hover:border-brand-red transition-all">
                <Twitter size={18} />
              </button>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-serif mb-6">Quick Links</h4>
            <ul className="space-y-4 text-sm text-brand-beige/50">
              <li><button onClick={() => setActivePage('home')} className="hover:text-brand-red transition-colors">Home</button></li>
              <li><button onClick={() => setActivePage('menu')} className="hover:text-brand-red transition-colors">Menu</button></li>
              <li><button onClick={() => setActivePage('about')} className="hover:text-brand-red transition-colors">About Us</button></li>
              <li><button onClick={() => setActivePage('reviews')} className="hover:text-brand-red transition-colors">Reviews</button></li>
              <li><button onClick={() => setActivePage('contact')} className="hover:text-brand-red transition-colors">Contact</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-serif mb-6">Contact</h4>
            <ul className="space-y-4 text-sm text-brand-beige/50">
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-brand-red mt-1" />
                <span>3, Res, mag 3 Pass. Salima,<br />Sala Al Jadida 11100</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-brand-red" />
                <span>05 37 53 63 81</span>
              </li>
              <li className="flex items-center gap-3">
                <Clock size={16} className="text-brand-red" />
                <span>12:00 PM – 01:00 AM</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-serif mb-6">Newsletter</h4>
            <p className="text-brand-beige/50 text-sm mb-4">Subscribe for exclusive offers and seasonal menu updates.</p>
            <div className="flex">
              <input 
                type="email" 
                placeholder="Your email" 
                className="bg-brand-dark border border-white/10 px-4 py-2 text-sm w-full focus:outline-none focus:border-brand-red"
              />
              <button className="bg-brand-red px-4 py-2 text-white">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 pt-10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-brand-beige/30 uppercase tracking-widest">
          <p>© 2026 Okasan Sushi. All rights reserved.</p>
          <div className="flex gap-8">
            <button className="hover:text-brand-beige transition-colors">Privacy Policy</button>
            <button className="hover:text-brand-beige transition-colors">Terms of Service</button>
          </div>
        </div>
      </div>
    </footer>
  );
};

const CartDrawer = ({ isOpen, onClose, cart, updateQuantity, removeFromCart }: {
  isOpen: boolean,
  onClose: () => void,
  cart: CartItem[],
  updateQuantity: (id: string, delta: number) => void,
  removeFromCart: (id: string) => void
}) => {
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-brand-dark z-[70] shadow-2xl flex flex-col"
          >
            <div className="p-6 border-b border-white/10 flex justify-between items-center">
              <h3 className="text-2xl font-serif">Your Order</h3>
              <button onClick={onClose} className="p-2 hover:text-brand-red transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <ShoppingBag size={48} className="text-brand-beige/20 mb-4" />
                  <p className="text-brand-beige/40 italic">Your cart is empty</p>
                  <button 
                    onClick={onClose}
                    className="mt-6 text-brand-red uppercase tracking-widest text-sm"
                  >
                    Start Ordering
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="flex gap-4 group">
                    <div className="w-20 h-20 flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <h4 className="font-serif">{item.name}</h4>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="text-brand-beige/20 hover:text-brand-red transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <p className="text-brand-red text-sm mb-3">{item.price} MAD</p>
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-6 h-6 border border-white/10 flex items-center justify-center hover:bg-white/5"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="text-sm w-4 text-center">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-6 h-6 border border-white/10 flex items-center justify-center hover:bg-white/5"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-6 border-t border-white/10 bg-brand-gray">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-brand-beige/60 uppercase tracking-widest text-xs">Subtotal</span>
                  <span className="text-2xl font-serif">{total} MAD</span>
                </div>
                <button className="w-full bg-brand-red text-white py-4 uppercase tracking-[0.2em] text-sm hover:bg-red-700 transition-colors">
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

// --- Main App ---

export default function App() {
  const [activePage, setActivePage] = useState('home');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

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

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const renderPage = () => {
    switch (activePage) {
      case 'home':
        return (
          <>
            <Hero onMenuClick={() => setActivePage('menu')} />
            <QuickInfo />
            <FeaturedDishes onAddToCart={addToCart} />
            <section className="py-24 bg-brand-gray japanese-texture">
              <div className="max-w-7xl mx-auto px-6 text-center">
                <h2 className="text-4xl font-serif mb-12">What Our Guests Say</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {REVIEWS.slice(0, 2).map((review) => (
                    <div key={review.id} className="bg-brand-dark p-10 border border-white/5 text-left">
                      <div className="flex text-brand-red mb-4">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} />
                        ))}
                      </div>
                      <p className="text-brand-beige/80 italic mb-6">"{review.comment}"</p>
                      <span className="font-serif">{review.name}</span>
                    </div>
                  ))}
                </div>
                <button 
                  onClick={() => setActivePage('reviews')}
                  className="mt-12 text-brand-red uppercase tracking-widest text-sm border-b border-brand-red pb-1"
                >
                  View All Reviews
                </button>
              </div>
            </section>
          </>
        );
      case 'menu':
        return <MenuSection onAddToCart={addToCart} />;
      case 'about':
        return <AboutSection />;
      case 'reviews':
        return <ReviewsSection />;
      case 'contact':
        return <ContactSection />;
      default:
        return <Hero onMenuClick={() => setActivePage('menu')} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar 
        activePage={activePage} 
        setActivePage={setActivePage} 
        cartCount={cart.reduce((s, i) => s + i.quantity, 0)}
        toggleCart={() => setIsCartOpen(true)}
      />
      
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <motion.div
            key={activePage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer setActivePage={setActivePage} />

      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        cart={cart}
        updateQuantity={updateQuantity}
        removeFromCart={removeFromCart}
      />

      {/* Global Order Now Button (Mobile) */}
      <div className="fixed bottom-6 right-6 z-40 md:hidden">
        <button 
          onClick={() => setActivePage('menu')}
          className="bg-brand-red text-white p-4 rounded-full shadow-2xl flex items-center justify-center"
        >
          <ShoppingBag size={24} />
        </button>
      </div>
    </div>
  );
}
