# 🚀 nullmock

[![English](https://img.shields.io/badge/Language-English-blue.svg)](README.md)
[![Türkçe](https://img.shields.io/badge/Dil-T%C3%BCrk%C3%A7e-red.svg)](#)
[![Azərbaycanca](https://img.shields.io/badge/Dil-Az%C3%A8rbaycanca-green.svg)](README-az.md)
[![Русский](https://img.shields.io/badge/Язык-Русский-yellow.svg)](README-ru.md)
[![ქართული](https://img.shields.io/badge/ენა-ქართული-orange.svg)](README-ka.md)

Işık hızında, sıfır bağımlılıklı, dosya sistemi tabanlı ve akıllı veri üretme motoruna sahip mock API sunucusu.

Nullmock `.json` dosyalarınızı okur, `/api/users/[id]` gibi dinamik URL rotalarını yakalar, sorgu (query) parametrelerini anlar ve yerleşik sözlükleri veya akıllı tahmin motorunu kullanarak saniyeler içinde devasa boyutlarda sahte veri üretir.

## ✨ Özellikler

- **Sıfır Bağımlılık:** Saf Node.js. `express`, `faker` veya şişkin `node_modules` klasörleri yok.
- **Dosya Sistemi Yönlendirmesi:** API rotalarınızı klasörler belirler (Örn: `mocks/api/users/[id]/GET.json`).
- **Akıllı Veri Motoru:** JSON anahtarlarından veri tiplerini otomatik tahmin eder (Örn: `created_at` için gerçek tarih, `user_email` için e-posta üretir).
- **Yerleşik Sözlükler:** Gerçekçi bölgesel veriler üretmek için `{{firstName:tr}}` veya `{{city:tr}}` gibi etiketler kullanın.
- **Çoğaltma (Repeat) Komutu:** Şablonunuza sadece `"_repeat": 100` ekleyerek milisaniyeler içinde 100 kullanıcı üretin.
- **Kütüphane Modu:** Sunucuyu başlatmadan motoru doğrudan Node.js betiklerinize (script) import edin.

## 📦 Kurulum ve Hızlı Başlangıç

Proje iskeletini oluşturmak için projenizin kök dizininde şu komutu çalıştırın:

```bash
npx nullmock init
```

Bu komut aşağıdaki yapıyı kuracaktır:
- `mocks/`: API endpoint'leriniz için ana klasör.
- `mocks/locales/`: Kendi özel `.json` sözlüklerinizi buraya atın.
- `mocks/_examples/`: Anında başlamanız için **6 Altın API Şablonu** içerir.

*(Örneklerin oluşturulmasını atlamak için şunu çalıştırın: `npx nullmock init --no-examples`)*

## 🚦 Sunucuyu Başlatma

**Seçenek 1: Hızlı Başlangıç**
```bash
npx nullmock
```

**Seçenek 2: NPM Scripts (Önerilen)**
Bunu `package.json` dosyanıza ekleyin:
```json
"scripts": {
  "mock": "nullmock"
}
```
Ardından çalıştırın: `npm run mock`

---

## 📂 6 Altın Şablon (`_examples`)

`init` komutunu çalıştırdığınızda, Nullmock size endüstri standardı 6 şablon sunar. Bunları kopyalayıp API klasörlerinize yapıştırabilirsiniz:

1. **`1_basic_list.json`**: Basit, düz bir öğe dizisi (kategoriler, ülkeler için kullanışlıdır).
2. **`2_paginated_list.json`**: Standart sayfalamalı (offset pagination) yapı (current_page, data, total).
3. **`3_infinite_scroll.json`**: İmleç (cursor) tabanlı sayfalama yapısı (has_more, next_cursor).
4. **`4_single_resource.json`**: Tek bir öğe için detaylı obje (Örn: `/users/60`).
5. **`5_dashboard_overview.json`**: Hem özet metrikleri hem de son etkinlik dizilerini içeren hibrit yapı.
6. **`6_lazy_auto_mock.json`**: Sıfır yapılandırmalı şablon. Sadece anahtarları yazın (Örn: `"user_email": ""`), değerleri boş bırakın; Nullmock'un akıllı motoru onları tahmin edip doldursun!

---

## 🌍 Yerleşik Sözlükler (Locales)

Nullmock, hızlı prototipleme için yerleşik bölgesel verilerle gelir. JSON dosyalarınızda `{{category:lang}}` sözdizimini kullanın.

**Desteklenen Yerleşik Diller:**
- `en` (İngilizce)
- `tr` (Türkçe)
- `az` (Azerbaycanca)
- `ru` (Rusça)
- `ka` (Gürcüce)

**Kullanım Örneği:**
```json
{
  "name": "{{firstName:tr}} {{lastName:tr}}",
  "location": "{{city:tr}}"
}
```

**Özel Sözlükler (Custom Dictionaries):**
Kendi verilerinizi mi kullanmak istiyorsunuz? Sadece `mocks/locales/` klasörü içine `tr.json` veya `my_data.json` oluşturun. Nullmock, projenizin sözlüklerine otomatik olarak yerleşik olanlardan daha yüksek öncelik verecektir.

---

## 🧠 Nullmock'u Kütüphane Olarak Kullanmak (Import)

Nullmock'u bir sunucu olarak kullanmak zorunda değilsiniz. Güçlü üretim motorunu doğrudan backend betiklerinize, testlerinize veya seeder'larınıza import edebilirsiniz!

```javascript
const { deepScanAndRepeat } = require('nullmock');

const myTemplate = {
  "_repeat": 3,
  "id": "{{id}}",
  "email": "", // Akıllı tahmin
  "name": "{{firstName:tr}}"
};

// Anında veri üretin! (Dinamik parametre olarak { id: 10 } gönderiyoruz)
const fakeData = deepScanAndRepeat(myTemplate, { id: 10 });

console.log(fakeData);
```

## 🤝 Katkıda Bulunma
Katkılarınız her zaman değerlidir! Lütfen Pull Request'lerinizi `develop` dalına (branch) yönlendirin.

## 📄 Lisans
MIT © modoldern