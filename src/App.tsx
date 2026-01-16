import React, { useState, useMemo } from 'react';

// --- TİPLEMELER ---
type UserRole = 'ADMIN' | 'USER' | 'GUEST';
interface OcakData {
  id: string;
  name: string;
  lat: number;
  lng: number;
  details: {
    ruhsat: string;
    kapasite: string;
    sonDenetim: string;
    resimUrl: string;
    personel: string;
  }
}

function App() {
  const [role, setRole] = useState<UserRole>('GUEST');
  const [selectedOcak, setSelectedOcak] = useState<OcakData | null>(null);
  const [search, setSearch] = useState('');

  // KML'den gelen gerçek profesyonel veri yapısı
  const ocaklar: OcakData[] = [
    { 
      id: '1', name: 'ARSİM KALKER OCAĞI', lat: 38.2765, lng: 40.0615, 
      details: { ruhsat: '2023-A42', kapasite: '1.5M Ton/Yıl', sonDenetim: '12.10.2023', resimUrl: 'https://images.unsplash.com/photo-1578345218746-50a229b3d0f8?w=500', personel: 'Ahmet Karadağ' }
    },
    { 
      id: '2', name: 'KARAŞİN BAZALT OCAĞI', lat: 38.0523, lng: 40.0758, 
      details: { ruhsat: '2024-B12', kapasite: '850K Ton/Yıl', sonDenetim: '05.11.2023', resimUrl: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=500', personel: 'Süleyman Demir' }
    }
  ];

  const filteredOcaklar = ocaklar.filter(o => o.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex h-screen w-full bg-[#0f172a] text-slate-200 overflow-hidden font-sans">
      {/* SOL NAVİGASYON - KURUMSAL PANEL */}
      <aside className="w-[400px] flex flex-col bg-[#1e293b] border-r border-slate-700 shadow-2xl z-20">
        <div className="p-6 bg-[#0f172a] border-b border-slate-700">
          <div className="flex items-center justify-between">
             <h1 className="text-xl font-bold tracking-tighter text-blue-500">OCAK YÖNETİM v3</h1>
             <span className={`px-2 py-1 text-[10px] rounded ${role === 'ADMIN' ? 'bg-red-500/20 text-red-500' : 'bg-blue-500/20 text-blue-500'}`}>
               {role}
             </span>
          </div>
          <input 
            type="text" 
            placeholder="Ocaklarda ara..." 
            className="w-full mt-4 bg-[#1e293b] border border-slate-700 rounded-lg p-3 text-sm outline-none focus:border-blue-500 transition-all"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
          {filteredOcaklar.map(o => (
            <div 
              key={o.id}
              onClick={() => setSelectedOcak(o)}
              className={`p-4 mb-2 rounded-xl cursor-pointer transition-all ${selectedOcak?.id === o.id ? 'bg-blue-600 text-white shadow-lg' : 'hover:bg-slate-700'}`}
            >
              <div className="font-bold">{o.name}</div>
              <div className="text-[11px] opacity-60 flex justify-between mt-1">
                <span>📍 {o.lat}, {o.lng}</span>
                <span>{role !== 'GUEST' ? 'VERİ AKTİF' : 'VERİ KİLİTLİ'}</span>
              </div>
            </div>
          ))}
        </div>

        {/* ALT KISIM - KULLANICI AYARLARI */}
        <div className="p-4 bg-[#0f172a] border-t border-slate-700">
           <button 
             onClick={() => setRole(role === 'GUEST' ? 'ADMIN' : 'GUEST')}
             className="w-full bg-slate-800 hover:bg-slate-700 p-3 rounded-lg text-sm font-semibold transition-all"
           >
             {role === 'GUEST' ? 'Yönetici Girişi Yap' : 'Oturumu Kapat'}
           </button>
        </div>
      </aside>

      {/* HARİTA VE DETAY ALANI */}
      <main className="flex-1 relative">
        <iframe 
          className="w-full h-full grayscale-[20%] contrast-[1.1]"
          src={selectedOcak ? `https://www.google.com/maps?q=${selectedOcak.lat},${selectedOcak.lng}&z=15&t=k&output=embed` : `https://www.google.com/maps?q=38.0,40.0&z=8&t=k&output=embed`}
          frameBorder="0"
        ></iframe>

        {/* KAYAR DETAY PANELİ (Sadece Yetkililere) */}
        {selectedOcak && (
          <div className={`absolute bottom-6 left-6 right-6 bg-white rounded-2xl shadow-2xl p-6 transition-all transform ${role === 'GUEST' ? 'translate-y-[80%]' : 'translate-y-0'}`}>
            <div className="flex justify-between items-start">
              <div className="text-slate-900">
                <h2 className="text-2xl font-black">{selectedOcak.name}</h2>
                <p className="text-slate-500 text-sm">Ocak Veri Dosyası - Gizli Belge</p>
              </div>
              <button 
                onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${selectedOcak.lat},${selectedOcak.lng}`)}
                className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 shadow-xl shadow-blue-500/30"
              >
                YOL TARİFİ AL
              </button>
            </div>

            <div className={`grid grid-cols-4 gap-6 mt-6 ${role === 'GUEST' ? 'blur-md pointer-events-none' : ''}`}>
               <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Ruhsat Numarası</div>
                  <div className="text-slate-800 font-bold">{selectedOcak.details.ruhsat}</div>
               </div>
               <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Üretim Kapasitesi</div>
                  <div className="text-slate-800 font-bold">{selectedOcak.details.kapasite}</div>
               </div>
               <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Saha Sorumlusu</div>
                  <div className="text-slate-800 font-bold">{selectedOcak.details.personel}</div>
               </div>
               <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Son Denetim</div>
                  <div className="text-slate-800 font-bold">{selectedOcak.details.sonDenetim}</div>
               </div>
            </div>

            {role === 'GUEST' && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/40 backdrop-blur-[2px] rounded-2xl">
                <p className="text-red-600 font-black text-lg bg-white px-4 py-2 rounded-lg shadow-xl">
                  ⚠️ TEKNİK VERİLERİ GÖRMEK İÇİN YETKİLİ GİRİŞİ GEREKLİ
                </p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
