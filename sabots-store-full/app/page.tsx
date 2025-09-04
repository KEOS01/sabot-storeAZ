'use client';
import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  Star,
  Truck,
  ShieldCheck,
  RotateCw,
  Search,
  Filter,
  Heart,
  X,
  Check,
  BadgePercent,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";

// --- Utils
const formatEuro = (n: number) =>
  n.toLocaleString("fr-FR", { style: "currency", currency: "EUR" });

// --- Demo data
const SIZES = ["36/37", "38/39", "40/41", "42/43", "44/45"] as const;
const COLORS = [
  { name: "Noir", value: "#111827" },
  { name: "Blanc", value: "#F9FAFB" },
  { name: "Marine", value: "#1F2937" },
  { name: "Menthe", value: "#86efac" },
  { name: "Lavande", value: "#c4b5fd" },
  { name: "Corail", value: "#fb7185" },
] as const;

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  rating: number;
  image: string;
  colors: string[];
  sizes: typeof SIZES[number][];
  tags?: string[];
  badge?: string;
};

const products: Product[] = [
  {
    id: "classic",
    name: "Sabo Classic Confort",
    description:
      "Ultra-léger, respirant et facile à nettoyer. Le sabot polyvalent du quotidien.",
    price: 39.9,
    rating: 4.6,
    image:
      "https://images.unsplash.com/photo-1620799139504-5c1d1f1640b6?q=80&w=1600&auto=format&fit=crop",
    colors: ["#111827", "#F9FAFB", "#86efac", "#c4b5fd"],
    sizes: ["36/37", "38/39", "40/41", "42/43", "44/45"],
    badge: "Best-seller",
  },
  // … tu peux garder les autres produits ici (sport, winter, etc.)
];

type CartItem = {
  key: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  color: string;
  size: typeof SIZES[number];
  qty: number;
};

export default function Page() {
  const [query, setQuery] = useState("");
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);

  const filtered = useMemo(() => {
    return products.filter((p) =>
      p.name.toLowerCase().includes(query.toLowerCase())
    );
  }, [query]);

  const cartSubtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);

  const addToCart = (product: Product) => {
    const key = `${product.id}`;
    setCart((prev) => {
      const ex = prev.find((i) => i.key === key);
      if (ex)
        return prev.map((i) =>
          i.key === key ? { ...i, qty: i.qty + 1 } : i
        );
      return [
        ...prev,
        {
          key,
          productId: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          color: product.colors[0],
          size: product.sizes[0],
          qty: 1,
        },
      ];
    });
    setCartOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50">
      <header className="p-4 border-b flex justify-between">
        <h1 className="font-bold text-xl">Sabots Confort</h1>
        <Sheet open={cartOpen} onOpenChange={setCartOpen}>
          <SheetTrigger asChild>
            <Button>
              <ShoppingCart className="w-4 h-4 mr-2" /> Panier ({cart.length})
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Votre panier</SheetTitle>
            </SheetHeader>
            {cart.length === 0 ? (
              <p className="text-slate-500 mt-4">Panier vide.</p>
            ) : (
              cart.map((i) => (
                <div key={i.key} className="flex justify-between mt-2">
                  <span>{i.name}</span>
                  <span>{formatEuro(i.price * i.qty)}</span>
                </div>
              ))
            )}
            <p className="font-bold mt-4">Total : {formatEuro(cartSubtotal)}</p>
          </SheetContent>
        </Sheet>
      </header>

      <main className="p-6">
        <Input
          placeholder="Rechercher…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          <AnimatePresence>
            {filtered.map((p) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <Card className="rounded-xl overflow-hidden">
                  <img src={p.image} alt={p.name} className="h-40 w-full object-cover" />
                  <CardHeader>
                    <CardTitle>{p.name}</CardTitle>
                    <CardDescription>{p.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="font-bold">{formatEuro(p.price)}</p>
                  </CardContent>
                  <CardFooter>
                    <Button onClick={() => addToCart(p)}>
                      <Check className="w-4 h-4 mr-2" /> Ajouter
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
